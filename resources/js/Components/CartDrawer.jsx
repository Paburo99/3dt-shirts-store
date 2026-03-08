import { Link, router } from '@inertiajs/react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/Components/ui/sheet';
import { toast } from 'sonner';

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));

export default function CartDrawer({ open, onOpenChange }) {
    const { cart, updateQuantity, removeFromCart } = useConfiguratorStore();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleRemove = (item) => {
        removeFromCart(item.sku_id);
        toast.success(`${item.name} removed from cart`);
    };

    const handleCheckout = () => {
        onOpenChange(false);
        router.visit(route('checkout.show'));
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Cart ({totalItems})
                    </SheetTitle>
                    <SheetDescription>Review your items before checkout.</SheetDescription>
                </SheetHeader>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                        <ShoppingBag className="h-16 w-16 text-zinc-300" />
                        <div>
                            <p className="text-lg font-semibold text-zinc-700">Your cart is empty</p>
                            <p className="text-sm text-zinc-500 mt-1">Add some items to get started.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.sku_id} className="flex gap-4 items-start">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-zinc-200 shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-zinc-900 truncate">{item.name}</p>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wide">
                                            Size {item.size}
                                        </p>
                                        <p className="text-sm font-medium text-zinc-900 mt-1">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => updateQuantity(item.sku_id, item.quantity - 1)}
                                            className="h-7 w-7 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => {
                                                if (item.stock && item.quantity >= item.stock) {
                                                    toast.error('Maximum stock reached');
                                                    return;
                                                }
                                                updateQuantity(item.sku_id, item.quantity + 1);
                                            }}
                                            disabled={item.stock && item.quantity >= item.stock}
                                            className="h-7 w-7 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item)}
                                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        <SheetFooter className="flex-col gap-3 sm:flex-col">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-sm text-zinc-600">Subtotal</span>
                                <span className="text-xl font-bold text-zinc-900">{formatPrice(totalPrice)}</span>
                            </div>
                            <Button className="w-full h-12 text-base font-bold" onClick={handleCheckout}>
                                Proceed to Checkout
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => onOpenChange(false)}
                                asChild
                            >
                                <Link href="/cart">View Full Cart</Link>
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
