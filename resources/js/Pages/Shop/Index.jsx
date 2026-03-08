import { useState, useCallback, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import StoreLayout from '@/Layouts/StoreLayout';
import ProductCard from '@/Components/ProductCard';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

const sortOptions = [
    { value: '', label: 'Newest' },
    { value: 'price', label: 'Price: Low → High' },
    { value: '-price', label: 'Price: High → Low' },
    { value: 'name', label: 'Name: A → Z' },
    { value: '-name', label: 'Name: Z → A' },
];

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(price));

export default function Index({ products, categories, availableColors, priceRange, filters, wishlistIds = [] }) {
    const [searchInput, setSearchInput] = useState(filters?.search || '');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const activeFilterCount = [
        filters?.category,
        filters?.color,
        filters?.min_price,
        filters?.max_price,
    ].filter(Boolean).length;

    // Build query params from current filters
    const applyFilters = useCallback((overrides = {}) => {
        const params = {
            search: overrides.search ?? filters?.search ?? undefined,
            'filter[category]': overrides.category ?? filters?.category ?? undefined,
            'filter[color]': overrides.color ?? filters?.color ?? undefined,
            'filter[min_price]': overrides.min_price ?? filters?.min_price ?? undefined,
            'filter[max_price]': overrides.max_price ?? filters?.max_price ?? undefined,
            sort: overrides.sort ?? filters?.sort ?? undefined,
        };

        // Remove undefined/empty values
        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === '') delete params[key];
        });

        router.get(route('shop'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters]);

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchInput !== (filters?.search || '')) {
                applyFilters({ search: searchInput || undefined });
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const clearFilter = (key) => {
        applyFilters({ [key]: undefined });
    };

    const clearAll = () => {
        setSearchInput('');
        router.get(route('shop'), {}, { preserveState: true });
    };

    const currentSort = sortOptions.find(s => s.value === (filters?.sort || '')) || sortOptions[0];
    const hasActiveFilters = activeFilterCount > 0 || filters?.search;

    const seoTitle = filters?.search
        ? `Search: "${filters.search}" — 3D Shirts`
        : filters?.category
            ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} — 3D Shirts Shop`
            : 'Shop All Products — 3D Shirts';

    return (
        <StoreLayout>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content="Browse and filter premium 3D-customizable apparel. Search by name, filter by category, color, and price range." />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content="Premium hoodies, crewnecks, and cargo pants you can customize in 3D." />
                <meta property="og:type" content="website" />
            </Head>

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    {/* Header */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Shop</h1>
                        <p className="mt-2 text-zinc-500">
                            Browse our full collection. Every piece can be customized in 3D.
                        </p>
                    </motion.div>

                    {/* Search + Sort + Filter Toggle Bar */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        className="flex flex-col sm:flex-row gap-3 mb-6"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full h-10 pl-10 pr-10 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => { setSearchInput(''); applyFilters({ search: undefined }); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setSortOpen(!sortOpen)}
                                className="h-10 px-4 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 whitespace-nowrap transition-colors"
                            >
                                {currentSort.label}
                                <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {sortOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                                    <div className="absolute right-0 top-12 z-20 w-48 bg-white rounded-lg shadow-lg border border-zinc-100 py-1">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    applyFilters({ sort: option.value || undefined });
                                                    setSortOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                                    currentSort.value === option.value
                                                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                                                        : 'text-zinc-600 hover:bg-zinc-50'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            className={`h-10 px-4 rounded-lg border text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                                filtersOpen || activeFilterCount > 0
                                    ? 'border-zinc-900 bg-zinc-900 text-white'
                                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                            }`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-white text-zinc-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </motion.div>

                    {/* Active Filter Badges */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            {filters?.search && (
                                <Badge variant="secondary" className="flex items-center gap-1 h-7 px-3 text-xs">
                                    Search: "{filters.search}"
                                    <button onClick={() => { setSearchInput(''); clearFilter('search'); }}>
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filters?.category && (
                                <Badge variant="secondary" className="flex items-center gap-1 h-7 px-3 text-xs">
                                    Category: {categories.find(c => String(c.id) === String(filters.category))?.name || filters.category}
                                    <button onClick={() => clearFilter('category')}>
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {filters?.color && (
                                <Badge variant="secondary" className="flex items-center gap-1 h-7 px-3 text-xs">
                                    <span className="w-3 h-3 rounded-full border border-zinc-300" style={{ backgroundColor: filters.color }} />
                                    Color
                                    <button onClick={() => clearFilter('color')}>
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {(filters?.min_price || filters?.max_price) && (
                                <Badge variant="secondary" className="flex items-center gap-1 h-7 px-3 text-xs">
                                    Price: {filters.min_price ? formatPrice(filters.min_price) : '...'} – {filters.max_price ? formatPrice(filters.max_price) : '...'}
                                    <button onClick={() => { clearFilter('min_price'); clearFilter('max_price'); }}>
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            <button onClick={clearAll} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 ml-1 transition-colors">
                                Clear all
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <AnimatePresence>
                            {filtersOpen && (
                                <motion.aside
                                    initial={{ opacity: 0, width: 0, marginRight: 0 }}
                                    animate={{ opacity: 1, width: 'auto', marginRight: 0 }}
                                    exit={{ opacity: 0, width: 0, marginRight: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="lg:w-64 flex-shrink-0 overflow-hidden"
                                >
                                    <div className="bg-white rounded-xl border border-zinc-100 p-5 space-y-6">
                                        {/* Categories */}
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-3">Category</h3>
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => clearFilter('category')}
                                                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                        !filters?.category
                                                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                                                            : 'text-zinc-600 hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    All Categories
                                                </button>
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => applyFilters({ category: String(cat.id) })}
                                                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                                                            String(filters?.category) === String(cat.id)
                                                                ? 'bg-zinc-100 text-zinc-900 font-medium'
                                                                : 'text-zinc-600 hover:bg-zinc-50'
                                                        }`}
                                                    >
                                                        {cat.name}
                                                        <span className="text-zinc-400 text-xs">{cat.products_count}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Colors */}
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-3">Color</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {availableColors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => applyFilters({
                                                            color: filters?.color === color ? undefined : color
                                                        })}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                                                            filters?.color === color
                                                                ? 'border-zinc-900 scale-110 ring-2 ring-zinc-900/20'
                                                                : 'border-zinc-200 hover:border-zinc-400'
                                                        }`}
                                                        style={{ backgroundColor: color }}
                                                        title={color}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Price Range */}
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-3">Price Range</h3>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    placeholder={formatPrice(priceRange.min)}
                                                    defaultValue={filters?.min_price || ''}
                                                    onBlur={(e) => applyFilters({ min_price: e.target.value || undefined })}
                                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ min_price: e.target.value || undefined })}
                                                    className="w-full h-9 px-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                                                />
                                                <span className="text-zinc-400 text-sm">–</span>
                                                <input
                                                    type="number"
                                                    placeholder={formatPrice(priceRange.max)}
                                                    defaultValue={filters?.max_price || ''}
                                                    onBlur={(e) => applyFilters({ max_price: e.target.value || undefined })}
                                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ max_price: e.target.value || undefined })}
                                                    className="w-full h-9 px-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400"
                                                />
                                            </div>
                                            <p className="text-[11px] text-zinc-400 mt-1">
                                                {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.aside>
                            )}
                        </AnimatePresence>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-zinc-500">
                                    {products.length} {products.length === 1 ? 'product' : 'products'}
                                </p>
                            </div>

                            {products.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-zinc-500 text-lg mb-2">No products match your filters.</p>
                                    <button onClick={clearAll} className="text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors">
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product, i) => (
                                        <motion.div
                                            key={product.id}
                                            variants={fadeUp}
                                            initial="hidden"
                                            animate="visible"
                                            custom={i + 1}
                                        >
                                            <ProductCard product={product} wishlisted={wishlistIds.includes(product.id)} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
