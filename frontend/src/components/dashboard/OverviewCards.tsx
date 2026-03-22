import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Wind, MapPin, Cloudy, TrendingUp, ArrowUpRight, ArrowDownRight, Map } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { getAdminStats } from '@/services/adminService';

const dummyData1 = [{ v: 40 }, { v: 60 }, { v: 50 }, { v: 80 }, { v: 120 }, { v: 110 }, { v: 154 }];
const dummyData2 = [{ v: 100 }, { v: 90 }, { v: 85 }, { v: 110 }, { v: 95 }, { v: 80 }, { v: 75 }];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function OverviewCards() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const metrics = [
        {
            title: 'National Average AQI',
            value: stats?.nationalAqi || '0',
            unit: 'PM2.5 Avg',
            status: stats?.nationalAqi <= 50 ? 'Good' : stats?.nationalAqi <= 100 ? 'Moderate' : 'Poor',
            trend: stats?.prediction24h === 'Improving' ? '-8%' : '+12%',
            trendUp: stats?.prediction24h !== 'Improving',
            icon: Wind,
            color: 'from-amber-500 to-orange-600',
            data: dummyData1,
            chartColor: '#f59e0b',
        },
        {
            title: 'Total Red Zones',
            value: stats?.redZones || '0',
            unit: 'Cities > 150 AQI',
            status: 'Critical Areas',
            trend: 'Live Detection',
            trendUp: true,
            icon: MapPin,
            color: 'from-rose-500 to-red-600',
            data: dummyData2,
            chartColor: '#f43f5e',
        },
        {
            title: 'National Primary Source',
            value: stats?.primarySource || 'Detection...',
            unit: 'Attribution Model',
            status: 'Real-time',
            trend: 'Consistent',
            trendUp: false,
            icon: Cloudy,
            color: 'from-indigo-500 to-blue-600',
            data: dummyData1,
            chartColor: '#6366f1',
        },
        {
            title: 'National 24h Prediction',
            value: stats?.prediction24h || 'Stable',
            unit: `Expected AQI ${stats?.expectedAqi || 0}`,
            status: 'AI Forecast',
            trend: stats?.prediction24h === 'Improving' ? '-15%' : '+10%',
            trendUp: stats?.prediction24h !== 'Improving',
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-600',
            data: dummyData2,
            chartColor: '#10b981',
        }
    ];

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-panel h-48 rounded-2xl animate-pulse" />
            ))}
        </div>
    );

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
        >
            {metrics.map((metric, i) => (
                <motion.div
                    key={i}
                    variants={item}
                    whileHover={{ y: -5, scale: 1.01 }}
                    onClick={i === 0 ? () => router.push('/admin/dashboard/aqi-map') : undefined}
                    className={`glass-card rounded-2xl p-5 relative overflow-hidden group ${i === 0 ? 'cursor-pointer ring-1 ring-transparent hover:ring-indigo-500/40 transition-all duration-300' : 'cursor-default'}`}
                >
                    <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-slate-400 text-sm font-medium truncate">{metric.title}</p>
                                {metric.title.includes('Source') && (
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                                    </span>
                                )}
                                {i === 0 && (
                                    <span className="ml-auto flex items-center gap-1 text-[9px] text-indigo-400 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-2.5 h-2.5" /> View Details →
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <motion.h3 
                                    key={metric.value}
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: 1 }}
                                    className="text-2xl xl:text-3xl font-bold font-display text-slate-50 truncate"
                                >
                                    {metric.value}
                                </motion.h3>
                            </div>
                            <p className="text-slate-300 text-xs mt-1 font-medium truncate">{metric.unit}</p>
                        </div>

                        <div className={`p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                            <metric.icon className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="h-12 w-full mt-2 -mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metric.data}>
                                <defs>
                                    <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={metric.chartColor} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={metric.chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke={metric.chartColor}
                                    strokeWidth={2}
                                    fill={`url(#gradient-${i})`}
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            {metric.trendUp ? (
                                <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            <span className={`text-xs font-medium ${metric.trendUp ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {metric.trend}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            <span className="text-xs text-slate-400">{metric.status}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

