'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAdminChartData } from '@/services/adminService';

export function ModelAccuracyChart() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAdminChartData();
                // For "Accuracy" view, we only show points that have BOTH actual and predicted
                // or where we want to highlight the transition.
                // For now, let's just show the full set from the dashboard chart.
                setChartData(data);
            } catch (error) {
                console.error('Failed to fetch chart data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-3xl h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold font-display text-slate-100 mb-1">Model Accuracy & Drift</h2>
                    <p className="text-sm text-slate-400">Predicted AI horizons vs. Actual recorded sensor data (24h)</p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        <span className="text-slate-300">Predicted (AI)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-slate-300">Actual (Sensor)</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] mt-4">
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="time" 
                                stroke="#475569" 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#475569" 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                                domain={['auto', 'auto']}
                            />
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="predicted" 
                                stroke="#6366f1" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorPredicted)" 
                                activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                connectNulls
                            />
                            <Area 
                                type="monotone" 
                                dataKey="actual" 
                                stroke="#10b981" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorActual)" 
                                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                connectNulls
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
