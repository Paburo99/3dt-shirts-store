<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;

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

    public function complete($reference)
    {
        // Fetch the order to display its final status to the user
        $order = Order::where('reference', $reference)->firstOrFail();

        return Inertia::render('Checkout/Complete', [
            'order' => $order,
        ]);
    }
}
