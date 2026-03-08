<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Sku;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->topsCat = Category::create(['name' => 'Tops', 'slug' => 'tops']);
    $this->bottomsCat = Category::create(['name' => 'Bottoms', 'slug' => 'bottoms']);

    $this->hoodie = Product::create([
        'name' => 'Test Hoodie',
        'slug' => 'test-hoodie',
        'base_price' => 120000,
        'description' => 'A warm hoodie',
        'category_id' => $this->topsCat->id,
    ]);

    Sku::create([
        'product_id' => $this->hoodie->id,
        'code' => 'HOO-BLK-M',
        'color' => '#000000',
        'size' => 'M',
        'stock' => 10,
    ]);

    $this->cargo = Product::create([
        'name' => 'Cargo Pants',
        'slug' => 'cargo-pants',
        'base_price' => 90000,
        'description' => 'Cargo pants',
        'category_id' => $this->bottomsCat->id,
    ]);

    Sku::create([
        'product_id' => $this->cargo->id,
        'code' => 'CAR-GRN-L',
        'color' => '#00FF00',
        'size' => 'L',
        'stock' => 5,
    ]);
});

it('returns all products without filters', function () {
    $response = $this->get(route('shop'));

    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->component('Shop/Index')
            ->has('products', 2)
    );
});

it('filters products by category using id', function () {
    // The filter uses category_id (exact match)
    $response = $this->get(route('shop', ['filter' => ['category' => $this->bottomsCat->id]]));

    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->component('Shop/Index')
            ->has('products', 1)
            ->where('products.0.name', 'Cargo Pants')
    );
});

it('sorts products by price ascending', function () {
    $response = $this->get(route('shop', ['sort' => 'price']));

    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->component('Shop/Index')
            ->has('products', 2)
            ->where('products.0.name', 'Cargo Pants')
    );
});

it('returns empty results for non-matching price filter', function () {
    // Filter price above what both products cost
    $response = $this->get(route('shop', ['filter' => ['min_price' => 999999]]));

    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->component('Shop/Index')
            ->has('products', 0)
    );
});

it('returns both products for price range covering all', function () {
    $response = $this->get(route('shop', ['filter' => ['min_price' => 50000, 'max_price' => 200000]]));

    $response->assertOk();
    $response->assertInertia(fn ($page) =>
        $page->component('Shop/Index')
            ->has('products', 2)
    );
});
