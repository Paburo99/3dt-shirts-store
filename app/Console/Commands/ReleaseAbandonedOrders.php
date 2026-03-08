<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Enums\OrderStatus;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReleaseAbandonedOrders extends Command
{
    protected $signature = 'orders:release-abandoned';
    protected $description = 'Releases locked inventory for orders that have been pending for too long.';

    public function handle()
    {
        // Find orders stuck in pending_payment for more than 15 minutes
        $abandonedOrders = Order::with('items.sku')
            ->where('status', OrderStatus::PENDING_PAYMENT)
            ->where('created_at', '<', Carbon::now()->subMinutes(15))
            ->get();

        if ($abandonedOrders->isEmpty()) {
            $this->info('No abandoned orders found.');
            return;
        }

        foreach ($abandonedOrders as $order) {
            // 1. Mark as cancelled
            $order->update(['status' => OrderStatus::CANCELLED]);

            // 2. Restore the inventory
            foreach ($order->items as $item) {
                $item->sku()->increment('stock', $item->quantity);
            }

            Log::info("Order {$order->reference} was abandoned. Stock restored.");
            $this->line("Released Order: {$order->reference}");
        }

        $this->info('Abandoned orders processed successfully.');
    }
}