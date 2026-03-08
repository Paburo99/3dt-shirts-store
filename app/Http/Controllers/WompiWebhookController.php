<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

class WompiWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();

        // 1. Cryptographic Signature Validation (Academic Flex)
        if (!$this->verifySignature($payload)) {
            Log::warning('Wompi Webhook signature mismatch.',['reference' => Arr::get($payload, 'data.transaction.reference')]);
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        // 2. Extract Data
        $reference = Arr::get($payload, 'data.transaction.reference');
        $status = Arr::get($payload, 'data.transaction.status'); // e.g., 'APPROVED', 'DECLINED'
        $transactionId = Arr::get($payload, 'data.transaction.id');

        $order = Order::where('reference', $reference)->first();

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        // 3. Update the Order State Machine based on Wompi's exact status
        if ($status === 'APPROVED') {
            $order->update([
                'status' => OrderStatus::PROCESSING,
                'wompi_transaction_id' => $transactionId,
            ]);
            Log::info("Order {$reference} paid successfully.");
        } 
        elseif (in_array($status,['DECLINED', 'ERROR', 'VOIDED'])) {
            $order->update(['status' => OrderStatus::FAILED]);
            
            // Critical: If payment fails, RESTORE the physical stock!
            foreach ($order->items as $item) {
                $item->sku()->increment('stock', $item->quantity);
            }
            Log::info("Order {$reference} payment failed. Stock restored.");
        }

        // Wompi requires a 200 OK response, otherwise it will keep retrying.
        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Wompi dynamically tells us which properties to hash to verify the payload.
     */
    private function verifySignature(array $payload): bool
    {
        $signatureProperties = Arr::get($payload, 'signature.properties',[]);
        $providedChecksum = Arr::get($payload, 'signature.checksum');
        $timestamp = Arr::get($payload, 'timestamp');
        $secret = env('WOMPI_EVENTS_SECRET');

        $concatenatedString = '';
        foreach ($signatureProperties as $property) {
            $concatenatedString .= Arr::get($payload, "data.{$property}");
        }
        $concatenatedString .= $timestamp . $secret;

        $calculatedChecksum = hash('sha256', $concatenatedString);

        return hash_equals($calculatedChecksum, $providedChecksum);
    }
}