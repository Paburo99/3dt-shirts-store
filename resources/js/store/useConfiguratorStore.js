import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfiguratorStore = create(
    persist(
        (set) => ({
            selectedColor: '#000000',
            selectedSize: 'M',
            cart: [],

            setColor: (color) => set({ selectedColor: color }),
            setSize: (size) => set({ selectedSize: size }),

            addToCart: (item) => set((state) => {
                const existing = state.cart.find(i => i.sku_id === item.sku_id);
                if (existing) {
                    const newQty = Math.min(existing.quantity + item.quantity, item.stock ?? existing.stock ?? Infinity);
                    return {
                        cart: state.cart.map(i =>
                            i.sku_id === item.sku_id
                                ? { ...i, quantity: newQty, stock: item.stock ?? i.stock }
                                : i
                        )
                    };
                }
                return { cart: [...state.cart, item] };
            }),

            updateQuantity: (sku_id, quantity) => set((state) => ({
                cart: quantity <= 0
                    ? state.cart.filter(item => item.sku_id !== sku_id)
                    : state.cart.map(item =>
                        item.sku_id === sku_id
                            ? { ...item, quantity: Math.min(quantity, item.stock ?? Infinity) }
                            : item
                    )
            })),

            removeFromCart: (sku_id) => set((state) => ({
                cart: state.cart.filter(item => item.sku_id !== sku_id)
            })),

            clearCart: () => set({ cart: [] })
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);