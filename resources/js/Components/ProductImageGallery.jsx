import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

// Product preview images mapped by slug
// In a real app these would come from spatie/laravel-medialibrary
// For now, we generate color-based previews
const productImages = {
    'essential-3d-hoodie': [
        { id: 1, alt: 'Hoodie Front View', gradient: 'from-red-400 to-red-600', label: 'Front' },
        { id: 2, alt: 'Hoodie Back View', gradient: 'from-zinc-800 to-zinc-900', label: 'Back' },
        { id: 3, alt: 'Hoodie Detail', gradient: 'from-red-300 to-red-500', label: 'Detail' },
        { id: 4, alt: 'Hoodie Lifestyle', gradient: 'from-zinc-600 to-zinc-800', label: 'Lifestyle' },
    ],
    'classic-3d-crewneck': [
        { id: 1, alt: 'Crewneck Front View', gradient: 'from-gray-500 to-gray-700', label: 'Front' },
        { id: 2, alt: 'Crewneck Back View', gradient: 'from-yellow-300 to-yellow-500', label: 'Back' },
        { id: 3, alt: 'Crewneck Detail', gradient: 'from-gray-400 to-gray-600', label: 'Detail' },
        { id: 4, alt: 'Crewneck Lifestyle', gradient: 'from-yellow-200 to-yellow-400', label: 'Lifestyle' },
    ],
    'cyberpunk-cargo-pants': [
        { id: 1, alt: 'Cargo Front View', gradient: 'from-green-600 to-green-800', label: 'Front' },
        { id: 2, alt: 'Cargo Back View', gradient: 'from-zinc-800 to-zinc-950', label: 'Back' },
        { id: 3, alt: 'Cargo Detail', gradient: 'from-green-500 to-green-700', label: 'Detail' },
        { id: 4, alt: 'Cargo Lifestyle', gradient: 'from-zinc-700 to-zinc-900', label: 'Lifestyle' },
    ],
};

export default function ProductImageGallery({ productSlug, productName }) {
    const images = productImages[productSlug] || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
    });

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };
        emblaApi.on('select', onSelect);
        onSelect();
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi]);

    if (images.length === 0) return null;

    return (
        <div className="relative bg-zinc-100/80 backdrop-blur-sm border-t border-zinc-200/50">
            <div className="flex items-center gap-2 px-4 py-2">
                <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Gallery</span>
            </div>

            <div className="relative px-4 pb-4">
                {/* Navigation Buttons */}
                {canScrollPrev && (
                    <button
                        onClick={scrollPrev}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-zinc-700 hover:text-zinc-900 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
                {canScrollNext && (
                    <button
                        onClick={scrollNext}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-zinc-700 hover:text-zinc-900 transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}

                {/* Carousel */}
                <div ref={emblaRef} className="overflow-hidden rounded-lg">
                    <div className="flex gap-2">
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`flex-none w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                    selectedIndex === index
                                        ? 'border-white shadow-lg scale-105'
                                        : 'border-transparent opacity-75 hover:opacity-100'
                                }`}
                                onClick={() => setSelectedIndex(index)}
                            >
                                <div className={`w-full h-full bg-gradient-to-br ${image.gradient} flex items-center justify-center`}>
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider drop-shadow">
                                        {image.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
