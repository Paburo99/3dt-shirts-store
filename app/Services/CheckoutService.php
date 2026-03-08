<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Sku;
use App\Enums\OrderStatus;
use Illuminate\Support\Facades\DB;
use Exception;

class CheckoutService
{
    /**
     * @param array $cartItems Array of['sku_id' => int, 'quantity' => int]
     * @param int|null $userId
     * @return Order
     * @throws Exception
     */
    public function createOrder(array $cartItems, ?int $userId = null): Order
    {
        // DB::transaction ensures that if anything fails, ALL database changes are rolled back.
        return DB::transaction(function () use ($cartItems, $userId) {
            
            // 1. Extract and SORT the SKU IDs. 
            // ACADEMIC FLEX: Sorting IDs before locking prevents "Deadlocks" if two concurrent 
            // transactions try to lock the same SKUs in different orders.
            $skuIds = collect($cartItems)->pluck('sku_id')->sort()->values()->toArray();

            // 2. Fetch and LOCK the rows in PostgreSQL
            // Translates to: SELECT * FROM skus WHERE id IN (...) FOR UPDATE
            $skus = Sku::whereIn('id', $skuIds)->lockForUpdate()->get()->keyBy('id');

            $totalAmount = 0;
            $orderItemsData =[];

            // 3. Validate stock strictly against the LOCKED database rows
            foreach ($cartItems as $item) {
                $sku = $skus->get($item['sku_id']);
                
                if (! $sku) {
                    throw new Exception("SKU not found.");
                }

                if ($sku->stock < $item['quantity']) {
                    throw new Exception("Insufficient stock for item: {$sku->color} Size {$sku->size}.");
                }

                // Deduct stock to reserve it. (If Wompi payment fails later, we will restore it).
                $sku->stock -= $item['quantity'];
                $sku->save();

                // Calculate price (use override if exists, else base price)
                $unitPrice = $sku->price_override ?? $sku->product->base_price;
                $totalAmount += $unitPrice * $item['quantity'];

                $orderItemsData[] =[
                    'sku_id' => $sku->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                ];
            }

            // 4. Create the Pending Order
            $order = Order::create([
                'user_id' => $userId,
                'reference' => 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid()),
                'status' => OrderStatus::PENDING_PAYMENT,
                'total_amount' => $totalAmount,
            ]);

            // 5. Attach Items
            $order->items()->createMany($orderItemsData);

            return $order;
        });
    }
}