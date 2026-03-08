<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function show($slug)
    {
        // Fetch the product and its SKUs, hiding any sensitive internal data if necessary
        $product = Product::with('skus')->where('slug', $slug)->firstOrFail();

        // Inertia directly passes this PHP array as a prop to our React component
        return Inertia::render('Store/ProductConfigurator',[
            'product' => $product
        ]);
    }
}