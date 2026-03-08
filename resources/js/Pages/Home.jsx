import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Rotate3d, Palette, ShieldCheck } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import StoreLayout from '@/Layouts/StoreLayout';
import ProductCard from '@/Components/ProductCard';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
    }),
};

const features = [
    {
        icon: Rotate3d,
        title: '3D Preview',
        description: 'Rotate, zoom, and inspect every detail before you buy.',
    },
    {
        icon: Palette,
        title: 'Custom Colors',
        description: 'Pick your perfect shade and see it applied in real time.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Payments',
        description: 'Pay with Nequi, PSE, credit cards, or Bancolombia.',
    },
];

export default function Home({ featuredProducts }) {
    return (
        <StoreLayout>
            <Head>
                <title>3D Shirts — Premium Apparel You Can Customize in 3D</title>
                <meta name="description" content="Explore our collection of premium hoodies, crewnecks, and cargo pants. Customize colors in a real-time 3D configurator before you buy." />
                <meta property="og:title" content="3D Shirts — Premium 3D Customizable Apparel" />
                <meta property="og:description" content="See it, style it, own it. Customize premium apparel in an interactive 3D viewer." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="3D Shirts — Premium 3D Customizable Apparel" />
            </Head>

            {/* Hero */}
            <section className="relative overflow-hidden bg-zinc-900 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.04),transparent_70%)]" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 relative z-10">
                    <div className="max-w-2xl">
                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                            className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4"
                        >
                            Premium 3D Apparel
                        </motion.p>
                        <motion.h1
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
                        >
                            See it in 3D.
                            <br />
                            <span className="text-zinc-500">Make it yours.</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            className="mt-6 text-lg text-zinc-400 max-w-lg leading-relaxed"
                        >
                            Customize hoodies, crewnecks, and cargo pants with our interactive 3D configurator.
                            Pick your color, choose your size, and order with confidence.
                        </motion.p>
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Button size="lg" className="h-12 px-8 text-base font-bold" asChild>
                                <Link href={route('shop')}>
                                    Shop Now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white border-b border-zinc-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                custom={i}
                                className="text-center"
                            >
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                                    <feature.icon className="h-6 w-6 text-zinc-900" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900">{feature.title}</h3>
                                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-zinc-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                            Featured Collection
                        </h2>
                        <p className="mt-3 text-zinc-500 max-w-md mx-auto">
                            Our most popular pieces — customize them in 3D.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product, i) => (
                            <motion.div
                                key={product.id}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                custom={i}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Button variant="outline" size="lg" asChild>
                            <Link href={route('shop')}>
                                View All Products
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-zinc-900 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Ready to customize?
                        </h2>
                        <p className="mt-4 text-zinc-400 max-w-md mx-auto">
                            Jump into our 3D configurator and design your perfect piece.
                        </p>
                        <Button size="lg" className="mt-8 h-12 px-8 text-base font-bold bg-white text-zinc-900 hover:bg-zinc-100" asChild>
                            <Link href={route('shop')}>
                                Start Designing
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </StoreLayout>
    );
}
