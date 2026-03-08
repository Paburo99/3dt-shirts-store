import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, MapPin } from 'lucide-react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import OrderStatusBadge from '@/Components/OrderStatusBadge';

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));

const statusTimeline = [
    { key: 'pending_payment', label: 'Order Placed' },
    { key: 'processing', label: 'Payment Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
];

function getTimelineStep(status) {
    if (status === 'cancelled' || status === 'failed') return -1;
    return statusTimeline.findIndex((s) => s.key === status);
}

export default function Show({ order }) {
    const currentStep = getTimelineStep(order.status);
    const isFailed = order.status === 'cancelled' || order.status === 'failed';

    return (
        <StoreLayout>
            <Head title={`Order ${order.reference}`} />

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                    <Button variant="ghost" size="sm" className="mb-6 text-zinc-500" asChild>
                        <Link href={route('orders.index')}>
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
                        </Link>
                    </Button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 font-mono">
                                    {order.reference}
                                </h1>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <OrderStatusBadge status={order.status} />
                        </div>

                        {/* Status Timeline */}
                        {!isFailed && (
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 mb-6">
                                <div className="flex items-center justify-between">
                                    {statusTimeline.map((step, i) => (
                                        <div key={step.key} className="flex-1 flex items-center">
                                            <div className="flex flex-col items-center text-center flex-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    i <= currentStep
                                                        ? 'bg-zinc-900 text-white'
                                                        : 'bg-zinc-100 text-zinc-400'
                                                }`}>
                                                    {i + 1}
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${
                                                    i <= currentStep ? 'text-zinc-900' : 'text-zinc-400'
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                            {i < statusTimeline.length - 1 && (
                                                <div className={`h-0.5 flex-1 -mt-5 ${
                                                    i < currentStep ? 'bg-zinc-900' : 'bg-zinc-200'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                        <Package className="h-5 w-5" /> Items
                                    </h2>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-lg border border-zinc-200 shrink-0"
                                                    style={{ backgroundColor: item.sku?.color }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-zinc-900 truncate">
                                                        {item.sku?.product?.name || 'Product'}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                                        Size {item.sku?.size} · Qty {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-zinc-900 tabular-nums">
                                                    {formatPrice(item.unit_price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-zinc-900">Total</span>
                                        <span className="text-xl font-extrabold text-zinc-900">
                                            {formatPrice(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
                                    <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                        <Truck className="h-5 w-5" /> Shipping
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        <p className="font-semibold text-zinc-900">{order.customer_name}</p>
                                        <p className="text-zinc-500">{order.customer_email}</p>
                                        <p className="text-zinc-500">{order.customer_phone}</p>
                                    </div>
                                    <Separator className="my-3" />
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-zinc-700">{order.shipping_address}</p>
                                                <p className="text-zinc-500">{order.shipping_city}, {order.shipping_department}</p>
                                                {order.shipping_notes && (
                                                    <p className="text-zinc-400 italic mt-1">{order.shipping_notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {order.wompi_transaction_id && (
                                    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
                                        <h3 className="text-sm font-bold text-zinc-900 mb-2">Payment</h3>
                                        <p className="text-xs text-zinc-500 font-mono break-all">
                                            Transaction: {order.wompi_transaction_id}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </StoreLayout>
    );
}
