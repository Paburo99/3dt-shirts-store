<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WompiWebhookController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::get('/product/{slug}', [StoreController::class, 'show'])->name('product.show');

// 1. Show the Payment View
Route::get('/order/{reference}/pay', [PaymentController::class, 'show'])->name('order.pay');

// 2. The Webhook (Must be POST)
Route::post('/wompi/webhook',[WompiWebhookController::class, 'handle']);

Route::get('/order/{reference}/complete', [PaymentController::class, 'complete'])->name('order.complete');

require __DIR__.'/auth.php';
