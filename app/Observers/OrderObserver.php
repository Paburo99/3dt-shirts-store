<?php

namespace App\Observers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\Notification;

class OrderObserver
{
    public function updated(Order $order): void
    {
        if (!$order->wasChanged('status') || !$order->customer_email) {
            return;
        }

        $notifiableStatuses = [
            OrderStatus::SHIPPED,
            OrderStatus::DELIVERED,
            OrderStatus::CANCELLED,
        ];

        if (in_array($order->status, $notifiableStatuses)) {
            Notification::route('mail', $order->customer_email)
                ->notify(new OrderStatusChanged($order, $order->status));
        }
    }
}
