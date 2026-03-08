import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import StoreLayout from '@/Layouts/StoreLayout';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price));

export default function Index({ products }) {
    const handleRemove = (productId) => {
        router.post(route('wishlist.toggle', productId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <StoreLayout>
            <Head title="My Wishlist" />

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Heart className="h-7 w-7 text-red-500 fill-red-500" />
                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">My Wishlist</h1>
                        </div>
                        <p className="text-zinc-500">
                            {products.length} {products.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </motion.div>

                    {products.length === 0 ? (
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            className="text-center py-20"
                        >
                            <Heart className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
                            <p className="text-zinc-500 text-lg mb-2">Your wishlist is empty</p>
                            <p className="text-zinc-400 text-sm mb-6">Save products you love to come back to them later.</p>
                            <Link
                                href={route('shop')}
                                className="inline-flex items-center gap-2 h-10 px-6 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Browse Shop
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, i) => {
                                const skus = product.skus || [];
                                const uniqueColors = [...new Set(skus.map(s => s.color))];
                                const hasStock = skus.some(s => s.stock > 0);

                                return (
                                    <motion.div
                                        key={product.id}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i + 1}
                                        className="group bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-zinc-200 transition-all"
                                    >
                                        <Link href={route('product.show', product.slug)}>
                                            <div className="relative h-48 sm:h-56 bg-zinc-100 flex items-center justify-center overflow-hidden">
                                                <div
                                                    className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                    style={{
                                                        background: uniqueColors.length > 1
                                                            ? `linear-gradient(135deg, ${uniqueColors.slice(0, 3).join(', ')})`
                                                            : uniqueColors[0] || '#e4e4e7',
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-white/90 text-sm font-bold uppercase tracking-widest drop-shadow-lg">
                                                        3D Preview
                                                    </span>
                                                </div>
                                                {!hasStock && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                                        Sold Out
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-5">
                                            <div className="flex items-start justify-between">
                                                <Link href={route('product.show', product.slug)}>
                                                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-zinc-700 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <button
                                                    onClick={() => handleRemove(product.id)}
                                                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                                                    title="Remove from wishlist"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{product.description}</p>

                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-lg font-extrabold text-zinc-900">
                                                    {formatPrice(product.base_price)}
                                                </span>
                                                <div className="flex -space-x-1">
                                                    {uniqueColors.slice(0, 4).map(color => (
                                                        <div
                                                            key={color}
                                                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <Link
                                                href={route('product.show', product.slug)}
                                                className="mt-4 flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                                            >
                                                Customize in 3D
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
