'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertTriangle, ShieldAlert, Navigation } from 'lucide-react';
import Link from 'next/link';

// Dummy implementation of the components we will build next
import { CurrentAQICard } from '@/components/dashboard/citizen/CurrentAQICard';
import { LiveAQIMap } from '@/components/dashboard/citizen/LiveAQIMap';
import { TrendCharts } from '@/components/dashboard/citizen/TrendCharts';
import { PredictionPanel } from '@/components/dashboard/citizen/PredictionPanel';
import { SourceBreakdown } from '@/components/dashboard/citizen/SourceBreakdown';
import { HealthAdvisory } from '@/components/dashboard/citizen/HealthAdvisory';
import { UserProfilePanel } from '@/components/dashboard/citizen/UserProfilePanel';

export default function CitizenDashboard() {
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locError, setLocError] = useState<string>('');
    const [currentArea, setCurrentArea] = useState('Detecting Area...');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Core AQI state
    const [currentAqi, setCurrentAqi] = useState<number>(0);
    const [aqiCategory, setAqiCategory] = useState<string>('Good');

    // Alerting state
    const [showRedZoneAlert, setShowRedZoneAlert] = useState(false);
    const [showPredictiveAlert, setShowPredictiveAlert] = useState(false);

    // Simulated API call based on location
    const fetchAqiData = useCallback(async (lat: number, lng: number) => {
        // In a real app, we'd hit /api/users/location and GET /api/wards/nearby
        // For demonstration of the UI, we'll assign a mock AQI based on coordinates

        // Let's create a dummy "Red Zone" at specific coordinates if we want to test
        const isRedZone = (lat > 19.0 && lat < 19.1); // Mock condition for Mumbai

        const newAqi = isRedZone ? 285 : Math.floor(Math.random() * (150 - 40) + 40);
        // Fetch real area name using OpenStreetMap Nominatim API
        let newArea = "Detecting...";
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
            const geoData = await geoRes.json();
            if (geoData.address) {
                newArea = geoData.address.suburb || geoData.address.neighbourhood || geoData.address.city_district || geoData.address.city || geoData.address.town || "Unknown Area";
            } else {
                newArea = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            newArea = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
        }

        setCurrentAqi(newAqi);
        setCurrentArea(newArea);

        // Sync location to backend
        try {
            const token = localStorage.getItem('citizenToken');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/location`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        latitude: lat,
                        longitude: lng,
                        area: newArea
                    })
                });
            }
        } catch (err) {
            console.error('Failed to sync location to backend:', err);
        }

        // Category mapping
        if (newAqi <= 50) setAqiCategory('Good');
        else if (newAqi <= 100) setAqiCategory('Moderate');
        else if (newAqi <= 200) setAqiCategory('Poor');
        else if (newAqi <= 300) setAqiCategory('Very Unhealthy');
        else setAqiCategory('Severe');

        // Check for Red Zone Alert
        if (newAqi >= 201 && !showRedZoneAlert) {
            setShowRedZoneAlert(true);
        } else if (newAqi < 201) {
            setShowRedZoneAlert(false);
        }

        // Check for Predictive Alert (Mock: if currently poor, maybe heading to severe)
        if (newAqi >= 150 && newAqi < 201 && !showPredictiveAlert) {
            setShowPredictiveAlert(true);
        } else if (newAqi < 150 || newAqi >= 201) {
            setShowPredictiveAlert(false);
        }
    }, [showRedZoneAlert, showPredictiveAlert]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocError('Geolocation is not supported by your browser');
            return;
        }

        // Ask permission and track continuously
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setLocError('');
                fetchAqiData(latitude, longitude);
            },
            (error) => {
                setLocError('Unable to retrieve your location. Please grant permission.');
                console.error(error);
                // Fallback for demo if blocked
                fetchAqiData(19.0760, 72.8777);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [fetchAqiData]);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="font-display font-bold text-xl tracking-tight text-white">
                            AirLens<span className="text-emerald-400">.</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 text-xs text-slate-300">
                            {locError ? (
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                            ) : (
                                <Navigation className="w-3 h-3 text-emerald-400" />
                            )}
                            {locError || currentArea}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-emerald-400 hover:bg-slate-700 hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/20"
                        >
                            C
                        </button>
                    </div>
                </div>
            </header>

            {/* Red Zone Global Alert */}
            <AnimatePresence>
                {showRedZoneAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-rose-500/10 border border-rose-500/50 rounded-2xl p-4 shadow-2xl shadow-rose-500/20 backdrop-blur-xl"
                    >
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-rose-100 mb-1">Pollution Alert</h3>
                                <p className="text-sm text-rose-200/80">
                                    You are currently in a <strong className="text-rose-100">High Pollution Zone</strong> ({currentArea}).<br />
                                    <strong>AQI: {currentAqi} ({aqiCategory})</strong>
                                </p>
                                <div className="mt-3 text-xs font-semibold text-rose-300 bg-rose-950/50 p-2 rounded-lg">
                                    Health Advisory: Wear N95 mask. Avoid outdoor activities. Sensitive groups should stay indoors.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Predictive Global Alert */}
            <AnimatePresence>
                {!showRedZoneAlert && showPredictiveAlert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[90%] max-w-sm bg-amber-500/10 border border-amber-500/50 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 backdrop-blur-xl"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-amber-100 mb-1">Warning: Approaching Red Zone</h3>
                                <p className="text-sm text-amber-200/80">
                                    Distance: ~400 meters<br />
                                    AQI in that area: 260
                                </p>
                                <ul className="mt-2 text-xs font-medium text-amber-300 list-disc pl-4">
                                    <li>Avoid this route if possible</li>
                                    <li>Wear protective mask</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dashboard Content */}
            <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto flex flex-col gap-6">

                {/* Top Row: Current AQI & Main Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <CurrentAQICard aqi={currentAqi} category={aqiCategory} area={currentArea} />
                    </div>
                    <div className="lg:col-span-2">
                        <LiveAQIMap location={location} currentAqi={currentAqi} />
                    </div>
                </div>

                {/* Middle Row: Predictions & Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PredictionPanel />
                    <TrendCharts />
                </div>

                {/* Bottom Row: Sources & Health */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SourceBreakdown />
                    <HealthAdvisory aqi={currentAqi} />
                </div>
            </main>

            {/* User Profile Overlay */}
            <UserProfilePanel
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </div>
    );
}
