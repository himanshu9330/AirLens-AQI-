"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, AlertTriangle, AlertCircle, Info, Activity, Wind, Factory, Car } from 'lucide-react';
import Link from 'next/link';

import { getDetailedAlerts } from '@/services/adminService';

const getStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : 'good';
    switch (s) {
        case 'severe': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        case 'very poor': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        case 'poor': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        case 'moderate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
};

const getSourceIcon = (source: string) => {
    if (source.includes('Vehicular')) return <Car className="w-4 h-4" />;
    if (source.includes('Industrial')) return <Factory className="w-4 h-4" />;
    if (source.includes('Construction')) return <Activity className="w-4 h-4" />;
    if (source.includes('Biomass')) return <Wind className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
};

export default function DetailedAlertsPage() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedStates, setExpandedStates] = useState<string[]>([]);
    const [expandedCities, setExpandedCities] = useState<string[]>([]);

    useEffect(() => {
        const loadAlerts = async () => {
            try {
                const data = await getDetailedAlerts();
                setAlerts(data);
                // Auto-expand the first state for better initial UX
                if (data.length > 0) {
                    setExpandedStates([data[0].id]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadAlerts();
    }, []);

    const toggleState = (stateId: string) => {
        setExpandedStates(prev =>
            prev.includes(stateId) ? prev.filter(id => id !== stateId) : [...prev, stateId]
        );
    };

    const toggleCity = (cityId: string) => {
        setExpandedCities(prev =>
            prev.includes(cityId) ? prev.filter(id => id !== cityId) : [...prev, cityId]
        );
    };

    const downloadCsv = () => {
        // Flatten the hierachical data for the CSV
        const rows = [
            ['State', 'City', 'Ward', 'AQI', 'Status', 'Primary Source', 'Reason', 'Action']
        ];

        alerts.forEach(state => {
            state.cities.forEach((city: any) => {
                city.wards.forEach((ward: any) => {
                    rows.push([
                        `"${state.name}"`,
                        `"${city.name}"`,
                        `"${ward.name}"`,
                        ward.aqi,
                        `"${ward.status}"`,
                        `"${ward.source}"`,
                        `"${ward.reason}"`,
                        `"${ward.action}"`
                    ]);
                });
            });
        });

        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `National_AQI_Alerts_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white font-display tracking-tight">National Actionable Alerts</h1>
                        <p className="text-slate-400 mt-1">AI-generated reasoning and strategic mitigation directives across all monitored grid points.</p>
                    </div>
                </div>
                <button
                    onClick={downloadCsv}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export Report
                </button>
            </div>

            {loading ? (
                <div className="glass-panel p-8 rounded-3xl h-[600px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 animate-pulse">Analyzing hierarchical national grid data...</p>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-3xl overflow-hidden border border-slate-700/50"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700/50 bg-slate-800/30">
                                    <th className="p-4 pl-6 text-sm font-semibold text-slate-300">Location Hierarchy</th>
                                    <th className="p-4 text-sm font-semibold text-slate-300">AQI Status</th>
                                    <th className="p-4 text-sm font-semibold text-slate-300">Primary Source</th>
                                    <th className="p-4 text-sm font-semibold text-slate-300 w-1/4">AI Diagnosis / Reason</th>
                                    <th className="p-4 pr-6 text-sm font-semibold text-slate-300 w-1/4">Strategic Action Needed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {alerts.map((state, stateIdx) => (
                                    <React.Fragment key={state.id}>
                                        {/* STATE ROW */}
                                        <motion.tr
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: stateIdx * 0.05 }}
                                            onClick={() => toggleState(state.id)}
                                            className="bg-slate-800/40 hover:bg-slate-700/50 transition-colors cursor-pointer"
                                        >
                                            <td className="p-4 pl-6 align-top">
                                                <div className="font-display text-lg font-bold text-white flex items-center gap-2">
                                                    <svg className={`w-4 h-4 transition-transform ${expandedStates.includes(state.id) ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {state.name}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 pl-6">
                                                    {state.cities.length} Monitored Cities
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-xl font-bold font-display tracking-tight text-white">{state.overallAqi}</span>
                                                    <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap w-max ${getStatusColor(state.status)}`}>
                                                        Avg: {state.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-2 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-max">
                                                    {getSourceIcon(state.source)}
                                                    <span className="text-sm font-medium">{state.source}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top text-sm text-slate-400 leading-relaxed max-w-sm">
                                                {state.reason}
                                            </td>
                                            <td className="p-4 pr-6 align-top max-w-sm">
                                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-sm text-indigo-300 leading-relaxed shadow-inner">
                                                    {state.action}
                                                </div>
                                            </td>
                                        </motion.tr>

                                        {/* CITY ROWS */}
                                        {expandedStates.includes(state.id) && state.cities.map((city: any) => (
                                            <React.Fragment key={city.id}>
                                                <tr
                                                    onClick={() => toggleCity(city.id)}
                                                    className="bg-slate-800/20 hover:bg-slate-800/40 transition-colors cursor-pointer border-l-4 border-l-slate-700"
                                                >
                                                    <td className="p-4 pl-10 align-top">
                                                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                                                            <svg className={`w-3 h-3 text-slate-500 transition-transform ${expandedCities.includes(city.id) ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                            {city.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 mt-1 pl-5">
                                                            {city.wards.length} Monitored Areas
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-lg font-bold text-slate-300">{city.cityAqi}</span>
                                                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider whitespace-nowrap w-max ${getStatusColor(city.status)}`}>
                                                                {city.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50 w-max">
                                                            {getSourceIcon(city.source)}
                                                            <span className="text-[11px] font-medium">{city.source}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top text-[11px] text-slate-500 leading-relaxed max-w-xs">
                                                        {city.reason}
                                                    </td>
                                                    <td className="p-4 pr-6 align-top max-w-xs">
                                                        <div className="bg-slate-800/50 border border-slate-700/50 p-2 rounded-lg text-[11px] text-slate-400 leading-relaxed">
                                                            {city.action}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* WARD ROWS */}
                                                {expandedCities.includes(city.id) && city.wards.map((ward: any) => (
                                                    <motion.tr
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        key={ward.id}
                                                        className="hover:bg-slate-800/60 transition-colors group border-l-4 border-l-indigo-500/20"
                                                    >
                                                        <td className="p-4 pl-14 align-top">
                                                            <div className="font-medium text-slate-300">{ward.name}</div>
                                                            <div className="text-xs text-slate-500 mt-1">Ward Grid Point</div>
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <div className="flex flex-col gap-2">
                                                                <span className="text-xl font-bold font-display tracking-tight text-white">{ward.aqi}</span>
                                                                <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap w-max ${getStatusColor(ward.status)}`}>
                                                                    {ward.status}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <div className="flex items-center gap-2 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-max">
                                                                {getSourceIcon(ward.source)}
                                                                <span className="text-xs font-medium">{ward.source}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top text-xs text-slate-400 leading-relaxed max-w-xs">
                                                            {ward.reason}
                                                        </td>
                                                        <td className="p-4 pr-6 align-top max-w-xs">
                                                            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-300 leading-relaxed shadow-inner">
                                                                {ward.action}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
