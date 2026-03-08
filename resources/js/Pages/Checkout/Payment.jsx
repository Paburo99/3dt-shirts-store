import React from 'react';
import { Head } from '@inertiajs/react';

export default function Payment({ order, wompiPublicKey, amountInCents, signature }) {

    const appUrl = window.location.origin;
    const redirectUrl = encodeURIComponent(`${appUrl}/order/${order.reference}/complete`);

    // Construct the secure Wompi Web Checkout URL including the new Integrity Signature
    const wompiCheckoutUrl = `https://checkout.wompi.co/p/?public-key=${wompiPublicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${order.reference}&signature:integrity=${signature}&redirect-url=${redirectUrl}`;
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
            <Head title="Secure Checkout" />

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-zinc-100 text-center">
                <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-2">Order Summary</h1>
                <p className="text-sm text-zinc-500 mb-8 font-mono bg-zinc-100 py-1 px-3 rounded-md inline-block">Ref: {order.reference}</p>

                <div className="space-y-4 mb-8 text-left">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b border-zinc-50 pb-4">
                            <div>
                                <p className="font-semibold text-zinc-900">{item.sku.product.name}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                    Color: {item.sku.color} / Size: {item.sku.size} / Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="font-medium text-zinc-900">{formatPrice(item.unit_price * item.quantity)}</p>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-2">
                        <p className="text-lg font-bold text-zinc-900">Total</p>
                        <p className="text-2xl font-extrabold text-zinc-900">{formatPrice(order.total_amount)}</p>
                    </div>
                </div>

                {/* Secure Payment Button */}
                <a
                    href={wompiCheckoutUrl}
                    className="flex w-full justify-center items-center h-14 bg-[#001AFF] hover:bg-[#0015CC] text-white font-bold text-lg rounded-md transition-all shadow-md shadow-blue-500/30"
                >
                    Pay securely with Wompi
                </a>
                <p className="text-xs text-zinc-400 mt-4">Accepts Nequi, PSE, Bancolombia, and Credit Cards.</p>
            </div>
        </div>
    );
}