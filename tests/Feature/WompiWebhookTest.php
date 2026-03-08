<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sku;
use App\Notifications\OrderConfirmed;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
    $product = Product::create([
        'name' => 'Test Crewneck',
        'slug' => 'test-crewneck',
        'base_price' => 100000,
        'description' => 'A test crewneck',
    ]);

    $sku = Sku::create([
        'product_id' => $product->id,
        'code' => 'TEST-RED-L',
        'color' => '#FF0000',
        'size' => 'L',
        'stock' => 5,
    ]);

    $this->order = Order::create([
        'reference' => 'ORD-TEST-001',
        'status' => OrderStatus::PENDING_PAYMENT,
        'total_amount' => 100000,
        'customer_name' => 'John Doe',
        'customer_email' => 'john@example.com',
        'customer_phone' => '3001234567',
        'shipping_address' => '123 Test St',
        'shipping_city' => 'Bogotá',
        'shipping_department' => 'Cundinamarca',
    ]);

    OrderItem::create([
        'order_id' => $this->order->id,
        'sku_id' => $sku->id,
        'quantity' => 1,
        'unit_price' => 100000,
    ]);

    $this->sku = $sku;
});

it('updates order to processing on approved webhook', function () {
    Notification::fake();

    $payload = buildWompiPayload($this->order, 'APPROVED');

    $response = $this->postJson('/wompi/webhook', $payload);

    $response->assertOk();
    expect($this->order->fresh()->status)->toBe(OrderStatus::PROCESSING);
});

it('fires OrderConfirmed notification on approved payment', function () {
    Notification::fake();

    $payload = buildWompiPayload($this->order, 'APPROVED');
    $this->postJson('/wompi/webhook', $payload);

    Notification::assertSentOnDemand(OrderConfirmed::class);
});

it('restores stock on declined payment', function () {
    $stockBefore = $this->sku->stock;

    // Simulate stock was already decremented at checkout time
    $this->sku->update(['stock' => $stockBefore - 1]);

    $payload = buildWompiPayload($this->order, 'DECLINED');
    $this->postJson('/wompi/webhook', $payload);

    expect($this->order->fresh()->status)->toBe(OrderStatus::FAILED);
    expect($this->sku->fresh()->stock)->toBe($stockBefore);
});

it('rejects webhook with invalid signature', function () {
    $payload = [
        'data' => [
            'transaction' => [
                'reference' => $this->order->reference,
                'status' => 'APPROVED',
                'id' => 'txn-fake',
            ],
        ],
        'signature' => [
            'properties' => ['transaction.id', 'transaction.status', 'transaction.reference'],
            'checksum' => 'invalid_checksum_value',
        ],
        'timestamp' => time(),
    ];

    $response = $this->postJson('/wompi/webhook', $payload);
    $response->assertStatus(401);
});

// Helper to build a valid Wompi webhook payload
function buildWompiPayload(Order $order, string $status): array
{
    $transactionId = 'txn-' . uniqid();
    $timestamp = time();
    $secret = config('wompi.events_secret');

    $properties = ['transaction.id', 'transaction.status', 'transaction.reference'];
    $concatenated = $transactionId . $status . $order->reference . $timestamp . $secret;
    $checksum = hash('sha256', $concatenated);

    return [
        'data' => [
            'transaction' => [
                'reference' => $order->reference,
                'status' => $status,
                'id' => $transactionId,
            ],
        ],
        'signature' => [
            'properties' => $properties,
            'checksum' => $checksum,
        ],
        'timestamp' => $timestamp,
    ];
}
