'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Key, BellRing, Database, Save, RotateCcw, AlertTriangle } from 'lucide-react';

const tabs = [
    { id: 'general', label: 'General System', icon: Settings2 },
    { id: 'api', label: 'API Keys & Models', icon: Key },
    { id: 'alerts', label: 'Alerting & Webhooks', icon: BellRing },
    { id: 'advanced', label: 'Advanced Tuning', icon: Database }
];

export function SettingsPanel() {
    const [activeTab, setActiveTab] = useState('api');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

    // Dummy state for forms
    const [formData, setFormData] = useState({
        openaqKey: 'sk_live_openaq_8f93...2b1',
        geminiKey: 'AIzaSyAj3O...FVA',
        redZoneThreshold: '150',
        alertWebhook: 'https://emergency.services.gov/api/v1/dispatch',
        pollingInterval: '10'
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }, 1200);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-64 glass-panel rounded-2xl p-4 h-fit flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full mix-blend-screen pointer-events-none"></div>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold w-full text-left group overflow-hidden ${
                                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="settingsTabIndicator"
                                    className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <tab.icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 glass-panel rounded-2xl p-6 lg:p-8 relative overflow-hidden min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                    >
                        {activeTab === 'api' && (
                            <div className="space-y-6 flex-1">
                                <div>
                                    <h3 className="text-xl font-bold font-display text-slate-100 mb-1">API Integrations</h3>
                                    <p className="text-sm text-slate-400">Manage external data providers and AI models.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Google Gemini API Key</label>
                                        <div className="relative">
                                            <input type="password" value={formData.geminiKey} readOnly className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono text-sm" />
                                            <div className="absolute right-3 top-3 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">CONNECTED</div>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1">Used for generative AI hotspot recommendations.</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">OpenAQ API Key</label>
                                        <input type="password" value={formData.openaqKey} readOnly className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'alerts' && (
                            <div className="space-y-6 flex-1">
                                <div>
                                    <h3 className="text-xl font-bold font-display text-slate-100 mb-1">Emergency Routing</h3>
                                    <p className="text-sm text-slate-400">Configure automated dispatches based on active ML predictions.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-rose-500/20">
                                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-sm font-bold text-slate-200 block mb-1">Red Zone Threshold (AQI)</label>
                                                <p className="text-xs text-slate-400 mb-3">Cities crossing this threshold will trigger immediate automated alerts across the dashboard and external hooks.</p>
                                                <input type="number" value={formData.redZoneThreshold} onChange={(e) => setFormData({...formData, redZoneThreshold: e.target.value})} className="w-32 bg-slate-900/80 border border-slate-700/50 rounded-lg px-3 py-2 text-rose-400 font-bold focus:outline-none focus:border-rose-500/50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Emergency Dispatch Webhook URL</label>
                                        <input type="text" value={formData.alertWebhook} onChange={(e) => setFormData({...formData, alertWebhook: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors font-mono text-sm" />
                                        <p className="text-[11px] text-slate-500">POST requests will be sent here when deploying teams via the map.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'general' && (
                            <div className="space-y-6 flex-1">
                                <div>
                                    <h3 className="text-xl font-bold font-display text-slate-100 mb-1">System Preferences</h3>
                                    <p className="text-sm text-slate-400">Core operational parameters.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Polling Rate (Seconds)</label>
                                        <select value={formData.pollingInterval} onChange={(e) => setFormData({...formData, pollingInterval: e.target.value})} className="w-full md:w-64 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none">
                                            <option value="5">5 Seconds (Ultra Aggressive)</option>
                                            <option value="10">10 Seconds (Recommended Live)</option>
                                            <option value="30">30 Seconds (Standard)</option>
                                            <option value="60">60 Seconds (Economy)</option>
                                        </select>
                                    </div>
                                    
                                    <div className="mt-8 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200">System Theme</h4>
                                            <p className="text-xs text-slate-400">Dashboard is locked to Dark/Glass mode for optimal GIS contrast.</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-slate-950/50 text-slate-500 text-xs font-bold border border-slate-800">LOCKED</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className="space-y-6 flex-1">
                                <div>
                                    <h3 className="text-xl font-bold font-display text-rose-100 mb-1">Danger Zone</h3>
                                    <p className="text-sm text-rose-400/70">Modify these settings at your own risk. Operations cannot be undone.</p>
                                </div>
                                
                                <div className="space-y-4 pt-4 border-t border-rose-500/10">
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-200">Clear ML Prediction Cache</h4>
                                            <p className="text-xs text-slate-400 max-w-sm mt-1">Force the Python backend to drop current predictive horizons. Next request will be slow (re-inference).</p>
                                        </div>
                                        <button className="px-4 py-2 rounded-lg bg-slate-900 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors text-sm font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                                            Clear Cache
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Footer */}
                        <div className="pt-6 mt-auto border-t border-slate-800 flex justify-end items-center gap-4">
                            {saveStatus === 'success' && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-emerald-400 text-sm font-bold flex items-center gap-2"
                                >
                                    System Updated
                                </motion.span>
                            )}
                            <button className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" /> Discard
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-70 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                            >
                                {isSaving ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {isSaving ? 'Configuring System...' : 'Apply Configuration'}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
