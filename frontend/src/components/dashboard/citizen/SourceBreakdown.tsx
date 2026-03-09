'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Car, Building2, Factory, CloudFog } from 'lucide-react';

export function SourceBreakdown() {
    const sources = [
        { name: 'Traffic Emissions', percentage: 45, icon: <Car />, color: 'bg-rose-500' },
        { name: 'Construction Dust', percentage: 30, icon: <Building2 />, color: 'bg-amber-500' },
        { name: 'Industrial Sites', percentage: 15, icon: <Factory />, color: 'bg-purple-500' },
        { name: 'Background/Weather', percentage: 10, icon: <CloudFog />, color: 'bg-slate-500' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-3xl border border-white/5"
        >
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-100 font-display">Pollution Sources</h2>
                <p className="text-sm text-slate-400">Estimated contribution in your area</p>
            </div>

            <div className="space-y-5">
                {sources.map((s, idx) => (
                    <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg bg-slate-800 ${s.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(s.icon, { className: 'w-4 h-4' })}
                                </div>
                                <span className="text-sm font-semibold text-slate-200">{s.name}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-100">{s.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${s.percentage}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.1 * idx }}
                                className={`h-full ${s.color} rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
