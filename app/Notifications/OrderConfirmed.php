<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $order = $this->order->load('items.sku.product');
        $itemCount = $order->items->sum('quantity');

        $message = (new MailMessage)
            ->subject("Order Confirmed — #{$order->reference}")
            ->greeting("Thank you for your purchase, {$order->customer_name}!")
            ->line("Your payment has been received and your order is now being processed.")
            ->line("**Order Reference:** {$order->reference}")
            ->line("**Items:** {$itemCount}")
            ->line("**Total:** COP " . number_format($order->total_amount, 0, ',', '.'))
            ->action('View Your Order', url("/orders/{$order->reference}"));

        foreach ($order->items as $item) {
            $productName = $item->sku->product->name ?? 'Product';
            $size = $item->sku->size ?? '';
            $message->line("• {$productName} ({$size}) × {$item->quantity} — COP " . number_format($item->price * $item->quantity, 0, ',', '.'));
        }

        return $message
            ->line('We will notify you when your order ships.')
            ->salutation('— The 3D Shirts Team');
    }
}
