<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\Sku;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        $totalRevenue = Order::where('status', OrderStatus::PROCESSING)
            ->orWhere('status', OrderStatus::SHIPPED)
            ->orWhere('status', OrderStatus::DELIVERED)
            ->sum('total_amount');

        $pendingOrders = Order::where('status', OrderStatus::PENDING_PAYMENT)->count();
        $totalCustomers = User::where('role', 'user')->count();
        $lowStockSkus = Sku::where('stock', '<=', 3)->where('stock', '>', 0)->count();
        $outOfStock = Sku::where('stock', 0)->count();

        return [
            Stat::make('Total Revenue', 'COP ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('From paid orders')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('Pending Orders', $pendingOrders)
                ->description('Awaiting payment')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingOrders > 0 ? 'warning' : 'success'),
            Stat::make('Total Orders', Order::count())
                ->description('All time')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),
            Stat::make('Customers', $totalCustomers)
                ->description('Registered users')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
            Stat::make('Low Stock', $lowStockSkus)
                ->description($outOfStock . ' out of stock')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color($lowStockSkus > 0 ? 'warning' : 'success'),
            Stat::make('Products', Product::count())
                ->description(Sku::count() . ' total SKUs')
                ->descriptionIcon('heroicon-m-cube')
                ->color('primary'),
        ];
    }
}
