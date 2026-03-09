import { motion } from 'framer-motion';
import { Droplets, Wind, ShieldCheck, Activity } from 'lucide-react';

const interventions = [
    {
        id: '1',
        title: 'Anti-Smog Guns Deployed',
        location: 'Western Valley Hub',
        status: 'Active',
        impact: '-15% PM10/hr',
        icon: Droplets,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20'
    },
    {
        id: '2',
        title: 'Traffic Diversion Protocol',
        location: 'Capital Region',
        status: 'Active',
        impact: '-8% NO2/hr',
        icon: Activity,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20'
    },
    {
        id: '3',
        title: 'Industrial Shutdown (Tier 2)',
        location: 'Tech City Outskirts',
        status: 'Monitoring',
        impact: 'Stabilizing',
        icon: ShieldCheck,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
    }
];

export function ActiveInterventions() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-3xl h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 font-display">Active Interventions</h2>
                    <p className="text-sm text-slate-400">Current mitigation efforts</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    3 Active
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {interventions.map((item) => (
                    <div key={item.id} className={`p-4 rounded-xl border ${item.bg} ${item.border} flex items-center justify-between group cursor-default`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl bg-slate-800 ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`text-sm font-semibold ${item.color}`}>{item.title}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{item.location}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-200">{item.impact}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-1">{item.status}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                <Wind className="w-4 h-4" />
                Propose New Intervention
            </button>
        </motion.div>
    );
}
