<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with('items.sku.product')
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show($reference)
    {
        $order = auth()->user()
            ->orders()
            ->with('items.sku.product')
            ->where('reference', $reference)
            ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
