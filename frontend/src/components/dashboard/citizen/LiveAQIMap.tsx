'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Maximize2, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(m => m.Circle), { ssr: false });

interface Props {
    location: { lat: number; lng: number } | null;
    currentAqi: number;
}

export function LiveAQIMap({ location, currentAqi }: Props) {
    const [mounted, setMounted] = useState(false);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Mumbai default
    const center = location || defaultCenter;

    // Auto-center map when location updates
    useEffect(() => {
        if (mapRef.current && location) {
            mapRef.current.setView([location.lat, location.lng], 14, { animate: true });
        }
    }, [location]);

    const getHeatColor = (aqi: number) => {
        if (aqi <= 50) return '#10b981'; // emerald
        if (aqi <= 100) return '#f59e0b'; // amber
        if (aqi <= 200) return '#f97316'; // orange
        return '#f43f5e'; // rose
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full min-h-[400px] glass-panel rounded-3xl border border-white/5 overflow-hidden relative flex flex-col"
        >
            <div className="absolute top-4 left-6 z-[1000] drop-shadow-md">
                <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Live Ward Map
                </h2>
            </div>

            <div className="absolute top-4 right-6 z-[1000] flex gap-2">
                <button className="p-2 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl hover:bg-slate-800 transition shadow-lg">
                    <Maximize2 className="w-4 h-4 text-slate-300" />
                </button>
            </div>

            <div className="flex-1 w-full bg-slate-900 relative">
                {mounted ? (
                    <MapContainer
                        ref={mapRef}
                        center={[center.lat, center.lng]}
                        zoom={13}
                        zoomControl={false}
                        className="w-full h-full z-0"
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                        />

                        {/* Heat zone overlay */}
                        <Circle
                            center={[center.lat, center.lng]}
                            radius={2000}
                            pathOptions={{
                                color: getHeatColor(currentAqi),
                                fillColor: getHeatColor(currentAqi),
                                fillOpacity: 0.2,
                                stroke: false
                            }}
                        />

                        {location && (
                            <Circle
                                center={[location.lat, location.lng]}
                                radius={50}
                                pathOptions={{
                                    color: '#6366f1',
                                    fillColor: '#818cf8',
                                    fillOpacity: 1,
                                    weight: 2
                                }}
                            />
                        )}
                    </MapContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                {/* Legend Overlay */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl flex items-center gap-3">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-xs font-medium text-slate-300">0-50</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-xs font-medium text-slate-300">51-100</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-xs font-medium text-slate-300">&gt;200</span></div>
                </div>
            </div>
        </motion.div>
    );
}
