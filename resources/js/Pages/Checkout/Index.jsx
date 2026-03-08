import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import StoreLayout from '@/Layouts/StoreLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, ArrowRight, MapPin, ClipboardCheck, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const COLOMBIAN_DEPARTMENTS = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
    'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
    'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
    'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada',
];

const shippingSchema = z.object({
    customer_name: z.string().min(2, 'Name is required'),
    customer_email: z.string().email('Valid email is required'),
    customer_phone: z.string().min(7, 'Phone number is required').max(20),
    shipping_address: z.string().min(5, 'Address is required'),
    shipping_city: z.string().min(2, 'City is required'),
    shipping_department: z.string().min(2, 'Department is required'),
    shipping_notes: z.string().optional(),
    save_address: z.boolean().optional(),
});

const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(price));

const steps = [
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'review', label: 'Review', icon: ClipboardCheck },
];

export default function Index({ savedAddresses, user }) {
    const { errors } = usePage().props;
    const cart = useConfiguratorStore((state) => state.cart);
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        setValue,
        watch,
        trigger,
    } = useForm({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            customer_name: user?.name || '',
            customer_email: user?.email || '',
            customer_phone: '',
            shipping_address: '',
            shipping_city: '',
            shipping_department: '',
            shipping_notes: '',
            save_address: false,
        },
    });

    const formValues = watch();

    const fillFromAddress = (address) => {
        setValue('customer_name', address.name);
        setValue('customer_phone', address.phone);
        setValue('shipping_address', address.address);
        setValue('shipping_city', address.city);
        setValue('shipping_department', address.department);
        setValue('shipping_notes', address.notes || '');
        toast.success(`Loaded "${address.label}" address`);
    };

    const goToReview = async () => {
        const valid = await trigger();
        if (valid) setStep(1);
    };

    const onSubmit = (data) => {
        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setSubmitting(true);

        router.post(route('checkout.store'), {
            ...data,
            items: cart.map(item => ({ sku_id: item.sku_id, quantity: item.quantity })),
        }, {
            onError: () => {
                setSubmitting(false);
                toast.error('Something went wrong. Please try again.');
            },
        });
    };

    if (cart.length === 0) {
        return (
            <StoreLayout>
                <Head title="Checkout" />
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <ShoppingBag className="h-20 w-20 text-zinc-200 mb-6" />
                    <h1 className="text-2xl font-bold text-zinc-800 mb-2">Your cart is empty</h1>
                    <p className="text-zinc-500 mb-8">Add some items before checking out.</p>
                    <Button asChild>
                        <a href={route('shop')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Shop
                        </a>
                    </Button>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <Head title="Checkout" />

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mb-10">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <button
                                    onClick={() => i < step && setStep(i)}
                                    disabled={i > step}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                        i === step
                                            ? 'bg-zinc-900 text-white'
                                            : i < step
                                            ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 cursor-pointer'
                                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    }`}
                                >
                                    <s.icon className="h-4 w-4" />
                                    {s.label}
                                </button>
                                {i < steps.length - 1 && (
                                    <div className={`h-px w-12 ${i < step ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {errors?.cart && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {errors.cart}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {step === 0 && (
                                    <motion.div
                                        key="shipping"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 sm:p-8">
                                            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                                <Truck className="h-5 w-5" />
                                                Shipping Information
                                            </h2>

                                            {/* Saved addresses */}
                                            {savedAddresses?.length > 0 && (
                                                <div className="mb-6">
                                                    <p className="text-sm font-medium text-zinc-600 mb-3">Use a saved address:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {savedAddresses.map((addr) => (
                                                            <button
                                                                key={addr.id}
                                                                type="button"
                                                                onClick={() => fillFromAddress(addr)}
                                                                className="px-4 py-2 text-sm border border-zinc-200 rounded-lg hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
                                                            >
                                                                {addr.label} — {addr.city}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <Separator className="mt-6" />
                                                </div>
                                            )}

                                            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div>
                                                        <Label htmlFor="customer_name">Full Name</Label>
                                                        <Input id="customer_name" {...register('customer_name')} className="mt-1.5" />
                                                        {formErrors.customer_name && <p className="text-xs text-red-500 mt-1">{formErrors.customer_name.message}</p>}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="customer_email">Email</Label>
                                                        <Input id="customer_email" type="email" {...register('customer_email')} className="mt-1.5" />
                                                        {formErrors.customer_email && <p className="text-xs text-red-500 mt-1">{formErrors.customer_email.message}</p>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="customer_phone">Phone</Label>
                                                    <Input id="customer_phone" type="tel" {...register('customer_phone')} className="mt-1.5" placeholder="300 123 4567" />
                                                    {formErrors.customer_phone && <p className="text-xs text-red-500 mt-1">{formErrors.customer_phone.message}</p>}
                                                </div>

                                                <div>
                                                    <Label htmlFor="shipping_address">Address</Label>
                                                    <Input id="shipping_address" {...register('shipping_address')} className="mt-1.5" placeholder="Calle 123 #45-67, Apt 890" />
                                                    {formErrors.shipping_address && <p className="text-xs text-red-500 mt-1">{formErrors.shipping_address.message}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                    <div>
                                                        <Label htmlFor="shipping_city">City</Label>
                                                        <Input id="shipping_city" {...register('shipping_city')} className="mt-1.5" />
                                                        {formErrors.shipping_city && <p className="text-xs text-red-500 mt-1">{formErrors.shipping_city.message}</p>}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="shipping_department">Department</Label>
                                                        <select
                                                            id="shipping_department"
                                                            {...register('shipping_department')}
                                                            className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        >
                                                            <option value="">Select...</option>
                                                            {COLOMBIAN_DEPARTMENTS.map((d) => (
                                                                <option key={d} value={d}>{d}</option>
                                                            ))}
                                                        </select>
                                                        {formErrors.shipping_department && <p className="text-xs text-red-500 mt-1">{formErrors.shipping_department.message}</p>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="shipping_notes">Delivery Notes (optional)</Label>
                                                    <Input id="shipping_notes" {...register('shipping_notes')} className="mt-1.5" placeholder="Gate code, landmarks, etc." />
                                                </div>

                                                {user && (
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" {...register('save_address')} className="rounded border-zinc-300" />
                                                        <span className="text-sm text-zinc-600">Save this address for next time</span>
                                                    </label>
                                                )}

                                                <div className="flex justify-end pt-2">
                                                    <Button type="button" onClick={goToReview} className="h-11 px-8 text-base font-bold">
                                                        Continue to Review
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 1 && (
                                    <motion.div
                                        key="review"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 sm:p-8">
                                            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                                <ClipboardCheck className="h-5 w-5" />
                                                Order Review
                                            </h2>

                                            {/* Shipping summary */}
                                            <div className="bg-zinc-50 rounded-lg p-4 mb-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-zinc-900">{formValues.customer_name}</p>
                                                        <p className="text-sm text-zinc-500">{formValues.customer_email}</p>
                                                        <p className="text-sm text-zinc-500">{formValues.customer_phone}</p>
                                                        <p className="text-sm text-zinc-500 mt-2">
                                                            {formValues.shipping_address}, {formValues.shipping_city}, {formValues.shipping_department}
                                                        </p>
                                                        {formValues.shipping_notes && (
                                                            <p className="text-sm text-zinc-400 mt-1 italic">{formValues.shipping_notes}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(0)}
                                                        className="text-sm text-zinc-600 hover:text-zinc-900 underline"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className="space-y-4 mb-6">
                                                {cart.map((item) => (
                                                    <div key={item.sku_id} className="flex items-center gap-4">
                                                        <div
                                                            className="w-12 h-12 rounded-lg border border-zinc-200 shrink-0"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-zinc-900 truncate">{item.name}</p>
                                                            <p className="text-xs text-zinc-500 uppercase">Size {item.size} &middot; Qty {item.quantity}</p>
                                                        </div>
                                                        <p className="font-bold text-sm text-zinc-900 tabular-nums">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <Separator className="mb-6" />

                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-base font-bold text-zinc-900">Total</span>
                                                <span className="text-2xl font-extrabold text-zinc-900">{formatPrice(totalPrice)}</span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button variant="outline" onClick={() => setStep(0)} className="sm:flex-1">
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Back
                                                </Button>
                                                <Button
                                                    onClick={handleSubmit(onSubmit)}
                                                    disabled={submitting}
                                                    className="sm:flex-[2] h-12 text-base font-bold"
                                                >
                                                    {submitting ? 'Processing...' : 'Place Order & Pay'}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sidebar summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-zinc-900 mb-4">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    {cart.map((item) => (
                                        <div key={item.sku_id} className="flex justify-between">
                                            <span className="text-zinc-600 truncate mr-2">
                                                {item.name} &times; {item.quantity}
                                            </span>
                                            <span className="font-medium tabular-nums shrink-0">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-zinc-900">Total</span>
                                    <span className="text-xl font-extrabold text-zinc-900">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
