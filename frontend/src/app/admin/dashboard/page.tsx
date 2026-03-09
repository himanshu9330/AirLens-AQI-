'use client';

import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { PollutionSourcesPanel } from '@/components/dashboard/PollutionSourcesPanel';
import { PredictionChart } from '@/components/dashboard/PredictionChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { ActiveInterventions } from '@/components/dashboard/ActiveInterventions';

// Dynamically import Map to prevent SSR issues with Leaflet
const AQIMapFeature = dynamic(() => import('@/components/dashboard/AQIMapFeature'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[400px] lg:min-h-[500px] glass-panel rounded-3xl animate-pulse bg-slate-800/20" />
    ),
});

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="pb-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">Overview</h1>
                    <p className="text-slate-400 text-sm">Real-time environmental intelligence and automated analysis.</p>
                </header>

                <OverviewCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area - Left Side */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <AQIMapFeature />
                        <PredictionChart />
                    </div>

                    {/* Action & Intelligence Panels - Right Side */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <ActiveInterventions />
                        <AlertsPanel />
                        <PollutionSourcesPanel />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
