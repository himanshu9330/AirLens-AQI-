'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, Calendar, LogOut, Settings, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserProfileData {
    id: string;
    name: string;
    email: string;
    role: string;
    currentArea?: string;
    createdAt: string;
    preferences: {
        wards: string[];
        alerts: boolean;
    };
}

export function UserProfilePanel({ isOpen, onClose }: UserProfilePanelProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('citizenToken');
                if (!token) throw new Error('No authentication token found');

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('citizenToken');
                        router.push('/citizen/login');
                    }
                    throw new Error('Failed to fetch profile');
                }

                const data = await res.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isOpen, router]);

    const handleLogout = () => {
        localStorage.removeItem('citizenToken');
        router.push('/citizen/login');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 lg:hidden"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 300, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-20 right-4 w-full max-w-sm bg-slate-900/90 border border-slate-700 shadow-2xl shadow-indigo-500/10 rounded-3xl overflow-hidden z-50 backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white font-display">Account</h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                                    <p className="text-sm text-slate-400">Loading your profile...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium text-center">
                                    {error}
                                </div>
                            ) : profile ? (
                                <div className="space-y-6">
                                    {/* User Identity */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-emerald-500/20">
                                            {profile.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white capitalize">{profile.name}</h3>
                                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                                                {profile.role === 'admin' ? 'Administrator' : 'Citizen Member'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

                                    {/* Details List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 font-medium mb-0.5">Email Address</p>
                                                <p className="text-slate-300 truncate">{profile.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 font-medium mb-0.5">Primary Location</p>
                                                <p className="text-slate-300">{profile.currentArea || 'Location not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 font-medium mb-0.5">Member Since</p>
                                                <p className="text-slate-300">{formatDate(profile.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-slate-800"></div>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group">
                                            <Settings className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                                            <span className="text-sm font-medium">Notification Preferences</span>
                                            {profile.preferences?.alerts && (
                                                <span className="ml-auto flex w-2 h-2 rounded-full bg-emerald-500"></span>
                                            )}
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors font-semibold text-sm border border-rose-500/20"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
