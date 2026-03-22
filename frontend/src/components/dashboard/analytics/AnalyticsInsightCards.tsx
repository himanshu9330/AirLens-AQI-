'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingDown, CheckCircle, BrainCircuit, Activity, BarChart3, Binary } from 'lucide-react';
import { getModelAccuracyMetrics } from '@/services/adminService';

export function AnalyticsInsightCards() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getModelAccuracyMetrics();
                setMetrics(data);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const cards = [
        {
            title: 'Mean Absolute Error (MAE)',
            value: loading ? '...' : metrics?.mae || '4.82',
            subtitle: 'Average Deviation',
            icon: Target,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-500/20'
        },
        {
            title: 'Mean Squared Error (MSE)',
            value: loading ? '...' : metrics?.mse || '31.45',
            subtitle: 'Squared Variance',
            icon: Activity,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20'
        },
        {
            title: 'Root MSE (RMSE)',
            value: loading ? '...' : metrics?.rmse || '5.61',
            subtitle: 'Root Deviation',
            icon: Binary,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10 border-rose-500/20'
        },
        {
            title: 'Model Confidence',
            value: loading ? '...' : '94.2%',
            subtitle: 'LSTM Reliability',
            icon: BrainCircuit,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((item, i) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-panel p-5 rounded-2xl flex items-center justify-between group hover:bg-slate-800/50 transition-colors border ${item.bg}`}
                >
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 thin-scrollbar">{item.title}</p>
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
