<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlistProducts = $request->user()
            ->wishedProducts()
            ->with('skus')
            ->get();

        return Inertia::render('Wishlist/Index', [
            'products' => $wishlistProducts,
        ]);
    }

    public function toggle(Request $request, Product $product)
    {
        $user = $request->user();

        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Removed from wishlist');
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return back()->with('success', 'Added to wishlist');
    }
}
