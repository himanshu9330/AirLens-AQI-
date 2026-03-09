'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, CheckCircle2, ShieldAlert, XCircle, Shield } from 'lucide-react';

interface Props {
    aqi: number;
}

export function HealthAdvisory({ aqi }: Props) {
    // Dynamic advisory logic
    let status = 'Good';
    let statusColor = 'text-emerald-400';
    let statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;

    let tips = [
        "Air quality is ideal for outdoor activities.",
        "Perfect time to open windows and ventilate your home."
    ];
    let maskRequired = false;

    if (aqi > 50 && aqi <= 100) {
        status = 'Moderate';
        statusColor = 'text-amber-400';
        statusIcon = <ShieldAlert className="w-5 h-5 text-amber-400" />;
        tips = [
            "Unusually sensitive individuals should consider limiting prolonged outdoor exertion.",
            "Otherwise, outdoor activities are safe."
        ];
    } else if (aqi > 100 && aqi <= 200) {
        status = 'Unhealthy for Sensitive Groups';
        statusColor = 'text-orange-400';
        statusIcon = <ShieldAlert className="w-5 h-5 text-orange-400" />;
        tips = [
            "Active children and adults, and people with respiratory disease, should limit outdoor exertion.",
            "General public is less likely to be affected."
        ];
        maskRequired = true;
    } else if (aqi > 200) {
        status = 'Very Unhealthy / Severe';
        statusColor = 'text-rose-400';
        statusIcon = <XCircle className="w-5 h-5 text-rose-400" />;
        tips = [
            "Avoid all physical activities outdoors.",
            "Use air purifiers indoors and keep windows closed.",
            "Sensitive groups should remain indoors."
        ];
        maskRequired = true;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-100 font-display">Health Advisory</h2>
                    <p className="text-sm text-slate-400">Activity recommendations</p>
                </div>
                <div className="p-2 bg-slate-800 rounded-full">
                    <HeartPulse className="w-5 h-5 text-rose-400" />
                </div>
            </div>

            <div className={`p-4 rounded-2xl bg-slate-900/50 border border-slate-800 mb-6 flex items-start gap-4`}>
                <div className="mt-0.5">{statusIcon}</div>
                <div>
                    <h4 className={`text-sm font-bold ${statusColor} mb-1`}>{status}</h4>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {tips[0]}
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-end space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">Protection Tips</h3>

                {maskRequired && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-slate-200 font-medium">Wear N95 mask outdoors</span>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                        <div className="text-xs text-slate-400 mb-1 font-semibold">Morning</div>
                        <div className={`text-sm font-bold ${aqi > 150 ? 'text-orange-400' : 'text-amber-400'}`}>Mod</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                        <div className="text-xs text-slate-400 mb-1 font-semibold">Afternoon</div>
                        <div className={`text-sm font-bold ${aqi > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>Poor</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]">
                        <div className="text-xs text-emerald-400 mb-1 font-semibold">Night</div>
                        <div className="text-sm font-bold text-emerald-400">Best</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
