'use client';

import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { subject: 'PM2.5', A: 120, fullMark: 250 },
    { subject: 'PM10', A: 98, fullMark: 250 },
    { subject: 'NO2', A: 86, fullMark: 250 },
    { subject: 'SO2', A: 45, fullMark: 250 },
    { subject: 'O3', A: 65, fullMark: 250 },
    { subject: 'CO', A: 25, fullMark: 250 },
];

export function AQIRadarChart() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-full flex flex-col items-center justify-center min-h-[300px]"
        >
            <div className="w-full text-center mb-2">
                <h3 className="text-lg font-bold font-display text-slate-100">Pollutant Distribution</h3>
                <p className="text-xs text-slate-400">National average breakdown</p>
            </div>
            
            <div className="w-full flex-1 relative min-h-[250px]">
                {/* Glowing backdrop pulse */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl animate-pulse-slow"></div>
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 250]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                        />
                        <Radar name="Concentration" dataKey="A" stroke="#818cf8" strokeWidth={2} fill="#6366f1" fillOpacity={0.4} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
