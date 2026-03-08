<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNewUser extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to 3D Shirts!')
            ->greeting("Hey {$notifiable->name}, welcome aboard!")
            ->line('Thanks for creating your account at 3D Shirts.')
            ->line('You can now customize premium apparel in 3D, save your shipping addresses, and track every order from your dashboard.')
            ->action('Start Shopping', url('/shop'))
            ->line('If you have any questions, just reply to this email.')
            ->salutation('— The 3D Shirts Team');
    }
}
