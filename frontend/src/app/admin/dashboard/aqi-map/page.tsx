'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const AQIDrillDown = dynamic(() => import('@/components/dashboard/AQIDrillDown'), {
    ssr: false,
    loading: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-52 rounded-2xl glass-panel animate-pulse" />
            ))}
        </div>
    ),
});

export default function AQIMapPage() {
    const router = useRouter();

    return (
        <DashboardLayout>
            <div className="pb-8">
                <header className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <Compass className="w-6 h-6 text-indigo-400" />
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white">AQI Intelligence</h1>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Drill into national air quality data — from states to cities to hyper-local areas.
                        Each location shows source detection, AI diagnosis, and recommended strategic actions.
                    </p>
                </header>

                <AQIDrillDown />
            </div>
        </DashboardLayout>
    );
}
