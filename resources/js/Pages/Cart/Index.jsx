import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { toast } from 'sonner';
import StoreLayout from '@/Layouts/StoreLayout';

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));

export default function Index() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useConfiguratorStore();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleRemove = (item) => {
        removeFromCart(item.sku_id);
        toast.success(`${item.name} removed from cart`);
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared');
    };

    const handleCheckout = () => {
        router.visit(route('checkout.show'));
    };

    return (
        <StoreLayout>
            <Head title="Cart" />

            <div className="min-h-[calc(100vh-4rem)] bg-zinc-50">
                <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Shopping Cart</h1>
                            <p className="text-sm text-zinc-500 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                        </div>
                        {cart.length > 0 && (
                            <Button variant="ghost" size="sm" className="text-zinc-500" onClick={handleClearCart}>
                                Clear all
                            </Button>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-16 text-center">
                            <ShoppingBag className="h-20 w-20 text-zinc-200 mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-zinc-800 mb-2">Your cart is empty</h2>
                            <p className="text-zinc-500 mb-8">Browse our collection and add some items.</p>
                            <Button asChild>
                                <Link href={route('shop')}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.sku_id}
                                        className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5 flex gap-5 items-center"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-lg border border-zinc-200 shrink-0"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-zinc-900 truncate">{item.name}</h3>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wide mt-0.5">
                                                Size {item.size}
                                            </p>
                                            <p className="text-sm font-medium text-zinc-700 mt-1">
                                                {formatPrice(item.price)} each
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.sku_id, item.quantity - 1)}
                                                className="h-8 w-8 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    if (item.stock && item.quantity >= item.stock) {
                                                        toast.error('Maximum stock reached');
                                                        return;
                                                    }
                                                    updateQuantity(item.sku_id, item.quantity + 1);
                                                }}
                                                disabled={item.stock && item.quantity >= item.stock}
                                                className="h-8 w-8 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <p className="w-28 text-right font-bold text-zinc-900 tabular-nums">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>

                                        <button
                                            onClick={() => handleRemove(item)}
                                            className="text-zinc-400 hover:text-red-500 transition-colors p-1.5"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order summary sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Summary</h2>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600">Subtotal ({totalItems} items)</span>
                                            <span className="font-medium">{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600">Shipping</span>
                                            <span className="font-medium text-green-600">Free</span>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-base font-bold text-zinc-900">Total</span>
                                        <span className="text-2xl font-extrabold text-zinc-900">
                                            {formatPrice(totalPrice)}
                                        </span>
                                    </div>

                                    <Button className="w-full h-12 text-base font-bold" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </Button>

                                    <Button variant="outline" className="w-full mt-3" asChild>
                                        <Link href={route('shop')}>
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
