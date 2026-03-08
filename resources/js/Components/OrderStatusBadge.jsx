import { Badge } from '@/Components/ui/badge';

const statusConfig = {
    pending_payment: { label: 'Pending Payment', variant: 'outline' },
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    shipped: { label: 'Shipped', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
    cancelled: { label: 'Cancelled', className: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function OrderStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending_payment;

    return (
        <Badge variant={config.variant || 'outline'} className={config.className}>
            {config.label}
        </Badge>
    );
}
