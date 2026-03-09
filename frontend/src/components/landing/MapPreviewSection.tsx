'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';

export function MapPreviewSection() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden border-t border-slate-900">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Live Preview
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-display text-white mb-6"
                    >
                        Experience the platform.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400"
                    >
                        Detailed spatial mapping combined with forecasting models to help you make informed decisions, instantly.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden glass-panel border border-slate-700 shadow-2xl shadow-indigo-500/20 aspect-[16/9] group"
                >
                    {/* Fake Map UI Background */}
                    <div className="absolute inset-0 bg-[#0f172a] opacity-90 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                    {/* Top Bar of Fake UI */}
                    <div className="absolute top-0 w-full h-12 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md flex items-center px-4 gap-2 z-20">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                        </div>
                        <div className="mx-auto w-64 h-6 bg-slate-800/50 rounded-md border border-slate-700/50 flex items-center justify-center">
                            <span className="text-[10px] text-slate-500 font-medium">hyperlocal.ai / dashboard / map</span>
                        </div>
                    </div>

                    {/* Left Sidebar of Fake UI */}
                    <div className="absolute top-12 left-0 w-48 bottom-0 bg-slate-900/60 border-r border-slate-800 backdrop-blur-md p-4 hidden md:flex flex-col gap-4 z-20">
                        <div className="w-full h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-lg"></div>
                        <div className="w-full h-8 bg-slate-800/50 rounded-lg"></div>
                        <div className="w-full h-8 bg-slate-800/50 rounded-lg"></div>
                        <div className="mt-auto">
                            <div className="text-xs text-slate-500 mb-2">Legend</div>
                            <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"></div>
                        </div>
                    </div>

                    {/* Animated Heat Zones */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-1/4 right-1/3 w-64 h-64 bg-amber-500/20 blur-[50px] rounded-full z-10"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/20 blur-[60px] rounded-full z-10"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className="absolute top-1/2 left-1/3 w-72 h-72 bg-emerald-500/20 blur-[50px] rounded-full z-10"
                    />

                    {/* Animated Data Points */}
                    <div className="absolute inset-0 z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute top-[35%] right-[28%] w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_20px_#f59e0b] border-2 border-[#0f172a]"
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.2, type: "spring" }}
                            className="absolute bottom-[30%] right-[32%] w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_20px_#f43f5e] border-2 border-[#0f172a] animate-pulse"
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.0, type: "spring" }}
                            className="absolute top-[45%] left-[45%] w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] border-2 border-[#0f172a]"
                        />
                    </div>

                    {/* Overlay CTA */}
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-xl shadow-indigo-500/30 flex items-center gap-3 transition-transform hover:scale-105"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Open Dashboard
                        </Link>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
