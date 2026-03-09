'use client';

import { motion } from 'framer-motion';
import { Database, Network, BrainCircuit, LayoutDashboard } from 'lucide-react';

const steps = [
    {
        icon: Database,
        title: "1. Data Acquisition",
        desc: "Ingesting live IoT sensor data, satellite imagery, and meteorological APIs."
    },
    {
        icon: Network,
        title: "2. Spatial Processing",
        desc: "Mapping coordinate data to precise ward-level boundaries using GeoJSON."
    },
    {
        icon: BrainCircuit,
        title: "3. ML Inference",
        desc: "LSTM networks predict future trends while classification models detect sources."
    },
    {
        icon: LayoutDashboard,
        title: "4. Visualization",
        desc: "Streaming enriched data via WebSockets to our SaaS dashboard."
    }
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-slate-900 mx-auto max-w-[90%] rounded-[3rem] border border-slate-800/50"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 py-20 text-center">
                <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-16">How Intelligence Flows</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-800">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] relative"
                        >
                            <motion.div
                                animate={{
                                    left: ['0%', '100%'],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute top-1/2 -translate-y-1/2 w-12 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent"
                            />
                        </motion.div>
                    </div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative z-10 flex flex-col items-center group"
                        >
                            <motion.div
                                whileHover={{ y: -5, scale: 1.05 }}
                                className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-6 relative group cursor-default"
                            >
                                <div className="absolute inset-0 rounded-full border border-indigo-500/30 group-hover:border-indigo-500 transition-colors shadow-indigo-500/0 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
                                <step.icon className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">{step.title}</h3>
                            <p className="text-sm text-slate-400 px-4 group-hover:text-slate-300 transition-colors">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
