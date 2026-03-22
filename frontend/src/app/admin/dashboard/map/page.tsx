'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function MapPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard/aqi-map');
    }, [router]);

    return (
        <DashboardLayout>
            <div className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Redirecting to AQI Intelligence...</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
