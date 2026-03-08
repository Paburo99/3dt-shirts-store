<?php

use App\Models\Product;
use App\Models\Sku;
use App\Services\CheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

$shippingData = [
    'customer_name'       => 'Stock Test User',
    'customer_email'      => 'stock@example.com',
    'customer_phone'      => '3001234567',
    'shipping_address'    => '123 Stock St',
    'shipping_city'       => 'Bogotá',
    'shipping_department' => 'Cundinamarca',
];

beforeEach(function () use ($shippingData) {
    $this->shippingData = $shippingData;

    $this->product = Product::create([
        'name' => 'Stock Test Product',
        'slug' => 'stock-test',
        'base_price' => 50000,
        'description' => 'Product for stock tests',
    ]);

    $this->sku = Sku::create([
        'product_id' => $this->product->id,
        'code' => 'STK-BLK-S',
        'color' => '#000000',
        'size' => 'S',
        'stock' => 3,
    ]);
});

it('decrements stock correctly on purchase', function () {
    $service = app(CheckoutService::class);

    $service->createOrder(
        [['sku_id' => $this->sku->id, 'quantity' => 2]],
        null,
        $this->shippingData
    );

    expect($this->sku->fresh()->stock)->toBe(1);
});

it('prevents purchase when stock is zero', function () {
    $this->sku->update(['stock' => 0]);

    $service = app(CheckoutService::class);

    $service->createOrder(
        [['sku_id' => $this->sku->id, 'quantity' => 1]],
        null,
        $this->shippingData
    );
})->throws(\Exception::class, 'Insufficient stock');

it('prevents purchase exceeding available stock', function () {
    $service = app(CheckoutService::class);

    $service->createOrder(
        [['sku_id' => $this->sku->id, 'quantity' => 4]],
        null,
        $this->shippingData
    );
})->throws(\Exception::class, 'Insufficient stock');

it('handles multiple items stock decrement correctly', function () {
    $sku2 = Sku::create([
        'product_id' => $this->product->id,
        'code' => 'STK-RED-M',
        'color' => '#FF0000',
        'size' => 'M',
        'stock' => 5,
    ]);

    $service = app(CheckoutService::class);

    $service->createOrder(
        [
            ['sku_id' => $this->sku->id, 'quantity' => 1],
            ['sku_id' => $sku2->id, 'quantity' => 2],
        ],
        null,
        $this->shippingData
    );

    expect($this->sku->fresh()->stock)->toBe(2);
    expect($sku2->fresh()->stock)->toBe(3);
});
