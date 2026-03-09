'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const stats = [
    { value: 120, prefix: '', suffix: '+', label: 'Micro-Environments Monitored', color: 'text-indigo-400' },
    { value: 5.2, prefix: '', suffix: 'M', label: 'Daily Data Points Processed', color: 'text-emerald-400' },
    { value: 92, prefix: '', suffix: '%', label: 'Prediction Accuracy', color: 'text-amber-400' },
    { value: 15, prefix: '<', suffix: 'k', label: 'Alerts Delivered', color: 'text-rose-400' },
];

function CountUp({ value, direction = "up" }: { value: number, direction?: "up" | "down" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 2,
                ease: "easeOut",
                onUpdate(value) {
                    setCount(Math.floor(value));
                },
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    return <span ref={ref}>{count}</span>;
}

export function TechImpactSection() {
    return (
        <section id="impact" className="py-24 bg-[#020617] border-t border-slate-800/50 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
                            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Scale & Accuracy</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            HyperLocal leverages a microservices architecture bridging Python-based ML inferencing layers with a high-performance Next.js Edge frontend.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-4">
                            {['Next.js 16', 'React 19', 'Tailwind v4', 'Framer Motion', 'Node.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'].map((tech, idx) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -3, backgroundColor: '#1e293b', borderColor: '#6366f1' }}
                                    className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors cursor-default"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center group"
                            >
                                <span className={`text-4xl md:text-5xl font-bold font-display mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.prefix}<CountUp value={stat.value} />{stat.suffix}
                                </span>
                                <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
