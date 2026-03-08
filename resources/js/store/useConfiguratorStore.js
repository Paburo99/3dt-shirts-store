// resources/js/store/useConfiguratorStore.js
import { create } from 'zustand';

export const useConfiguratorStore = create((set) => ({
    selectedColor: '#000000', // Default to black
    selectedSize: 'M',        // Default size
    cart:[],
    
    setColor: (color) => set({ selectedColor: color }),
    setSize: (size) => set({ selectedSize: size }),
    
    addToCart: (item) => set((state) => {
        // Check if item already exists in cart
        const existing = state.cart.find(i => i.sku_id === item.sku_id);
        if (existing) {
            return {
                cart: state.cart.map(i => 
                    i.sku_id === item.sku_id 
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                )
            };
        }
        return { cart: [...state.cart, item] };
    }),
    
    removeFromCart: (sku_id) => set((state) => ({
        cart: state.cart.filter(item => item.sku_id !== sku_id)
    })),

    clearCart: () => set({ cart:[] })
}));