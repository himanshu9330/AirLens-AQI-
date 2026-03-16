import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminChartData } from '@/services/adminService';

export function PredictionChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const chartData = await getAdminChartData();
                setData(chartData);
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();

        // Auto-refresh every 30 seconds to make it feel 'live'
        const interval = setInterval(fetchChartData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="glass-panel p-6 rounded-3xl h-full animate-pulse bg-slate-800/20" />
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-3xl h-full flex flex-col"
        >
            <div className="flex items-start justify-between mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg flex-shrink-0 font-bold text-slate-100 font-display">6-Hour National Forecast</h2>
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                    </div>
                    <p className="text-sm flex-shrink-0 text-slate-400">Aggregated prediction vs actual</p>
                </div>
                <div className="flex flex-col gap-2 text-xs font-medium items-end">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-slate-300">Actual Avg</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-400 border-dashed"></span>
                        <span className="text-slate-300">Predicted</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                            itemStyle={{ color: '#cbd5e1' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            connectNulls={true}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            animationDuration={1500}
                            isAnimationActive={true}
                        />
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="#6366f1"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            connectNulls={true}
                            fillOpacity={1}
                            fill="url(#colorPredicted)"
                            animationDuration={2000}
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

