<?php

namespace App\Notifications;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Order $order,
        public OrderStatus $newStatus,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusLabel = ucwords(str_replace('_', ' ', $this->newStatus->value));

        $message = (new MailMessage)
            ->subject("Order #{$this->order->reference} — {$statusLabel}")
            ->greeting("Hello, {$this->order->customer_name}!")
            ->line("Your order **#{$this->order->reference}** has been updated.")
            ->line("**New Status:** {$statusLabel}");

        $message = match ($this->newStatus) {
            OrderStatus::SHIPPED => $message
                ->line('Your order is on its way! You should receive it within the estimated delivery window.')
                ->action('Track Your Order', url("/orders/{$this->order->reference}")),
            OrderStatus::DELIVERED => $message
                ->line('Your order has been delivered. We hope you love your new items!')
                ->action('View Order Details', url("/orders/{$this->order->reference}")),
            OrderStatus::CANCELLED => $message
                ->line('Your order has been cancelled. If you did not request this, please contact our support team.'),
            default => $message
                ->action('View Order', url("/orders/{$this->order->reference}")),
        };

        return $message->salutation('— The 3D Shirts Team');
    }
}
