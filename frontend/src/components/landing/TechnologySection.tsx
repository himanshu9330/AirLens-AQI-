'use client';

import { motion } from 'framer-motion';
import { Cpu, Satellite, Layers, Code2 } from 'lucide-react';

const technologies = [
    {
        title: "Deep Learning Inferencing",
        icon: Cpu,
        description: "TensorFlow models processing historical trends and weather data to forecast AQI drops up to 48 hours out.",
    },
    {
        title: "Satellite Imagery Integration",
        icon: Satellite,
        description: "Incorporating NASA and ESA satellite feeds to detect macro-level smoke plumes and fire origins.",
    },
    {
        title: "GIS Spatial Analysis",
        icon: Layers,
        description: "PostGIS architectures slicing city grids into manageable, hyper-local coordinate zones for accurate mapping.",
    },
    {
        title: "High-Speed Data Pipelines",
        icon: Code2,
        description: "Node.js and Redis managing thousands of WebSocket connections to push updates to the dashboard instantly.",
    }
];

export function TechnologySection() {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-display text-white">
                            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Advanced AI.</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Under the hood, HyperLocal is a massive data ingestion and machine learning engine. We don't just display data; we compute it, clean it, and predict it.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {['Python', 'TensorFlow', 'PostGIS', 'Redis', 'Next.js', 'WebSockets', 'AWS'].map((tech, i) => (
                                <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium shadow-inner"
                                >
                                    {tech}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex-1 w-full grid sm:grid-cols-2 gap-6">
                        {technologies.map((tech, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                                <tech.icon className="w-8 h-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-slate-200 mb-2">{tech.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {tech.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
