'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HierarchicalPredictionChart } from '@/components/dashboard/prediction/HierarchicalPredictionChart';

export default function AdminPredictionsPage() {
    return (
        <DashboardLayout>
            <div className="pb-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">Hierarchical AQI Predictions</h1>
                    <p className="text-slate-400 text-sm">Targeted AI forecasting drilled down by State, City, and Area.</p>
                </header>

                <div className="w-full">
                    <HierarchicalPredictionChart />
                </div>
            </div>
        </DashboardLayout>
    );
}
