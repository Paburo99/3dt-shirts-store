<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use App\Services\CheckoutService;
use Exception;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $savedAddresses = $user ? $user->addresses()->orderByDesc('is_default')->get() : [];

        return Inertia::render('Checkout/Index', [
            'savedAddresses' => $savedAddresses,
            'user' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
        ]);
    }

    public function store(Request $request, CheckoutService $checkoutService)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.sku_id' => 'required|exists:skus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:100',
            'shipping_department' => 'required|string|max:100',
            'shipping_notes' => 'nullable|string|max:500',
            'save_address' => 'nullable|boolean',
        ]);

        try {
            $shippingData = [
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_department' => $validated['shipping_department'],
                'shipping_notes' => $validated['shipping_notes'] ?? null,
            ];

            $order = $checkoutService->createOrder(
                $validated['items'],
                auth()->id(),
                $shippingData
            );

            if (auth()->check() && ($validated['save_address'] ?? false)) {
                Address::create([
                    'user_id' => auth()->id(),
                    'label' => 'Shipping',
                    'name' => $validated['customer_name'],
                    'phone' => $validated['customer_phone'],
                    'address' => $validated['shipping_address'],
                    'city' => $validated['shipping_city'],
                    'department' => $validated['shipping_department'],
                    'notes' => $validated['shipping_notes'] ?? null,
                    'is_default' => auth()->user()->addresses()->count() === 0,
                ]);
            }

            return redirect()->route('order.pay', ['reference' => $order->reference]);

        } catch (Exception $e) {
            return back()->withErrors(['cart' => $e->getMessage()]);
        }
    }
}