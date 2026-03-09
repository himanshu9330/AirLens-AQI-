'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data24h = [
    { time: '12 AM', aqi: 110 }, { time: '4 AM', aqi: 95 },
    { time: '8 AM', aqi: 180 }, { time: '12 PM', aqi: 165 },
    { time: '4 PM', aqi: 140 }, { time: '8 PM', aqi: 120 }
];

const data7d = [
    { time: 'Mon', aqi: 120 }, { time: 'Tue', aqi: 135 },
    { time: 'Wed', aqi: 180 }, { time: 'Thu', aqi: 150 },
    { time: 'Fri', aqi: 210 }, { time: 'Sat', aqi: 90 },
    { time: 'Sun', aqi: 85 }
];

export function TrendCharts() {
    const [view, setView] = useState<'24h' | '7d'>('24h');

    const data = view === '24h' ? data24h : data7d;

    const getBarColor = (aqi: number) => {
        if (aqi <= 50) return '#10b981';
        if (aqi <= 100) return '#f59e0b';
        if (aqi <= 200) return '#f43f5e';
        return '#9f1239'; // severe
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col min-h-[350px]"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 font-display">Pollution Trends</h2>
                    <p className="text-sm text-slate-400">Historical AQI tracking</p>
                </div>
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setView('24h')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${view === '24h' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        24H
                    </button>
                    <button
                        onClick={() => setView('7d')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${view === '7d' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        7D
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                        />
                        <Bar dataKey="aqi" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.aqi)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
