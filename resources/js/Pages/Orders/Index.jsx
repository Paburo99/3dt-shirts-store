import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, ArrowRight } from 'lucide-react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import OrderStatusBadge from '@/Components/OrderStatusBadge';

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
    }),
};

export default function Index({ orders }) {
    const orderList = orders.data || [];

    return (
        <StoreLayout>
            <Head title="My Orders" />

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                    <motion.h1
                        variants={fadeUp} initial="hidden" animate="visible" custom={0}
                        className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8"
                    >
                        My Orders
                    </motion.h1>

                    {orderList.length === 0 ? (
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-16 text-center">
                                <Package className="h-20 w-20 text-zinc-200 mx-auto mb-6" />
                                <h2 className="text-xl font-bold text-zinc-800 mb-2">No orders yet</h2>
                                <p className="text-zinc-500 mb-8">When you place an order, it will appear here.</p>
                                <Button asChild>
                                    <Link href={route('shop')}>Start Shopping</Link>
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
                                {orderList.map((order, i) => (
                                    <div key={order.id}>
                                        <Link
                                            href={route('orders.show', order.reference)}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-zinc-50 transition-colors gap-3"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-sm font-bold text-zinc-900 font-mono">{order.reference}</p>
                                                    <OrderStatusBadge status={order.status} />
                                                </div>
                                                <p className="text-xs text-zinc-500">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'long', day: 'numeric',
                                                    })}
                                                    {' · '}
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </p>
                                                <div className="flex gap-1.5 mt-2">
                                                    {order.items.slice(0, 5).map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="w-6 h-6 rounded border border-zinc-200"
                                                            style={{ backgroundColor: item.sku?.color }}
                                                            title={item.sku?.product?.name}
                                                        />
                                                    ))}
                                                    {order.items.length > 5 && (
                                                        <div className="w-6 h-6 rounded border border-zinc-200 bg-zinc-100 flex items-center justify-center">
                                                            <span className="text-[8px] font-bold text-zinc-500">+{order.items.length - 5}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-zinc-900 tabular-nums">
                                                    {formatPrice(order.total_amount)}
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-zinc-400" />
                                            </div>
                                        </Link>
                                        {i < orderList.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-6">
                                    {orders.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                                link.active
                                                    ? 'bg-zinc-900 text-white'
                                                    : link.url
                                                    ? 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                                    : 'text-zinc-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
