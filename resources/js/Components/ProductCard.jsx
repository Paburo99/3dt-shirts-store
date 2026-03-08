import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Heart } from 'lucide-react';

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));

export default function ProductCard({ product, wishlisted = false }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const skus = product.skus || [];
    const uniqueColors = [...new Set(skus.map((s) => s.color))];
    const hasStock = skus.some((s) => s.stock > 0);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            router.visit(route('login'));
            return;
        }
        router.post(route('wishlist.toggle', product.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Link
            href={route('product.show', product.slug)}
            className="group block bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-zinc-200 transition-all duration-300"
        >
            {/* Color preview band */}
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
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        Sold Out
                    </div>
                )}
                {/* Wishlist Heart */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm ${
                        wishlisted
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white/80 backdrop-blur-sm text-zinc-400 hover:text-red-500 hover:bg-white'
                    }`}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Info */}
            <div className="p-5">
                <h3 className="font-bold text-zinc-900 text-lg group-hover:text-zinc-700 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-extrabold text-zinc-900">
                        {formatPrice(product.base_price)}
                    </span>

                    {/* Color swatches */}
                    <div className="flex -space-x-1">
                        {uniqueColors.slice(0, 4).map((color) => (
                            <div
                                key={color}
                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        {uniqueColors.length > 4 && (
                            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm bg-zinc-200 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-zinc-600">+{uniqueColors.length - 4}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    Customize in 3D
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
