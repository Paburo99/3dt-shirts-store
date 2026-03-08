<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Sku;
use App\Services\CheckoutService;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Support\Facades\Concurrency;
use Tests\TestCase;
use Exception;

class ConcurrencyCheckoutTest extends TestCase
{
    use DatabaseTruncation;

    public function test_prevents_race_condition_on_last_item()
    {
        // 1. Setup: Create a product and a SKU with exactly ONE item in stock
        $product = Product::create([
            'name' => 'Test Hoodie', 'slug' => 'test-hoodie', 'base_price' => 120000
        ]);
        
        $sku = Sku::create([
            'product_id' => $product->id, 'code' => 'TEST-BLK-L', 
            'color' => '#000', 'size' => 'L', 'stock' => 1 // ONLY 1 IN STOCK
        ]);

        $cart = [['sku_id' => $sku->id, 'quantity' => 1]];

        // 2. Simulate two users trying to buy the exact same item at the exact same time
        // The Concurrency facade runs these closures in parallel background processes.
        $results = Concurrency::run([
            function () use ($cart) {
                try {
                    app(\App\Services\CheckoutService::class)->createOrder($cart);
                    return 'success';
                } catch (\Exception $e) {
                    return 'failed: ' . $e->getMessage();
                }
            },
            function () use ($cart) {
                try {
                    app(\App\Services\CheckoutService::class)->createOrder($cart);
                    return 'success';
                } catch (\Exception $e) {
                    return 'failed: ' . $e->getMessage();
                }
            }
        ]);

        // 3. Assertions for the Academic Defense
        // Only ONE process should succeed. The other MUST fail due to insufficient stock.
        $successes = collect($results)->filter(fn($res) => $res === 'success')->count();
        $failures = collect($results)->filter(fn($res) => str_contains($res, 'failed'))->count();

        $this->assertEquals(1, $successes, 'Only one order should have been successfully created.');
        $this->assertEquals(1, $failures, 'The second concurrent request should have been rejected.');

        // Verify the database has exactly 0 stock, NOT -1.
        $this->assertEquals(0, $sku->fresh()->stock);
    }
}