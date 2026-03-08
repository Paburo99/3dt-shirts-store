<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\WompiService;
use App\Enums\OrderStatus;
use App\Notifications\OrderConfirmed;
use Illuminate\Support\Facades\Notification;

class PaymentController extends Controller
{
    public function show($reference)
    {
        $order = Order::with('items.sku.product')->where('reference', $reference)->firstOrFail();

        // If the order is already paid or processing, redirect them away
        if ($order->status->value !== 'pending_payment') {
            return redirect()->route('shop')
                ->with('message', 'This order is already processed.');
        }

        $amountInCents = (int) ($order->total_amount * 100);
        $currency = 'COP';
        $integritySecret = config('wompi.integrity_secret');

        // Wompi Integrity Signature Formula:
        // SHA256(reference + amount_in_cents + currency + integrity_secret)
        $concatenatedString = $order->reference . $amountInCents . $currency . $integritySecret;
        $signature = hash('sha256', $concatenatedString);

        return Inertia::render('Checkout/Payment', [
            'order' => $order,
            'wompiPublicKey' => config('wompi.public_key'),
            'amountInCents' => $amountInCents,
            'signature' => $signature, // Pass the cryptographic hash to React
        ]);
    }

    public function complete(Request $request, $reference, WompiService $wompiService)
    {
        // Fetch the order to display its final status to the user
        $order = Order::with('items.sku')->where('reference', $reference)->firstOrFail();

        if ($order->status->value === 'pending_payment' && $request->has('id')) {
            $transactionData = $wompiService->getTransaction($request->query('id'));

            if ($transactionData && isset($transactionData['status'])) {
                if ($transactionData['status'] === 'APPROVED') {
                    $order->update([
                        'status' => OrderStatus::PROCESSING,
                        'wompi_transaction_id' => $transactionData['id'],
                    ]);

                    Notification::route('mail', $order->customer_email)
                        ->notify(new OrderConfirmed($order));
                } elseif (in_array($transactionData['status'], ['DECLINED', 'ERROR', 'VOIDED'])) {
                    $order->update(['status' => OrderStatus::FAILED]);
                    
                    // Restore stock
                    foreach ($order->items as $item) {
                        $item->sku()->increment('stock', $item->quantity);
                    }
                }
            }
        }

        return Inertia::render('Checkout/Complete', [
            'order' => $order,
        ]);
    }
}
