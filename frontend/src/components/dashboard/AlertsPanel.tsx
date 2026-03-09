import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { getAdminStats } from '@/services/adminService';

const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'severe':
        case 'high':
            return ShieldAlert;
        case 'moderate':
            return AlertTriangle;
        default:
            return Info;
    }
};

const getAlertColors = (type: string) => {
    switch (type.toLowerCase()) {
        case 'severe':
        case 'high':
            return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
        case 'moderate':
            return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
        default:
            return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    }
};

export function AlertsPanel() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getAdminStats();
                setAlerts(data.activeAlerts || []);
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    if (loading) return (
        <div className="glass-panel p-6 rounded-3xl h-full animate-pulse bg-slate-800/20" />
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-3xl h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 font-display">AI Recommendations</h2>
                    <p className="text-sm text-slate-400">Actionable intelligence</p>
                </div>
                <div className="flex items-center gap-1 text-rose-400 text-xs font-semibold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 focus:outline-none">
                    <span className="relative flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    Live
                </div>
            </div>

            <div className="space-y-4">
                {alerts.length > 0 ? alerts.map((alert) => {
                    const colors = getAlertColors(alert.type);
                    const Icon = getAlertIcon(alert.type);
                    return (
                        <motion.div
                            key={alert.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-xl border ${colors.bg} ${colors.border} flex gap-4 cursor-pointer`}
                        >
                            <div className={`mt-0.5 ${colors.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1 gap-2">
                                    <h4 className={`text-sm font-semibold ${colors.color}`}>{alert.title}</h4>
                                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{alert.time}</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                            </div>
                        </motion.div>
                    );
                }) : (
                    <div className="text-center py-8">
                        <p className="text-slate-500 text-sm italic">No active alerts at this time.</p>
                    </div>
                )}
            </div>

            <Link href="/admin/dashboard/alerts" className="w-full mt-4 py-3 rounded-xl border border-slate-700/50 text-slate-400 text-sm font-medium hover:text-slate-200 hover:bg-slate-800/50 transition-colors block text-center">
                View All Alerts
            </Link>
        </motion.div>
    );
}

