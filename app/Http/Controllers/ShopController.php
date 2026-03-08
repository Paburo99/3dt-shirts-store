<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Sku;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class ShopController extends Controller
{
    public function index()
    {
        $search = request('search');

        // Base query - if searching, use Scout; otherwise use QueryBuilder
        if ($search) {
            // Scout search returns a collection of IDs, then we filter/sort with QueryBuilder
            $productIds = Product::search($search)->keys();

            $query = QueryBuilder::for(Product::whereIn('id', $productIds))
                ->with(['skus', 'category']);
        } else {
            $query = QueryBuilder::for(Product::class)
                ->with(['skus', 'category']);
        }

        $products = $query
            ->allowedFilters([
                AllowedFilter::exact('category', 'category_id'),
                AllowedFilter::callback('color', function ($query, $value) {
                    $query->whereHas('skus', function ($q) use ($value) {
                        $q->where('color', $value);
                    });
                }),
                AllowedFilter::callback('min_price', function ($query, $value) {
                    $query->where('base_price', '>=', $value);
                }),
                AllowedFilter::callback('max_price', function ($query, $value) {
                    $query->where('base_price', '<=', $value);
                }),
            ])
            ->allowedSorts([
                AllowedSort::field('price', 'base_price'),
                AllowedSort::field('newest', 'created_at'),
                AllowedSort::field('name', 'name'),
            ])
            ->defaultSort('-created_at')
            ->get();

        // Get all categories for the filter sidebar
        $categories = Category::withCount('products')->get();

        // Get all unique colors from SKUs for the color filter
        $availableColors = Sku::distinct()->pluck('color')->toArray();

        // Get price range for the price filter
        $priceRange = [
            'min' => (int) Product::min('base_price'),
            'max' => (int) Product::max('base_price'),
        ];

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => $categories,
            'availableColors' => $availableColors,
            'priceRange' => $priceRange,
            'wishlistIds' => auth()->check()
                ? auth()->user()->wishedProducts()->pluck('products.id')->toArray()
                : [],
            'filters' => [
                'search' => $search,
                'category' => request('filter.category'),
                'color' => request('filter.color'),
                'min_price' => request('filter.min_price'),
                'max_price' => request('filter.max_price'),
                'sort' => request('sort'),
            ],
        ]);
    }
}
