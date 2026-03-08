<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Sku;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\DB;
use Exception;

class CheckoutService
{
    public function createOrder(array $cartItems, ?int $userId = null, array $shippingData = []): Order
    {
        return DB::transaction(function () use ($cartItems, $userId, $shippingData) {

            $skuIds = collect($cartItems)->pluck('sku_id')->sort()->values()->toArray();
            $skus = Sku::whereIn('id', $skuIds)->lockForUpdate()->get()->keyBy('id');

            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($cartItems as $item) {
                $sku = $skus->get($item['sku_id']);

                if (! $sku) {
                    throw new Exception("SKU not found.");
                }

                if ($sku->stock < $item['quantity']) {
                    throw new Exception("Insufficient stock for item: {$sku->color} Size {$sku->size}.");
                }

                $sku->stock -= $item['quantity'];
                $sku->save();

                $unitPrice = $sku->price_override ?? $sku->product->base_price;
                $totalAmount += $unitPrice * $item['quantity'];

                $orderItemsData[] = [
                    'sku_id' => $sku->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                ];
            }

            $order = Order::create(array_merge([
                'user_id' => $userId,
                'reference' => 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid()),
                'status' => OrderStatus::PENDING_PAYMENT,
                'total_amount' => $totalAmount,
            ], $shippingData));

            $order->items()->createMany($orderItemsData);

            return $order;
        });
    }
}