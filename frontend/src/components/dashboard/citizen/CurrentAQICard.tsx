'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wind, MapPin } from 'lucide-react';

interface Props {
    aqi: number;
    category: string;
    area: string;
}

export function CurrentAQICard({ aqi, category, area }: Props) {
    const getColor = (val: number) => {
        if (val <= 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (val <= 100) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        if (val <= 200) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        if (val <= 300) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    };

    const colorClass = getColor(aqi);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden"
        >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>

            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Station</h2>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                Live
                            </div>
                        </div>
                        <div className="text-slate-200 font-bold truncate max-w-[200px] flex items-center gap-2 text-base">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            {area || 'Detecting...'}
                        </div>
                    </div>
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 shadow-lg shadow-indigo-500/5">
                        <Activity className="w-5 h-5" />
                    </div>
                </div>

                <div className="mt-8 flex items-baseline gap-4">
                    <h1 className={`text-7xl font-black font-display tracking-tight ${colorClass.split(' ')[0]}`}>
                        {aqi || '--'}
                    </h1>
                    <div className={`px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wider ${colorClass}`}>
                        {category}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                <div>
                    <h3 className="text-slate-400 text-xs font-semibold mb-1">Main Pollutant</h3>
                    <div className="flex items-center gap-2 text-slate-200 font-bold">
                        <Wind className="w-4 h-4 text-rose-400" />
                        PM2.5 <span className="text-rose-400 ml-1">↑</span>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-slate-400 text-xs font-semibold mb-1">Last Updated</h3>
                    <div className="text-slate-300 text-sm font-medium">Just now</div>
                </div>
            </div>
        </motion.div>
    );
}
