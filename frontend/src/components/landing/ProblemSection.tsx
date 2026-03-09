'use client';

import { motion } from 'framer-motion';
import { Map, AlertTriangle } from 'lucide-react';

export function ProblemSection() {
    return (
        <section id="problem" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900">
            {/* Background elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-display text-white mb-6"
                    >
                        Why City-Wide AQI Isn't Enough.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400"
                    >
                        Air pollution is highly localized. A single sensor cannot tell you what you are breathing on your specific street.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">

                    {/* The "Old Way" */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 w-full max-w-md"
                    >
                        <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden backdrop-blur-xl group">
                            <div className="absolute inset-0 bg-slate-900/50"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Standard City AQI</span>
                                <div className="w-32 h-32 rounded-full border-4 border-amber-500/30 flex flex-col items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse"></div>
                                    <span className="text-4xl font-black text-amber-500 font-display">145</span>
                                    <span className="text-xs text-amber-500/70 font-semibold uppercase mt-1">Unhealthy</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-200 mb-2">One Number For Everyone</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    10 million people relying on the exact same metric, hiding deadly micro-environments.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* VS divider */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 rounded-full glass-light border border-slate-700 flex items-center justify-center z-20 shadow-xl shadow-indigo-500/10 -my-6 lg:my-0 lg:-mx-6 shrink-0"
                    >
                        <span className="text-lg font-black text-slate-500 italic">VS</span>
                    </motion.div>

                    {/* The "New Way" */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 w-full max-w-md"
                    >
                        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden backdrop-blur-xl group hover:border-indigo-500/50 transition-colors shadow-2xl shadow-indigo-500/10">
                            {/* "Map" Background Simulation */}
                            <div className="absolute inset-0 bg-[#0f172a] opacity-80 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

                            {/* Heat zones */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-4 right-4 w-32 h-32 bg-red-500/20 blur-2xl rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-4 left-4 w-40 h-40 bg-emerald-500/20 blur-2xl rounded-full"
                            />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-6 flex items-center gap-2"><Map className="w-4 h-4" /> AirLens Map</span>

                                <div className="w-full relative h-32 mb-6 flex items-center justify-center gap-4">
                                    {/* Simulated markers */}
                                    <div className="flex flex-col items-center -translate-y-4">
                                        <div className="px-3 py-1 bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-lg relative">45<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rotate-45"></div></div>
                                    </div>
                                    <div className="flex flex-col items-center translate-y-6">
                                        <div className="px-3 py-1 bg-amber-500 text-white font-bold text-sm rounded-lg shadow-lg relative">152<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45"></div></div>
                                    </div>
                                    <div className="flex flex-col items-center -translate-y-2">
                                        <div className="px-3 py-1 bg-red-500 text-white font-bold text-sm rounded-lg shadow-lg relative animate-pulse shadow-red-500/50">210<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div></div>
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-2 absolute -bottom-6" />
                                    </div>
                                    <div className="flex flex-col items-center translate-y-2">
                                        <div className="px-3 py-1 bg-yellow-400 text-slate-900 font-bold text-sm rounded-lg shadow-lg relative">85<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rotate-45"></div></div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">Street-Level Precision</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Discover exactly where the pollution is trapped, down to a 100-meter radius in real-time.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
