import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import ProductCanvas from '@/Components/3D/ProductCanvas';

export default function ProductConfigurator({ product }) {
    const { selectedColor, selectedSize, setColor, setSize, addToCart, cart } = useConfiguratorStore();

    const skus = product?.skus ||[];
    const availableColors = useMemo(() => Array.from(new Set(skus.map(s => s.color))), [skus]);
    const availableSizes = ['S', 'M', 'L', 'XL'];

    // 1. Identify the active SKU from the database
    const activeSku = useMemo(() => {
        return skus.find(s => s.color === selectedColor && s.size === selectedSize);
    },[skus, selectedColor, selectedSize]);

    // 2. Check how many of THIS specific item are already in the cart
    const cartItem = cart.find(i => i.sku_id === activeSku?.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // 3. Calculate dynamic remaining stock
    const remainingStock = activeSku ? activeSku.stock - quantityInCart : 0;

    // 4. Calculate TOTAL items in cart (not just unique rows)
    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

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
            size: selectedSize
        });
    };

    const handleCheckout = () => {
        router.post(route('checkout.store'), {
            items: cart.map(item => ({ sku_id: item.sku_id, quantity: item.quantity }))
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-sans text-zinc-900">
            <Head title={product?.name || 'Configurator'} />

            {/* LEFT SIDE: 3D Canvas Area */}
            <div className="w-full md:w-2/3 bg-zinc-200 relative flex flex-col items-center justify-center min-h-[50vh] md:min-h-screen">
                
                {/* The WebGL Canvas */}
                <div className="absolute inset-0 z-0">
                    <ProductCanvas modelType={product.slug} />
                </div>

                {/* Optional overlay gradient for styling */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-300/30 pointer-events-none z-10" />
                
                {/* Floating UI Indicator */}
                <div 
                    className="absolute bottom-8 left-8 w-12 h-12 rounded-full shadow-xl border-4 border-white transition-colors duration-500 z-20"
                    style={{ backgroundColor: selectedColor }}
                />
            </div>

            {/* RIGHT SIDE: Controls */}
            <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-white shadow-2xl z-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">{product?.name}</h1>
                <p className="text-xl text-zinc-500 mb-6 font-light">
                    {formatPrice(activeSku?.price_override || product?.base_price || 0)}
                </p>

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
                            {activeSku && (
                                <span className={`text-xs font-bold px-2 py-1 rounded ${remainingStock > 0 && remainingStock <= 3 ? 'bg-orange-100 text-orange-700' : remainingStock === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {remainingStock > 0 ? `${remainingStock} available` : 'Out of Stock'}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSize(size)}
                                    className={`py-3 text-sm font-medium border rounded-md transition-colors ${selectedSize === size ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 hover:border-zinc-400'}`}
                                >
                                    {size}
                                </button>
                            ))}
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

                        {/* This button appears ONLY when there are items in the cart */}
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