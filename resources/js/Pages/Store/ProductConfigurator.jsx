import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import ProductCanvas from '@/Components/3D/ProductCanvas';
import { ShoppingBag, AlertTriangle } from 'lucide-react';
import CartDrawer from '@/Components/CartDrawer';
import SizeGuideModal from '@/Components/SizeGuideModal';
import ProductImageGallery from '@/Components/ProductImageGallery';
import { Toaster, toast } from 'sonner';

export default function ProductConfigurator({ product }) {
    const { selectedColor, selectedSize, setColor, setSize, addToCart, cart } = useConfiguratorStore();
    const [cartOpen, setCartOpen] = useState(false);
    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

    const skus = product?.skus || [];
    const availableColors = useMemo(() => Array.from(new Set(skus.map(s => s.color))), [skus]);
    const availableSizes = ['S', 'M', 'L', 'XL'];

    const activeSku = useMemo(() => {
        return skus.find(s => s.color === selectedColor && s.size === selectedSize);
    }, [skus, selectedColor, selectedSize]);

    const cartItem = cart.find(i => i.sku_id === activeSku?.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const remainingStock = activeSku ? activeSku.stock - quantityInCart : 0;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));
    };

    const handleAddToCart = () => {
        if (!activeSku || remainingStock <= 0) return;

        addToCart({
            sku_id: activeSku.id,
            quantity: 1,
            price: Number(activeSku.price_override || product.base_price),
            name: product.name,
            color: selectedColor,
            size: selectedSize,
            stock: activeSku.stock,
        });
        toast.success(`${product.name} added to cart`, {
            description: `Size ${selectedSize}`,
            action: {
                label: 'View Cart',
                onClick: () => setCartOpen(true),
            },
        });
    };

    const handleCheckout = () => {
        router.visit(route('checkout.show'));
    };

    // Stock indicator styles
    const getStockInfo = () => {
        if (!activeSku) return null;
        if (remainingStock === 0) return { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border-red-200', pulse: false };
        if (remainingStock <= 3) return { label: `Only ${remainingStock} left!`, className: 'bg-orange-100 text-orange-700 border-orange-200', pulse: true };
        if (remainingStock <= 5) return { label: `${remainingStock} available`, className: 'bg-yellow-100 text-yellow-700 border-yellow-200', pulse: false };
        return { label: `${remainingStock} in stock`, className: 'bg-green-100 text-green-700 border-green-200', pulse: false };
    };

    const stockInfo = getStockInfo();

    // Check if a specific size has any stock for current color
    const getSizeStock = (size) => {
        const sku = skus.find(s => s.color === selectedColor && s.size === size);
        return sku ? sku.stock : 0;
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans text-zinc-900">
            <Head>
                <title>{`${product?.name || 'Configurator'} — 3D Shirts`}</title>
                <meta name="description" content={product?.description || `Customize ${product?.name} in 3D and choose your color and size.`} />
                <meta property="og:title" content={`${product?.name} — 3D Shirts`} />
                <meta property="og:description" content={product?.description || `Customize ${product?.name} in real-time 3D.`} />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Toaster position="top-right" richColors closeButton />
            <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

            {/* Floating nav bar */}
            <div className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                    <Link href="/" className="text-lg font-extrabold tracking-tight text-zinc-900">
                        3D SHIRTS
                    </Link>
                    <span className="text-zinc-300">|</span>
                    <Link href={route('shop')} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                        Shop
                    </Link>
                </div>
                <button
                    onClick={() => setCartOpen(true)}
                    className="relative p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm text-zinc-700 hover:text-zinc-900 transition-colors"
                >
                    <ShoppingBag className="h-5 w-5" />
                    {totalCartItems > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                            {totalCartItems > 99 ? '99+' : totalCartItems}
                        </span>
                    )}
                </button>
            </div>

            {/* LEFT SIDE: 3D Canvas + Image Gallery */}
            <div className="w-full md:w-2/3 bg-zinc-200 relative flex flex-col min-h-[50vh] md:min-h-screen">
                <div className="flex-1 relative flex flex-col items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <ProductCanvas modelType={product.slug} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-300/30 pointer-events-none z-10" />
                    <div
                        className="absolute bottom-8 left-8 w-12 h-12 rounded-full shadow-xl border-4 border-white transition-colors duration-500 z-20"
                        style={{ backgroundColor: selectedColor }}
                    />
                </div>

                {/* Image Gallery Strip */}
                <ProductImageGallery productSlug={product.slug} productName={product.name} />
            </div>

            {/* RIGHT SIDE: Controls */}
            <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-white shadow-2xl z-10 overflow-y-auto">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">{product?.name}</h1>
                <p className="text-xl text-zinc-500 mb-4 font-light">
                    {formatPrice(activeSku?.price_override || product?.base_price || 0)}
                </p>

                {/* Product Description */}
                {product?.description && (
                    <p className="text-sm text-zinc-500 leading-relaxed mb-6 border-l-2 border-zinc-200 pl-4">
                        {product.description}
                    </p>
                )}

                <div className="space-y-8">
                    {/* Color Selection */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Color</h3>
                        <div className="flex gap-3">
                            {availableColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setColor(color)}
                                    className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${selectedColor === color ? 'border-zinc-900 scale-110' : 'border-transparent shadow-md'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider">Size</h3>
                            <SizeGuideModal />
                        </div>
                        {/* Stock Indicator */}
                        {stockInfo && (
                            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border mb-3 ${stockInfo.className} ${stockInfo.pulse ? 'animate-pulse' : ''}`}>
                                {stockInfo.pulse && <AlertTriangle className="h-3 w-3" />}
                                {stockInfo.label}
                            </div>
                        )}
                        <div className="grid grid-cols-4 gap-2">
                            {availableSizes.map((size) => {
                                const stock = getSizeStock(size);
                                const isSelected = selectedSize === size;
                                const isOutOfStock = stock === 0;

                                return (
                                    <button
                                        key={size}
                                        onClick={() => setSize(size)}
                                        className={`relative py-3 text-sm font-medium border rounded-md transition-colors ${
                                            isSelected
                                                ? 'border-zinc-900 bg-zinc-900 text-white'
                                                : isOutOfStock
                                                ? 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through'
                                                : 'border-zinc-200 hover:border-zinc-400'
                                        }`}
                                        disabled={isOutOfStock}
                                    >
                                        {size}
                                        {stock > 0 && stock <= 3 && !isSelected && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cart Actions */}
                    <div className="pt-6 border-t border-zinc-100 space-y-3">
                        <button
                            className={`w-full h-12 text-lg font-bold rounded-md text-white transition-colors ${!activeSku || remainingStock === 0 ? 'bg-zinc-300 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                            disabled={!activeSku || remainingStock === 0}
                            onClick={handleAddToCart}
                        >
                            {remainingStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        {totalCartItems > 0 && (
                            <button
                                className="w-full h-12 text-lg font-bold rounded-md bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-50 transition-colors flex justify-center items-center gap-2"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                                <span className="bg-zinc-900 text-white text-sm px-2 py-1 rounded-full">
                                    {totalCartItems}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}