<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class LowStockAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Collection $lowStockSkus,
        public Collection $outOfStockSkus,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('⚠ Low Stock Alert — Action Required')
            ->greeting('Stock Alert')
            ->line("**{$this->outOfStockSkus->count()}** SKUs are out of stock and **{$this->lowStockSkus->count()}** are running low.");

        if ($this->outOfStockSkus->isNotEmpty()) {
            $message->line('**Out of Stock:**');
            foreach ($this->outOfStockSkus->take(10) as $sku) {
                $message->line("• {$sku->product->name} — {$sku->code} (0 remaining)");
            }
        }

        if ($this->lowStockSkus->isNotEmpty()) {
            $message->line('**Low Stock (≤ 3 remaining):**');
            foreach ($this->lowStockSkus->take(10) as $sku) {
                $message->line("• {$sku->product->name} — {$sku->code} ({$sku->stock} remaining)");
            }
        }

        return $message
            ->action('Go to Admin Panel', url('/admin'))
            ->salutation('— 3D Shirts System');
    }
}
