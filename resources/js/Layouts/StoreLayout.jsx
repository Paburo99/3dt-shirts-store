import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, User, Menu, X, Shield, Search, Heart } from 'lucide-react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import CartDrawer from '@/Components/CartDrawer';
import { Toaster } from 'sonner';
import { Separator } from '@/Components/ui/separator';

export default function StoreLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const cart = useConfiguratorStore((state) => state.cart);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navLinkClass = "text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors";

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('shop'), { search: searchQuery.trim() });
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Toaster position="top-right" richColors closeButton />

            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-200/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-xl font-extrabold tracking-tight text-zinc-900">
                                3D SHIRTS
                            </Link>
                            <div className="hidden sm:flex items-center gap-6">
                                <Link href="/" className={navLinkClass}>Home</Link>
                                <Link href={route('shop')} className={navLinkClass}>Shop</Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-3">
                            {/* Search */}
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        autoFocus
                                        className="h-9 w-48 px-3 rounded-lg border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                                        onBlur={() => {
                                            if (!searchQuery) setSearchOpen(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                setSearchOpen(false);
                                                setSearchQuery('');
                                            }
                                        }}
                                    />
                                </form>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                                    title="Search products"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            )}

                            {user?.role !== 'user' && user?.role && (
                                <a href="/admin" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    <Shield className="h-4 w-4" />
                                    Admin
                                </a>
                            )}
                            {user ? (
                                <Link href={route('dashboard')} className={navLinkClass}>Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className={navLinkClass}>Log in</Link>
                                    <Link href={route('register')} className={navLinkClass}>Register</Link>
                                </>
                            )}

                            {user && (
                                <Link
                                    href={route('wishlist.index')}
                                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                    title="Wishlist"
                                >
                                    <Heart className="h-5 w-5" />
                                </Link>
                            )}

                            <button
                                onClick={() => setCartOpen(true)}
                                className="relative p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>

                            {user && (
                                <Link href={route('profile.edit')} className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors">
                                    <User className="h-5 w-5" />
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-2 sm:hidden">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 text-zinc-600"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                            <button onClick={() => setCartOpen(true)} className="relative p-2 text-zinc-600">
                                <ShoppingBag className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-600">
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {searchOpen && (
                        <div className="sm:hidden border-t border-zinc-100 py-2">
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    autoFocus
                                    className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                                />
                                <button type="submit" className="h-9 px-3 bg-zinc-900 text-white text-sm font-medium rounded-lg">
                                    Go
                                </button>
                            </form>
                        </div>
                    )}

                    {mobileMenuOpen && (
                        <div className="sm:hidden border-t border-zinc-100 py-3 space-y-1">
                            <Link href="/" className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Home</Link>
                            <Link href={route('shop')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Shop</Link>
                            {user ? (
                                <>
                                    {user.role !== 'user' && (
                                        <a href="/admin" className="block px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                                            Admin Panel
                                        </a>
                                    )}
                                    <Link href={route('dashboard')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Dashboard</Link>
                                    <Link href={route('orders.index')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">My Orders</Link>
                                    <Link href={route('addresses.index')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">My Addresses</Link>
                                    <Link href={route('profile.edit')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Profile</Link>
                                    <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Log Out</Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Log in</Link>
                                    <Link href={route('register')} className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md">Register</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

            <main className="flex-1">{children}</main>

            <footer className="bg-zinc-900 text-zinc-400">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-white font-extrabold text-lg tracking-tight mb-3">3D SHIRTS</h3>
                            <p className="text-sm leading-relaxed">
                                Premium apparel you can customize in 3D before you buy. See it, style it, own it.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href={route('shop')} className="hover:text-white transition-colors">Shop</Link></li>
                                <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Account</h4>
                            <ul className="space-y-2 text-sm">
                                {user ? (
                                    <>
                                        <li><Link href={route('dashboard')} className="hover:text-white transition-colors">Dashboard</Link></li>
                                        <li><Link href={route('profile.edit')} className="hover:text-white transition-colors">Profile</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link href={route('login')} className="hover:text-white transition-colors">Log in</Link></li>
                                        <li><Link href={route('register')} className="hover:text-white transition-colors">Create Account</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    <Separator className="my-8 bg-zinc-800" />
                    <p className="text-xs text-zinc-500 text-center">
                        &copy; {new Date().getFullYear()} 3D Shirts. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
