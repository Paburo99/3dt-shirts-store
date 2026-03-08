import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';

const COLOMBIAN_DEPARTMENTS = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
    'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
    'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
    'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada',
];

const addressSchema = z.object({
    label: z.string().min(1, 'Label is required').max(50),
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(7, 'Phone is required').max(20),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    department: z.string().min(2, 'Department is required'),
    notes: z.string().optional(),
    is_default: z.boolean().optional(),
});

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Index({ addresses }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            label: 'Home', name: '', phone: '', address: '',
            city: '', department: '', notes: '', is_default: false,
        },
    });

    const openNew = () => {
        reset({ label: 'Home', name: '', phone: '', address: '', city: '', department: '', notes: '', is_default: false });
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (addr) => {
        reset({
            label: addr.label, name: addr.name, phone: addr.phone, address: addr.address,
            city: addr.city, department: addr.department, notes: addr.notes || '', is_default: addr.is_default,
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const onSubmit = (data) => {
        if (editingId) {
            router.put(route('addresses.update', editingId), data, {
                onSuccess: () => { setShowForm(false); toast.success('Address updated'); },
            });
        } else {
            router.post(route('addresses.store'), data, {
                onSuccess: () => { setShowForm(false); toast.success('Address saved'); },
            });
        }
    };

    const handleDelete = (id) => {
        router.delete(route('addresses.destroy', id), {
            onSuccess: () => toast.success('Address deleted'),
        });
    };

    return (
        <StoreLayout>
            <Head title="My Addresses" />

            <div className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center justify-between mb-8">
                        <motion.h1
                            variants={fadeUp} initial="hidden" animate="visible"
                            className="text-3xl font-extrabold tracking-tight text-zinc-900"
                        >
                            My Addresses
                        </motion.h1>
                        {!showForm && (
                            <Button onClick={openNew} size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Address
                            </Button>
                        )}
                    </div>

                    {/* Form */}
                    {showForm && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-zinc-900">
                                        {editingId ? 'Edit Address' : 'New Address'}
                                    </h2>
                                    <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-600">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="label">Label</Label>
                                            <Input id="label" {...register('label')} className="mt-1" placeholder="Home, Office, etc." />
                                            {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" {...register('name')} className="mt-1" />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" type="tel" {...register('phone')} className="mt-1" />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" {...register('address')} className="mt-1" placeholder="Calle 123 #45-67" />
                                        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" {...register('city')} className="mt-1" />
                                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="department">Department</Label>
                                            <select
                                                id="department"
                                                {...register('department')}
                                                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            >
                                                <option value="">Select...</option>
                                                {COLOMBIAN_DEPARTMENTS.map((d) => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">Notes (optional)</Label>
                                        <Input id="notes" {...register('notes')} className="mt-1" placeholder="Gate code, landmarks, etc." />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" {...register('is_default')} className="rounded border-zinc-300" />
                                        <span className="text-sm text-zinc-600">Set as default address</span>
                                    </label>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                        <Button type="submit">{editingId ? 'Update' : 'Save'} Address</Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* Address List */}
                    {addresses.length === 0 && !showForm ? (
                        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-16 text-center">
                            <MapPin className="h-20 w-20 text-zinc-200 mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-zinc-800 mb-2">No addresses saved</h2>
                            <p className="text-zinc-500 mb-8">Save an address for faster checkout.</p>
                            <Button onClick={openNew}>
                                <Plus className="h-4 w-4 mr-2" /> Add Address
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((addr) => (
                                <motion.div
                                    key={addr.id}
                                    variants={fadeUp} initial="hidden" animate="visible"
                                    className="bg-white rounded-xl border border-zinc-100 shadow-sm p-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-zinc-900">{addr.label}</h3>
                                                {addr.is_default && (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        <Star className="h-3 w-3 mr-1" /> Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-700">{addr.name}</p>
                                            <p className="text-sm text-zinc-500">{addr.phone}</p>
                                            <p className="text-sm text-zinc-500 mt-1">
                                                {addr.address}, {addr.city}, {addr.department}
                                            </p>
                                            {addr.notes && (
                                                <p className="text-xs text-zinc-400 mt-1 italic">{addr.notes}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-4">
                                            <button
                                                onClick={() => openEdit(addr)}
                                                className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
