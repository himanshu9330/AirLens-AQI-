'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Cloud } from 'lucide-react';
import Link from 'next/link';
import { LandingNavbar } from './LandingNavbar';

export function HeroSection() {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#020617] font-sans">
            <LandingNavbar />

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[150px] animate-float"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                {/* Animated Particles Grid Background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

                {/* Floating Data Nodes */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[30%] left-[15%] w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[40%] right-[20%] w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"
                />
                <motion.div
                    animate={{ y: [0, -15, 0], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"
                />
            </div>

            <main className="flex-1 flex items-center justify-center relative z-10 px-6 pt-20">
                <div className="max-w-5xl mx-auto text-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Live AI Pollution Intelligence
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 leading-[1.1]"
                    >
                        AirLens Air <br className="hidden md:block" /> Quality Intelligence
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Transform real-time environmental data into <span className="text-slate-200 font-semibold">actionable insights</span> for smarter and healthier cities.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/citizen/login"
                            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/25 overflow-hidden transition-all flex items-center gap-2"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-8 w-1/3"></div>
                            Join as Citizen
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="#problem"
                            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-2xl font-semibold transition-all flex items-center gap-2 backdrop-blur-sm group"
                        >
                            <Activity className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                            Learn How It Works
                        </Link>
                    </motion.div>

                </div>
            </main>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Scroll</span>
                <div className="w-6 h-10 border-2 border-slate-700 rounded-full p-1 flex justify-center">
                    <motion.div
                        animate={{
                            y: [0, 12, 0],
                            opacity: [1, 0.4, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                    />
                </div>
            </motion.div>

            {/* Decorative Bottom Map Fade */}
            <div className="h-48 w-full bg-gradient-to-t from-[#020617] to-transparent absolute bottom-0 z-20 pointer-events-none"></div>
        </div>
    );
}
