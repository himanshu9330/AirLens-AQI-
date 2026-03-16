'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsPanel } from '@/components/dashboard/settings/SettingsPanel';

export default function AdminSettingsPage() {
    return (
        <DashboardLayout>
            <div className="pb-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-1">System Settings</h1>
                    <p className="text-slate-400 text-sm">Configure AI models, API integrations, and notification routing.</p>
                </header>

                <div className="w-full">
                    <SettingsPanel />
                </div>
            </div>
        </DashboardLayout>
    );
}
