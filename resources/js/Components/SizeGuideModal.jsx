import { Ruler } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/Components/ui/dialog';

const sizeData = [
    { size: 'S', chest: '86-91', length: '66', sleeve: '61' },
    { size: 'M', chest: '91-97', length: '69', sleeve: '63' },
    { size: 'L', chest: '97-102', length: '72', sleeve: '65' },
    { size: 'XL', chest: '102-107', length: '74', sleeve: '67' },
];

export default function SizeGuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline underline-offset-4 flex items-center gap-1 transition-colors">
                    <Ruler className="h-3 w-3" />
                    Size Guide
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Size Guide</DialogTitle>
                    <DialogDescription>
                        All measurements are in centimeters. For the best fit, measure your body and compare.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-zinc-900 text-white">
                                <th className="px-4 py-3 text-left font-semibold">Size</th>
                                <th className="px-4 py-3 text-center font-semibold">Chest</th>
                                <th className="px-4 py-3 text-center font-semibold">Length</th>
                                <th className="px-4 py-3 text-center font-semibold">Sleeve</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizeData.map((row, i) => (
                                <tr
                                    key={row.size}
                                    className={`border-t border-zinc-100 ${i % 2 === 1 ? 'bg-zinc-50' : ''}`}
                                >
                                    <td className="px-4 py-3 font-bold text-zinc-900">{row.size}</td>
                                    <td className="px-4 py-3 text-center text-zinc-600">{row.chest}</td>
                                    <td className="px-4 py-3 text-center text-zinc-600">{row.length}</td>
                                    <td className="px-4 py-3 text-center text-zinc-600">{row.sleeve}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3 space-y-2 text-xs text-zinc-500">
                    <p><strong>Chest:</strong> Measure around the fullest part of your chest.</p>
                    <p><strong>Length:</strong> Measure from the highest point of the shoulder to the hem.</p>
                    <p><strong>Sleeve:</strong> Measure from shoulder seam to cuff.</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
