'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNationalHotspots } from '@/services/adminService';
import {
    ChevronRight, Search, ArrowLeft, MapPin, Wind, Factory, Brain,
    ShieldAlert, Zap, Radio, Layers, TrendingUp, AlertTriangle
} from 'lucide-react';

const getAQIColor = (aqi: number) => {
    if (aqi > 250) return { bg: 'from-rose-600/20 to-rose-900/10', text: 'text-rose-400', border: 'border-rose-500/30', badge: 'bg-rose-500/20 text-rose-400' };
    if (aqi > 200) return { bg: 'from-red-600/20 to-red-900/10', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400' };
    if (aqi > 150) return { bg: 'from-orange-600/20 to-orange-900/10', text: 'text-orange-400', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-400' };
    if (aqi > 100) return { bg: 'from-amber-600/20 to-amber-900/10', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400' };
    if (aqi > 50) return { bg: 'from-yellow-600/20 to-yellow-900/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-400' };
    return { bg: 'from-emerald-600/20 to-emerald-900/10', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400' };
};

const getSourceIcon = (source: string) => {
    if (source?.includes('Vehicular')) return <Wind className="w-3.5 h-3.5" />;
    if (source?.includes('Industrial')) return <Factory className="w-3.5 h-3.5" />;
    if (source?.includes('Construction')) return <Layers className="w-3.5 h-3.5" />;
    if (source?.includes('Biomass')) return <Zap className="w-3.5 h-3.5" />;
    return <Radio className="w-3.5 h-3.5" />;
};

interface Hotspot {
    id: string;
    name: string;
    aqi: number;
    status: string;
    source: string;
    reason: string;
    action: string;
    pm2_5?: number;
    no2?: number;
    co2?: number;
    windSpeed?: number;
    hasStation?: boolean;
    lat: number;
    lng: number;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.03, type: 'spring', stiffness: 300, damping: 28 }
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

export default function AQIDrillDown() {
    const [viewMode, setViewMode] = useState<'state' | 'city' | 'area'>('state');
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getNationalHotspots(
                    viewMode,
                    selectedState || undefined,
                    selectedCity || undefined
                );
                // Sort by AQI descending (worst first)
                const sorted = (data || []).sort((a: Hotspot, b: Hotspot) => b.aqi - a.aqi);
                setHotspots(sorted);
                setError(null);
            } catch (err: any) {
                console.error('Drill-down fetch error:', err);
                setError('Failed to load AQI data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [viewMode, selectedState, selectedCity]);

    const handleCardClick = (spot: Hotspot) => {
        if (viewMode === 'state') {
            setSelectedState(spot.name);
            setViewMode('city');
            setSearchQuery('');
        } else if (viewMode === 'city') {
            setSelectedCity(spot.name);
            setViewMode('area');
            setSearchQuery('');
        }
    };

    const goBack = () => {
        if (viewMode === 'area') {
            setViewMode('city');
            setSelectedCity(null);
            setSearchQuery('');
        } else if (viewMode === 'city') {
            setViewMode('state');
            setSelectedState(null);
            setSearchQuery('');
        }
    };

    const filtered = hotspots.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const levelLabel = viewMode === 'state' ? 'States' : viewMode === 'city' ? 'Cities' : 'Areas';

    return (
        <div className="flex flex-col gap-5">
            {/* ── Breadcrumb & Search ─────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {viewMode !== 'state' && (
                        <button
                            onClick={goBack}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors mr-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button
                        onClick={() => { setViewMode('state'); setSelectedState(null); setSelectedCity(null); setSearchQuery(''); }}
                        className={`text-sm font-bold ${viewMode === 'state' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300 cursor-pointer'} transition-colors`}
                    >
                        National
                    </button>
                    {selectedState && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                            <button
                                onClick={() => { setViewMode('city'); setSelectedCity(null); setSearchQuery(''); }}
                                className={`text-sm font-bold ${viewMode === 'city' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300 cursor-pointer'} transition-colors`}
                            >
                                {selectedState}
                            </button>
                        </>
                    )}
                    {selectedCity && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                            <span className="text-sm font-bold text-indigo-400">{selectedCity}</span>
                        </>
                    )}
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder={`Search ${levelLabel.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                </div>
            </div>

            {/* ── Summary Bar ─────────────────────────────────────── */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-semibold text-slate-300">{filtered.length}</span> {levelLabel}
                </span>
                {hotspots.length > 0 && (
                    <>
                        <span className="w-px h-3 bg-slate-700" />
                        <span className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="font-semibold text-slate-300">{hotspots.filter(h => h.aqi > 150).length}</span> Critical
                        </span>
                        <span className="w-px h-3 bg-slate-700" />
                        <span className="flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                            Avg AQI: <span className="font-semibold text-slate-300">{Math.round(hotspots.reduce((a, b) => a + b.aqi, 0) / hotspots.length)}</span>
                        </span>
                    </>
                )}
                {viewMode !== 'area' && (
                    <>
                        <span className="w-px h-3 bg-slate-700" />
                        <span className="text-slate-600 italic">Click a card to drill down</span>
                    </>
                )}
            </div>

            {/* ── Loading / Error ──────────────────────────────────── */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-52 rounded-2xl glass-panel animate-pulse" />
                    ))}
                </div>
            )}

            {error && !loading && (
                <div className="glass-panel rounded-2xl p-8 text-center">
                    <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                    <p className="text-slate-300 font-medium">{error}</p>
                </div>
            )}

            {/* ── Cards Grid ──────────────────────────────────────── */}
            {!loading && !error && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${viewMode}-${selectedState}-${selectedCity}`}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                        {filtered.map((spot, i) => {
                            const colors = getAQIColor(spot.aqi);
                            return (
                                <motion.div
                                    key={spot.id}
                                    custom={i}
                                    variants={cardVariants}
                                    onClick={() => handleCardClick(spot)}
                                    className={`glass-card rounded-2xl p-5 relative overflow-hidden border ${colors.border} ${viewMode !== 'area' ? 'cursor-pointer hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/5' : 'cursor-default'} transition-all duration-200 group`}
                                >
                                    {/* Glow */}
                                    <div className={`absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br ${colors.bg} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                                    {/* Header */}
                                    <div className="flex items-start justify-between relative z-10 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm font-bold text-slate-100 truncate">{spot.name}</h3>
                                                {spot.hasStation === false && (
                                                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700/50 shrink-0">
                                                        IDW
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.badge}`}>
                                                {spot.status}
                                            </span>
                                        </div>
                                        <div className="text-right shrink-0 ml-3">
                                            <span className={`text-3xl font-black ${colors.text} leading-none`}>
                                                {spot.aqi}
                                            </span>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">AQI</p>
                                        </div>
                                    </div>

                                    {/* Diagnostics */}
                                    <div className="space-y-2.5 relative z-10">
                                        {/* Source Detection */}
                                        <div className="flex items-start gap-2">
                                            <div className="p-1 rounded-md bg-slate-800/80 text-indigo-400 shrink-0 mt-0.5">
                                                {getSourceIcon(spot.source)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-0.5">Source Detection</p>
                                                <p className="text-xs text-slate-300 font-medium leading-tight">{spot.source}</p>
                                            </div>
                                        </div>

                                        {/* AI Diagnosis */}
                                        <div className="flex items-start gap-2">
                                            <div className="p-1 rounded-md bg-slate-800/80 text-purple-400 shrink-0 mt-0.5">
                                                <Brain className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-0.5">AI Diagnosis</p>
                                                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{spot.reason}</p>
                                            </div>
                                        </div>

                                        {/* Strategic Action */}
                                        <div className="flex items-start gap-2">
                                            <div className="p-1 rounded-md bg-slate-800/80 text-emerald-400 shrink-0 mt-0.5">
                                                <ShieldAlert className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-0.5">Strategic Action</p>
                                                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{spot.action}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer: Pollutants */}
                                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/40 relative z-10">
                                        {spot.pm2_5 != null && (
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                PM2.5: <span className="text-slate-300 font-bold">{spot.pm2_5}</span>
                                            </span>
                                        )}
                                        {spot.no2 != null && (
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                NO₂: <span className="text-slate-300 font-bold">{spot.no2}</span>
                                            </span>
                                        )}
                                        {spot.co2 != null && (
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                CO₂: <span className="text-slate-300 font-bold">{spot.co2}</span>
                                            </span>
                                        )}
                                        {viewMode !== 'area' && (
                                            <span className="ml-auto text-[9px] font-bold text-indigo-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                Drill Down <ChevronRight className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="glass-panel rounded-2xl p-8 text-center">
                    <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No results found for &quot;{searchQuery}&quot;</p>
                </div>
            )}
        </div>
    );
}
