'use client';

import { motion } from 'framer-motion';
import { Target, TrendingDown, CheckCircle, BrainCircuit } from 'lucide-react';

const insights = [
    {
        title: 'Model Accuracy',
        value: '94.2%',
        subtitle: 'Last 7 Days',
        icon: Target,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
        title: 'Most Improved',
        value: 'Kerala',
        subtitle: '-18% AQI Drift',
        icon: TrendingDown,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
        title: 'False Positives',
        value: '1.4%',
        subtitle: 'Alert Errors',
        icon: CheckCircle,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
        title: 'Inferences',
        value: '1.2M',
        subtitle: 'API Calls / 24h',
        icon: BrainCircuit,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20'
    }
];

export function AnalyticsInsightCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((item, i) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-panel p-5 rounded-2xl flex items-center justify-between group hover:bg-slate-800/50 transition-colors border ${item.bg}`}
                >
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{item.title}</p>
                        <h4 className={`text-2xl font-bold font-display ${item.color} mb-1 drop-shadow-md`}>{item.value}</h4>
                        <p className="text-slate-500 text-[10px] uppercase font-bold">{item.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
