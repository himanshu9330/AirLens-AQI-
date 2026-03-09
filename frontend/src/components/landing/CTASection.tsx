'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
    return (
        <section className="py-32 bg-[#020617] relative overflow-hidden">
            {/* Massive background gradient sweep */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(-45deg, #6366f1, #ec4899, #8b5cf6, #10b981)',
                        backgroundSize: '400% 400%'
                    }}
                />
                <div className="absolute inset-0 bg-[#020617] opacity-80 backdrop-blur-[100px]"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-12 md:p-20 rounded-[3rem] border border-white/10 shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]"></div>

                    <h2 className="text-4xl md:text-6xl font-black font-display text-white mb-6 leading-tight relative z-10">
                        Build Smarter Cities with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse-slow">Environmental Intelligence</span>
                    </h2>

                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
                        Join the future of urban infrastructure. Deploy AirLens monitoring and protect your communities today.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <Link
                            href="/dashboard"
                            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/30 overflow-hidden transition-all hover:scale-105"
                        >
                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                            <span className="relative flex items-center gap-2">
                                Explore the Platform
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
