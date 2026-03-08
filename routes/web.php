<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AddressController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WompiWebhookController;
use App\Http\Controllers\WishlistController;
use App\Models\Product;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'featuredProducts' => Product::with('skus')->latest()->take(3)->get(),
    ]);
})->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{reference}', [OrderController::class, 'show'])->name('orders.show');

    Route::get('/addresses', [AddressController::class, 'index'])->name('addresses.index');
    Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::get('/cart', function () {
    return Inertia::render('Cart/Index');
})->name('cart');

Route::get('/product/{slug}', [StoreController::class, 'show'])->name('product.show');

// 1. Show the Payment View
Route::get('/order/{reference}/pay', [PaymentController::class, 'show'])->name('order.pay');

// 2. The Webhook (Must be POST)
Route::post('/wompi/webhook', [WompiWebhookController::class, 'handle']);

Route::get('/order/{reference}/complete', [PaymentController::class, 'complete'])->name('order.complete');

require __DIR__ . '/auth.php';
