'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ModelAccuracyChart } from '@/components/dashboard/analytics/ModelAccuracyChart';
import { RegionalComparisonChart } from '@/components/dashboard/analytics/RegionalComparisonChart';
import { AQIRadarChart } from '@/components/dashboard/analytics/AQIRadarChart';
import { AnalyticsInsightCards } from '@/components/dashboard/analytics/AnalyticsInsightCards';

export default function AdminAnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="pb-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">System Analytics</h1>
                    <p className="text-slate-400 text-sm">Deep dive into ML model performance, regional statistics, and historical trends.</p>
                </header>

                <div className="flex flex-col gap-6">
                    {/* Top Topline Metrics */}
                    <AnalyticsInsightCards />

                    {/* Main Chart Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Primary Timeline - Spans 2 cols on Large screens */}
                        <div className="lg:col-span-2">
                            <ModelAccuracyChart />
                        </div>
                        
                        {/* Secondary Radar - Spans 1 col */}
                        <div className="lg:col-span-1 border border-slate-800/50 rounded-2xl overflow-hidden glass-panel flex items-center justify-center p-6">
                            <AQIRadarChart />
                        </div>
                    </div>

                    {/* Full Width Bottom Chart */}
                    <div className="w-full">
                        <RegionalComparisonChart />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
