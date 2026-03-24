import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getAdminChartData } from '@/services/adminService';

// Inline simple SVG Icons
const TrendingUpIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
const TrendingDownIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
);
const MinusIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

// Custom Tooltip function
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Is this a future point?
        const isFuture = payload[0].payload.isFuture;
        const actualVal = payload[0].payload.actual;
        const predictedVal = payload[0].payload.predicted;
        
        return (
            <div className={`p-4 rounded-xl border backdrop-blur-md shadow-2xl ${isFuture ? 'bg-indigo-950/80 border-indigo-500/30' : 'bg-slate-900/80 border-slate-700'}`}>
                <p className="text-slate-300 font-medium mb-2">{label} {isFuture ? '(Forecast)' : '(Recorded)'}</p>
                {actualVal !== null && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-slate-100 font-bold">Actual: {actualVal} AQI</span>
                    </div>
                )}
                {predictedVal !== null && (
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                        <span className="text-slate-100 font-bold">Predicted: {predictedVal} AQI</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function PredictionChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Derived UI Insights
    const [currentAqi, setCurrentAqi] = useState<number | null>(null);
    const [peakAqi, setPeakAqi] = useState<number | null>(null);
    const [trend, setTrend] = useState<'improving' | 'worsening' | 'stable'>('stable');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const chartData = await getAdminChartData();
                setData(chartData);
                
                // Calculate Data Insights
                if (chartData && chartData.length > 0) {
                    const actuals = chartData.filter((d: any) => !d.isFuture && d.actual !== null);
                    const current = actuals.length > 0 ? actuals[actuals.length - 1].actual : null;
                    setCurrentAqi(current);

                    const futures = chartData.filter((d: any) => d.isFuture && d.predicted !== null);
                    if (futures.length > 0) {
                        const peak = Math.max(...futures.map((d: any) => d.predicted));
                        setPeakAqi(peak);
                        
                        const endForecast = futures[futures.length - 1].predicted;
                        if (current) {
                            if (endForecast > current + 5) setTrend('worsening');
                            else if (endForecast < current - 5) setTrend('improving');
                            else setTrend('stable');
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();

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
            className="glass-panel p-6 rounded-3xl h-full flex flex-col relative overflow-hidden"
        >
            {/* Background glow effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 z-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl flex-shrink-0 font-bold text-slate-100 font-display">6-Hour National Forecast</h2>
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                    </div>
                    <p className="text-sm flex-shrink-0 text-slate-400">LSTM-powered AI prediction vs real-time sensors</p>
                </div>
                
                {/* Metric Cards */}
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-700/50 shadow-inner">
                        <p className="text-xs text-slate-400 mb-1">Current Avg</p>
                        <p className="text-lg font-bold text-rose-400">{currentAqi || '--'}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-700/50 shadow-inner">
                        <p className="text-xs text-slate-400 mb-1">Expected Peak</p>
                        <p className={`text-lg font-bold ${peakAqi && peakAqi > 150 ? 'text-orange-400' : 'text-indigo-400'}`}>{peakAqi || '--'}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-700/50 shadow-inner flex flex-col items-center justify-center min-w-[80px]">
                        <p className="text-xs text-slate-400 mb-1">Trend</p>
                        <div className={`flex items-center gap-1 font-bold ${trend === 'worsening' ? 'text-red-400' : trend === 'improving' ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {trend === 'worsening' ? <TrendingUpIcon /> : trend === 'improving' ? <TrendingDownIcon /> : <MinusIcon />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px] mt-2 z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                            dy={10}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        
                        {/* Threshold Reference Lines */}
                        <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'insideTopLeft', value: 'Moderate', fill: '#f59e0b', fontSize: 10, opacity: 0.7 }} />
                        <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'insideTopLeft', value: 'Unhealthy', fill: '#ef4444', fontSize: 10, opacity: 0.7 }} />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            connectNulls={true}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            animationDuration={1500}
                            activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
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
                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2, className: 'shadow-[0_0_10px_rgba(99,102,241,0.8)]' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
             <div className="flex justify-center gap-6 text-xs font-medium mt-4 z-10">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-slate-300">Recorded Actuals</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-400 border-dashed"></span>
                    <span className="text-slate-300">AI Horizon Forecast</span>
                </div>
            </div>
        </motion.div>
    );
}

