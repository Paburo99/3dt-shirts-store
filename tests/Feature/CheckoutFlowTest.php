<?php

use App\Models\Product;
use App\Models\Sku;
use App\Models\User;
use App\Models\Order;
use App\Services\CheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Reusable shipping payload for CheckoutService calls
$shippingData = [
    'customer_name'       => 'Test User',
    'customer_email'      => 'test@example.com',
    'customer_phone'      => '3001234567',
    'shipping_address'    => '123 Test St',
    'shipping_city'       => 'Bogotá',
    'shipping_department' => 'Cundinamarca',
];

beforeEach(function () use ($shippingData) {
    $this->shippingData = $shippingData;

    $this->product = Product::create([
        'name' => 'Test Hoodie',
        'slug' => 'test-hoodie',
        'base_price' => 120000,
        'description' => 'A test hoodie',
    ]);

    $this->sku = Sku::create([
        'product_id' => $this->product->id,
        'code' => 'TEST-BLK-M',
        'color' => '#000000',
        'size' => 'M',
        'stock' => 10,
    ]);
});

it('creates an order with correct total', function () {
    $service = app(CheckoutService::class);

    $order = $service->createOrder(
        [['sku_id' => $this->sku->id, 'quantity' => 2]],
        null,
        $this->shippingData
    );

    expect($order)->toBeInstanceOf(Order::class)
        ->and((float) $order->total_amount)->toBe(240000.0)
        ->and($order->items)->toHaveCount(1)
        ->and($order->items->first()->quantity)->toBe(2);
});

it('decrements stock after checkout', function () {
    $service = app(CheckoutService::class);

    $service->createOrder(
        [['sku_id' => $this->sku->id, 'quantity' => 3]],
        null,
        $this->shippingData
    );

    expect($this->sku->fresh()->stock)->toBe(7);
});

it('rejects checkout with insufficient stock', function () {
    $service = app(CheckoutService::class);

    $service->createOrder(
        [['sku_id' => $this->sku->id, 'quantity' => 999]],
        null,
        $this->shippingData
    );
})->throws(\Exception::class, 'Insufficient stock');

it('rejects checkout with invalid sku', function () {
    $service = app(CheckoutService::class);

    $service->createOrder(
        [['sku_id' => 99999, 'quantity' => 1]],
        null,
        $this->shippingData
    );
})->throws(\Exception::class, 'SKU not found');

it('stores order via checkout endpoint', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('checkout.store'), [
        'items'               => [['sku_id' => $this->sku->id, 'quantity' => 1]],
        'customer_name'       => 'Test User',
        'customer_email'      => 'test@example.com',
        'customer_phone'      => '3001234567',
        'shipping_address'    => '123 Test St',
        'shipping_city'       => 'Bogotá',
        'shipping_department' => 'Cundinamarca',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('orders', ['customer_name' => 'Test User']);
});
