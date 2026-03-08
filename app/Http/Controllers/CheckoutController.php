<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CheckoutService;
use Exception;

class CheckoutController extends Controller
{
    public function store(Request $request, CheckoutService $checkoutService)
    {
        // Validate incoming cart payload from React
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.sku_id' => 'required|exists:skus,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            // Process the transaction securely
            $order = $checkoutService->createOrder(
                $validated['items'], 
                auth()->id() // Will be null if guest
            );

            // Redirect to a payment page (We will build the Wompi integration in Phase 6)
            return redirect()->route('order.pay', ['reference' => $order->reference]);

        } catch (Exception $e) {
            // If stock is insufficient, redirect back to the 3D configurator with an error
            return back()->withErrors(['cart' => $e->getMessage()]);
        }
    }
}