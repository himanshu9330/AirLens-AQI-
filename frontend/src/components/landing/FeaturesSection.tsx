'use client';

import { motion } from 'framer-motion';
import { Map, Zap, Cpu, BellRing, Database, LineChart } from 'lucide-react';

const features = [
    {
        title: 'AirLens Quality Map',
        description: 'Track air quality down to a 100-meter radius. See exactly what you are breathing on your street.',
        icon: Map,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        title: 'AI Source Detection',
        description: 'Machine learning instantly identifies primary pollution culprits like traffic congestion or industrial emissions.',
        icon: Cpu,
        color: 'from-indigo-500 to-purple-500',
    },
    {
        title: '48hr Prediction Engine',
        description: 'Deep learning LSTM models forecast dangerous AQI spikes days before they happen with 92% accuracy.',
        icon: LineChart,
        color: 'from-amber-500 to-orange-500',
    },
    {
        title: 'Instant Hazard Alerts',
        description: 'Trigger automated SMS or push notifications the second hazardous levels enter your saved vicinity.',
        icon: BellRing,
        color: 'from-rose-500 to-red-500',
    },
    {
        title: 'Policy Recommendations',
        description: 'AI-generated intervention strategies for city planners to mitigate local pollution hotspots.',
        icon: Database,
        color: 'from-emerald-500 to-teal-500',
    },
    {
        title: 'Citizen Health Advisory',
        description: 'Personalized ML-driven health advice detailing exactly when it\'s safe to exercise or go outside.',
        icon: Zap,
        color: 'from-fuchsia-500 to-pink-500',
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-32 relative bg-[#020617]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-display text-white mb-6"
                    >
                        Beyond Basic Weather Apps.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400"
                    >
                        We deploy multiple layers of intelligence to provide precise, granular, and actionable environmental data.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-opacity duration-500`}></div>

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg shadow-indigo-500/20`}
                            >
                                <feature.icon className="w-6 h-6 text-white" />
                            </motion.div>

                            <h3 className="text-xl font-bold text-slate-50 mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
