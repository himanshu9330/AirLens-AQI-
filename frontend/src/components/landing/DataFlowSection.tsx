'use client';

import { motion } from 'framer-motion';
import { Database, Network, BrainCircuit, Activity, LayoutDashboard, BellRing } from 'lucide-react';

const pipelineSteps = [
    { icon: Database, label: "IoT Sensors & APIs", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { icon: Network, label: "Spatial Processing", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    { icon: BrainCircuit, label: "ML Inference", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { icon: Activity, label: "Prediction Engine", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30" },
    { icon: LayoutDashboard, label: "Live Dashboard", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { icon: BellRing, label: "Instant Alerts", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
];

export function DataFlowSection() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-display text-white mb-6"
                    >
                        How Intelligence Flows.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400"
                    >
                        A continuous, real-time pipeline processing millions of data points every hour to keep you informed.
                    </motion.p>
                </div>

                <div className="relative py-12">
                    {/* The glowing track */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full hidden md:block">
                        {/* Animated flowing data packets */}
                        <motion.div
                            animate={{
                                left: ['0%', '100%'],
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-32 h-[3px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_#6366f1]"
                        />
                        <motion.div
                            animate={{
                                left: ['0%', '100%'],
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1.5
                            }}
                            className="absolute top-1/2 -translate-y-1/2 w-32 h-[3px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_15px_#d946ef]"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-4 relative z-10">
                        {pipelineSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.15 }}
                                className="flex flex-col items-center group relative cursor-default"
                            >
                                {/* Connector dots for mobile (since line is hidden) */}
                                {idx !== pipelineSteps.length - 1 && (
                                    <div className="md:hidden absolute -right-3 top-10 w-6 h-0.5 bg-slate-800"></div>
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className={`w-20 h-20 rounded-2xl glass-panel ${step.bg} border ${step.border} flex items-center justify-center mb-4 transition-colors relative z-10`}
                                >
                                    <div className={`absolute inset-0 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100 blur-md bg-gradient-to-br ${step.color.replace('text-', 'from-').replace('-400', '-500')} to-transparent`}></div>
                                    <step.icon className={`w-8 h-8 ${step.color} relative z-10`} />
                                </motion.div>
                                <span className="text-slate-300 font-medium text-sm text-center max-w-[100px] group-hover:text-white transition-colors">
                                    {step.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}
