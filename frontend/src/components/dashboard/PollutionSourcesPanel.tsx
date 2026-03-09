import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Factory, Trees, Flame } from 'lucide-react';
import { getAdminStats } from '@/services/adminService';

const sourceTemplates = [
    {
        name: 'Vehicular Traffic',
        percentage: 42,
        color: 'bg-indigo-500',
        icon: Car,
        description: 'Heavy congestion on main traffic arteries.'
    },
    {
        name: 'Construction Dust',
        percentage: 28,
        color: 'bg-amber-500',
        icon: Factory,
        description: 'Activity detected at development sites.'
    },
    {
        name: 'Industrial Emissions',
        percentage: 18,
        color: 'bg-rose-500',
        icon: Flame,
        description: 'Manufacturing zone output.'
    },
    {
        name: 'Biomass Burning',
        percentage: 12,
        color: 'bg-purple-500',
        icon: Trees,
        description: 'Organic waste disposal activity.'
    }
];

export function PollutionSourcesPanel() {
    const [primarySource, setPrimarySource] = useState('');
    const [dynamicSources, setDynamicSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setPrimarySource(data.primarySource);
                if (data.sources) {
                    setDynamicSources(data.sources);
                }
            } catch (error) {
                console.error('Failed to fetch sources:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="glass-panel p-6 rounded-3xl h-64 animate-pulse bg-slate-800/20" />
    );

    // Merge static branding (icons, colors) with dynamic backend values
    const displaySources = sourceTemplates.map(template => {
        const dbVal = dynamicSources.find(s => s.name === template.name);
        return {
            ...template,
            percentage: dbVal ? dbVal.percentage : template.percentage
        };
    }).sort((a, b) => b.percentage - a.percentage); // display highest percentage first

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-3xl"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 font-display">Source Detection</h2>
                    <p className="text-sm text-slate-400">Real-time national attribution</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    Live Avg
                </div>
            </div>

            <div className="space-y-6">
                {displaySources.map((source, idx) => {
                    const isPrimary = source.name === primarySource;
                    return (
                        <div key={idx} className={`group ${isPrimary ? 'opacity-100' : 'opacity-70'}`}>
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl bg-slate-800 ${source.color.replace('bg-', 'text-')} ${isPrimary ? 'ring-2 ring-indigo-500/50 scale-110' : ''}`}>
                                        <source.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-200">
                                            {source.name} {isPrimary && <span className="text-[10px] text-indigo-400 ml-2 font-bold uppercase tracking-wider">Primary</span>}
                                        </h4>
                                        <p className="text-xs text-slate-500">{source.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${isPrimary ? 'text-indigo-400' : 'text-slate-100'}`}>
                                        {source.percentage}%
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${source.percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.1 * idx }}
                                    className={`h-full ${isPrimary ? 'bg-indigo-500' : source.color} rounded-full relative overflow-hidden`}
                                >
                                    {isPrimary && <div className="absolute inset-0 bg-white/20 w-full animate-pulse-slow"></div>}
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

