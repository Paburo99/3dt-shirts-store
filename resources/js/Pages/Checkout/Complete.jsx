import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';

export default function Complete({ order }) {
    const clearCart = useConfiguratorStore((state) => state.clearCart);

    // Wipe the cart clean as soon as they land on this page
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    const isSuccess = order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
    const isPending = order.status === 'pending_payment';

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 font-sans text-center">
            <Head title="Order Status" />

            <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-2xl border border-zinc-100">
                {isSuccess ? (
                    <div className="text-green-500 mb-6">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                ) : isPending ? (
                    <div className="text-yellow-500 mb-6 flex justify-center">
                        <svg className="w-20 h-20 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                ) : (
                    <div className="text-red-500 mb-6">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}

                <h1 className="text-4xl font-extrabold text-zinc-900 mb-4">
                    {isSuccess ? 'Payment Successful!' : isPending ? 'Processing Payment...' : 'Payment Failed'}
                </h1>

                <p className="text-zinc-500 mb-2">
                    {isSuccess 
                        ? "We've received your order and are preparing it for shipment." 
                        : isPending 
                        ? "Wompi is still confirming your transaction. Please check back in a moment." 
                        : "Unfortunately, your payment was declined or cancelled. Your cart items have been restocked."}
                </p>

                <div className="bg-zinc-100 rounded-lg p-4 my-8 font-mono text-sm text-zinc-600">
                    Order Reference: <span className="font-bold text-zinc-900">{order.reference}</span>
                </div>

                <Link 
                    href="/product/essential-3d-hoodie"
                    className="inline-block bg-zinc-900 text-white font-bold py-3 px-8 rounded-md hover:bg-zinc-800 transition-colors"
                >
                    Return to Store
                </Link>
            </div>
        </div>
    );
}