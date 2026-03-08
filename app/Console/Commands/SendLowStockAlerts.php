<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\Sku;
use App\Models\User;
use App\Notifications\LowStockAlert;
use Illuminate\Console\Command;

class SendLowStockAlerts extends Command
{
    protected $signature = 'store:low-stock-alert';

    protected $description = 'Send email alerts to admins when SKUs are low or out of stock';

    public function handle(): int
    {
        $outOfStock = Sku::with('product')->where('stock', 0)->get();
        $lowStock = Sku::with('product')->where('stock', '>', 0)->where('stock', '<=', 3)->get();

        if ($outOfStock->isEmpty() && $lowStock->isEmpty()) {
            $this->info('All SKUs have healthy stock levels.');
            return self::SUCCESS;
        }

        $admins = User::whereIn('role', [UserRole::ADMIN->value, UserRole::SUPER_ADMIN->value])->get();

        if ($admins->isEmpty()) {
            $this->warn('No admin users found to notify.');
            return self::FAILURE;
        }

        foreach ($admins as $admin) {
            $admin->notify(new LowStockAlert($lowStock, $outOfStock));
        }

        $this->info("Low stock alert sent to {$admins->count()} admin(s). ({$outOfStock->count()} out of stock, {$lowStock->count()} low)");

        return self::SUCCESS;
    }
}
