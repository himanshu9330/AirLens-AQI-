'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CalendarDays, TrendingUp, TrendingDown } from 'lucide-react';

export function PredictionPanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 font-display">AI Forecast</h2>
                    <p className="text-sm text-slate-400">Hyper-local predictions</p>
                </div>
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase">
                    ML Live
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">

                {/* 3 Hours */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-800 rounded-xl text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-200">Next 3 Hours</h4>
                            <p className="text-xs text-slate-500 font-medium">Expected to clear up slightly</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black font-display text-amber-400 mb-0.5">145</div>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <TrendingDown className="w-3 h-3" />
                            <span>-12</span>
                        </div>
                    </div>
                </div>

                {/* 6 Hours */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-800 rounded-xl text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-200">Next 6 Hours</h4>
                            <p className="text-xs text-slate-500 font-medium">Traffic peak incoming</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black font-display text-rose-400 mb-0.5">182</div>
                        <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+37</span>
                        </div>
                    </div>
                </div>

                {/* Tomorrow */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-800 rounded-xl text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-200">Tomorrow</h4>
                            <p className="text-xs text-slate-500 font-medium">Daily Average Forecast</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black font-display text-amber-500 mb-0.5">160</div>
                        <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+15</span>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
