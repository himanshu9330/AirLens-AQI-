'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
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
                        <section id="aqi-map" className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                    Live Geographic Intelligence
                                </h2>
                                <button 
                                    onClick={() => router.push('/admin/dashboard/aqi-map')}
                                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest flex items-center gap-1 group"
                                >
                                    View State-wise Intelligence 
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </button>
                            </div>
                            <AQIMapFeature />
                        </section>
                        <PredictionChart />
                    </div>

                    {/* Action & Intelligence Panels - Right Side */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <ActiveInterventions />
                        <section id="alerts">
                            <AlertsPanel />
                        </section>
                        <section id="sources">
                            <PollutionSourcesPanel />
                        </section>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
