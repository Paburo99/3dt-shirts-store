<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $recentOrders = $user->orders()
            ->with('items.sku.product')
            ->latest()
            ->take(5)
            ->get();

        $stats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()
                ->whereIn('status', ['processing', 'shipped', 'delivered'])
                ->sum('total_amount'),
            'saved_addresses' => $user->addresses()->count(),
        ];

        return Inertia::render('Dashboard', [
            'recentOrders' => $recentOrders,
            'stats' => $stats,
        ]);
    }
}
