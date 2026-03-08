import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, MapPin, DollarSign, ArrowRight, ShoppingBag } from 'lucide-react';
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
        transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
};

const statCards = [
    { key: 'total_orders', label: 'Total Orders', icon: Package, format: (v) => v },
    { key: 'total_spent', label: 'Total Spent', icon: DollarSign, format: (v) => formatPrice(v) },
    { key: 'saved_addresses', label: 'Saved Addresses', icon: MapPin, format: (v) => v },
];

export default function Dashboard({ recentOrders, stats }) {
    return (
        <StoreLayout>
            <Head title="Dashboard" />

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
                    <motion.h1
                        variants={fadeUp} initial="hidden" animate="visible" custom={0}
                        className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8"
                    >
                        Dashboard
                    </motion.h1>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        {statCards.map((card, i) => (
                            <motion.div
                                key={card.key}
                                variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
                                className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <card.icon className="h-5 w-5 text-zinc-700" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-500">{card.label}</span>
                                </div>
                                <p className="text-2xl font-extrabold text-zinc-900">{card.format(stats[card.key])}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <motion.div
                        variants={fadeUp} initial="hidden" animate="visible" custom={4}
                        className="flex flex-wrap gap-3 mb-10"
                    >
                        <Button variant="outline" asChild>
                            <Link href={route('orders.index')}>
                                <Package className="h-4 w-4 mr-2" /> All Orders
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('addresses.index')}>
                                <MapPin className="h-4 w-4 mr-2" /> Manage Addresses
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('shop')}>
                                <ShoppingBag className="h-4 w-4 mr-2" /> Shop
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-zinc-900">Recent Orders</h2>
                            <Link href={route('orders.index')} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1">
                                View all <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-12 text-center">
                                <Package className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
                                <p className="text-zinc-500">No orders yet. Start shopping!</p>
                                <Button className="mt-4" asChild>
                                    <Link href={route('shop')}>Browse Products</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
                                {recentOrders.map((order, i) => (
                                    <div key={order.id}>
                                        <Link
                                            href={route('orders.show', order.reference)}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 font-mono">{order.reference}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                    })}
                                                    {' · '}
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <OrderStatusBadge status={order.status} />
                                                <span className="text-sm font-bold text-zinc-900 tabular-nums">
                                                    {formatPrice(order.total_amount)}
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-zinc-400" />
                                            </div>
                                        </Link>
                                        {i < recentOrders.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </StoreLayout>
    );
}
