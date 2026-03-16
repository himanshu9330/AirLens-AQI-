'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Navigation, Activity } from 'lucide-react';
import { getDetailedPredictions } from '@/services/adminService';

// Interfaces for our nested data structure
interface AreaData {
    area: string;
    currentAqi: number;
    predictionData: { time: string; predicted: number }[];
}

interface CityData {
    city: string;
    areas: AreaData[];
}

interface StateData {
    state: string;
    cities: CityData[];
}

export function HierarchicalPredictionChart() {
    const [data, setData] = useState<StateData[]>([]);
    const [loading, setLoading] = useState(true);

    // Selections
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const hierarchicalData = await getDetailedPredictions();
                setData(hierarchicalData);

                // Auto-select first available hierarchy if nothing selected
                if (hierarchicalData.length > 0 && !selectedState) {
                    const firstState = hierarchicalData[0];
                    setSelectedState(firstState.state);
                    if (firstState.cities.length > 0) {
                        const firstCity = firstState.cities[0];
                        setSelectedCity(firstCity.city);
                        if (firstCity.areas.length > 0) {
                            setSelectedArea(firstCity.areas[0].area);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hierarchical predictions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
        const interval = setInterval(fetchPredictions, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [selectedState]);

    // Handle cascading resets
    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateName = e.target.value;
        setSelectedState(stateName);
        const stateObj = data.find(s => s.state === stateName);
        if (stateObj && stateObj.cities.length > 0) {
            setSelectedCity(stateObj.cities[0].city);
            if (stateObj.cities[0].areas.length > 0) {
                setSelectedArea(stateObj.cities[0].areas[0].area);
            } else {
                setSelectedArea('');
            }
        } else {
            setSelectedCity('');
            setSelectedArea('');
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityName = e.target.value;
        setSelectedCity(cityName);
        const stateObj = data.find(s => s.state === selectedState);
        const cityObj = stateObj?.cities.find(c => c.city === cityName);
        if (cityObj && cityObj.areas.length > 0) {
            setSelectedArea(cityObj.areas[0].area);
        } else {
            setSelectedArea('');
        }
    };

    // Derived active data based on selections
    const activeStateObj = useMemo(() => data.find(s => s.state === selectedState), [data, selectedState]);
    const activeCityObj = useMemo(() => activeStateObj?.cities.find(c => c.city === selectedCity), [activeStateObj, selectedCity]);
    const activeAreaObj = useMemo(() => activeCityObj?.areas.find(a => a.area === selectedArea), [activeCityObj, selectedArea]);

    if (loading && data.length === 0) {
        return <div className="glass-panel p-6 rounded-3xl h-[500px] animate-pulse bg-slate-800/20" />;
    }

    // Determine category and color based on current AQI of the selected area
    const currentAqi = activeAreaObj?.currentAqi || 0;
    let aqiCategory = 'Good';
    let aqiColorClass = 'text-emerald-400';
    let gradientStart = '#10b981'; // emerald
    let gradientEnd = 'rgba(16, 185, 129, 0)';

    if (currentAqi > 200) {
        aqiCategory = 'Severe';
        aqiColorClass = 'text-rose-500';
        gradientStart = '#f43f5e';
    } else if (currentAqi > 150) {
        aqiCategory = 'Poor';
        aqiColorClass = 'text-amber-500';
        gradientStart = '#f59e0b';
    } else if (currentAqi > 100) {
        aqiCategory = 'Moderate';
        aqiColorClass = 'text-yellow-400';
        gradientStart = '#facc15';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl overflow-hidden shadow-2xl"
        >
            {/* Control Header */}
            <div className="bg-slate-900/50 p-6 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2 mb-1">
                        <MapPin className="text-indigo-400 w-5 h-5" /> Local Intelligence Drilldown
                    </h2>
                    <p className="text-sm text-slate-400">Select specific granular areas to view current stats and ML forecasts.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <select 
                        value={selectedState} 
                        onChange={handleStateChange}
                        className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 transition-colors cursor-pointer text-sm font-medium min-w-[140px]"
                    >
                        <option value="" disabled>Select State...</option>
                        {data.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                    </select>

                    <select 
                        value={selectedCity} 
                        onChange={handleCityChange}
                        disabled={!selectedState}
                        className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 transition-colors cursor-pointer text-sm font-medium min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="" disabled>Select City...</option>
                        {activeStateObj?.cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                    </select>

                    <select 
                        value={selectedArea} 
                        onChange={(e) => setSelectedArea(e.target.value)}
                        disabled={!selectedCity}
                        className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 transition-colors cursor-pointer text-sm font-medium min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="" disabled>Select Area...</option>
                        {activeCityObj?.areas.map(a => <option key={a.area} value={a.area}>{a.area}</option>)}
                    </select>
                </div>
            </div>

            {/* Content Area - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 p-6 gap-6">
                
                {/* Left Side: Current AQI Block */}
                <div className="col-span-1 flex flex-col items-center justify-center p-8 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                    <div className="bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 mb-6">
                        <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                            {selectedArea || 'Location'}
                        </span>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={selectedArea}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">Current AQI</span>
                            <div className="relative">
                                <span className={`text-6xl md:text-7xl font-black font-display tracking-tighter ${aqiColorClass} drop-shadow-lg`}>
                                    {currentAqi}
                                </span>
                                {/* Live Pulse Indicator */}
                                <span className="absolute -top-1 -right-4 flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current ${aqiColorClass}`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 bg-current ${aqiColorClass}`}></span>
                                </span>
                            </div>
                            <span className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold border underline-offset-4 decoration-2 ${aqiColorClass} border-current bg-opacity-10`} style={{ backgroundColor: `${gradientStart}15` }}>
                                {aqiCategory}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Prediction Chart */}
                <div className="col-span-1 lg:col-span-3 min-h-[350px]">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                            <Activity className="w-4 h-4 text-indigo-400" /> 6-Hour Forecast Trend
                        </h3>
                    </div>

                    {activeAreaObj?.predictionData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeAreaObj.predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPredictedHierarchical" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={gradientStart} stopOpacity={0.6} />
                                        <stop offset="95%" stopColor={gradientStart} stopOpacity={0} />
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
                                    itemStyle={{ color: gradientStart, fontWeight: 'bold' }}
                                    labelStyle={{ color: '#cbd5e1', marginBottom: '8px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="predicted" 
                                    stroke={gradientStart} 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorPredictedHierarchical)" 
                                    activeDot={{ r: 6, fill: gradientStart, stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-slate-500 font-medium">Select a location to view predictions.</p>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
}
