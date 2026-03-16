import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { dispatchStateAlert } from '@/services/adminService';

const data = [
    { name: 'Maharashtra', aqi: 185, events: 12 },
    { name: 'Delhi', aqi: 245, events: 28 },
    { name: 'Gujarat', aqi: 165, events: 8 },
    { name: 'Punjab', aqi: 210, events: 19 },
    { name: 'Haryana', aqi: 195, events: 15 },
].sort((a, b) => b.aqi - a.aqi);

const COLORS = ['#f43f5e', '#f59e0b', '#eab308', '#10b981', '#3b82f6'];

export function RegionalComparisonChart() {
    const [dispatching, setDispatching] = useState<string | null>(null);

    const handleBroadcast = async (stateName: string, aqi: number) => {
        setDispatching(stateName);
        const toastId = toast.loading(`Broadcasting emergency protocol to ${stateName}...`);
        try {
            await dispatchStateAlert(stateName, aqi);
            toast.success(`Active emergency guidance broadcasted to ${stateName} citizens.`, { id: toastId, duration: 4000 });
        } catch (error) {
            console.error('Broadcast failed', error);
            toast.error(`Broadcast system failure for ${stateName}.`, { id: toastId });
        } finally {
            setDispatching(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-3xl w-full"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold font-display text-slate-100 mb-1">State Comparative Analysis</h2>
                    <p className="text-sm text-slate-400">Top 5 most affected regions and emergency dispatch controls</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            barSize={20}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#475569" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" stroke="#cbd5e1" tick={{ fill: '#f8fafc', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                            />
                            <Bar dataKey="aqi" name="Avg AQI" radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" /> Quick Dispatch
                    </h3>
                    <div className="flex flex-col gap-3 h-[270px] justify-between">
                        {data.map((state) => {
                            const isDispatching = dispatching === state.name;
                            return (
                                <div key={state.name} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                    <span className="text-slate-200 font-semibold text-sm">{state.name}</span>
                                    <button 
                                        onClick={() => handleBroadcast(state.name, state.aqi)}
                                        disabled={isDispatching || dispatching !== null}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            isDispatching 
                                                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(243,63,94,0.4)]' 
                                                : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20'
                                        }`}
                                    >
                                        {isDispatching ? (
                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <Send className="w-3 h-3" />
                                        )}
                                        {isDispatching ? 'Broadcasting...' : 'Broadcast Siren'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
