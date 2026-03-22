'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap, LayersControl, LayerGroup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getNationalHotspots } from '@/services/adminService';
import { ShieldAlert, Send, Wind as WindIcon, Info, Globe, ArrowUpRight } from 'lucide-react';

// Fix Leaflet default icon paths in Next.js
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

const getAQIColor = (aqi: number) => {
    if (aqi > 200) return '#be123c'; // rose-700
    if (aqi > 150) return '#e11d48'; // rose-600
    if (aqi > 100) return '#f59e0b'; // amber-500
    if (aqi > 50) return '#eab308';  // yellow-500
    return '#10b981'; // emerald-500
};

// Component to recenter map dynamically
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (map && map.getContainer()) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

// Component to watch zoom level and auto-reset view mode
function ZoomWatcher({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    const map = useMap();
    useEffect(() => {
        const handleZoom = () => {
            onZoomChange(map.getZoom());
        };
        map.on('zoomend', handleZoom);
        return () => { map.off('zoomend', handleZoom); };
    }, [map, onZoomChange]);
    return null;
}

export default function AQIMapFeature() {
    const [mounted, setMounted] = useState(false);
    const [hotspots, setHotspots] = useState<any[]>([]);
    const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); 
    const [zoom, setZoom] = useState(4.5);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState<'state' | 'city' | 'area'>('state');
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Dynamic wind time for animation
    const [windTime, setWindTime] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setWindTime(t => t + 1), 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setMounted(true);
        const fetchMapData = async () => {
            try {
                setLoading(true);
                const data = await getNationalHotspots(viewMode, selectedState || undefined, selectedCity || undefined);
                setHotspots(data || []);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch map data", err);
                if (err.message.includes('401')) {
                    setError("Authentication session expired. Please sign in again.");
                } else {
                    setError("Unable to connect to live AQI data stream.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
        const interval = setInterval(fetchMapData, 30000);
        return () => clearInterval(interval);
    }, [viewMode, selectedState, selectedCity]);

    const handleMarkerClick = (spot: any) => {
        if (viewMode === 'state') {
            setViewMode('city');
            setSelectedState(spot.name);
            setCenter([spot.lat, spot.lng]);
            setZoom(7);
        } else if (viewMode === 'city') {
            setViewMode('area');
            setSelectedCity(spot.name);
            setCenter([spot.lat, spot.lng]);
            setZoom(12);
        }
    };

    const resetView = () => {
        setViewMode('state');
        setSelectedState(null);
        setSelectedCity(null);
        setCenter([20.5937, 78.9629]);
        setZoom(4.5);
    };

    // Auto-reset view when user manually zooms out
    const handleZoomChange = useCallback((currentZoom: number) => {
        if (viewMode === 'area' && currentZoom < 9) {
            // Zoomed out from area → go back to city
            setViewMode('city');
            setSelectedCity(null);
        } else if ((viewMode === 'city' || viewMode === 'area') && currentZoom < 6) {
            // Zoomed out far → go back to national/state
            setViewMode('state');
            setSelectedState(null);
            setSelectedCity(null);
        }
    }, [viewMode]);

    if (!mounted) {
        return (
            <div className="glass-panel w-full h-[500px] rounded-3xl animate-pulse flex items-center justify-center">
                <span className="text-slate-500 text-sm font-medium">Initializing Map...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel w-full h-[500px] rounded-3xl overflow-hidden relative border border-slate-700/50"
        >
            {/* Map Controls UI */}
            <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/50 shadow-lg min-w-[220px]">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-indigo-400" />
                        {viewMode === 'state' ? 'National Overview' : selectedCity ? `Area: ${selectedCity}` : `State: ${selectedState}`}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${error ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        <p className={`text-[10px] uppercase tracking-wider font-black ${error ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {error ? 'Streaming Offline' : 'Live Updates'}
                        </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/50">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = '/admin/dashboard/aqi-map';
                            }}
                            className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-xs font-bold text-indigo-400 transition-all flex items-center justify-center gap-2 group"
                        >
                            Full Page Details
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {viewMode !== 'state' && (
                    <button 
                        onClick={resetView}
                        className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 shadow-lg text-xs font-bold text-indigo-400 hover:text-white transition-all flex items-center gap-2 w-fit"
                    >
                        <Send className="w-3 h-3 rotate-180" />
                        Back to National
                    </button>
                )}
            </div>

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 z-[500] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm text-center shadow-2xl">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-6 h-6 text-rose-500" />
                        </div>
                        <h4 className="text-white font-bold mb-2">Data Retrieval Failed</h4>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{error}</p>
                        {error.includes('Authentication') ? (
                            <a href="/admin/login" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all">
                                Sign In Now
                            </a>
                        ) : (
                            <button onClick={() => window.location.reload()} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all">
                                Retry Connection
                            </button>
                        )}
                    </div>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%', background: '#020617' }}
                zoomControl={false}
            >
                <ChangeView center={center} zoom={zoom} />
                <ZoomWatcher onZoomChange={handleZoomChange} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                <LayersControl position="bottomright">
                    <LayersControl.Overlay checked name="Wind Analysis">
                        <LayerGroup>
                            {hotspots.slice(0, 10).map((spot, i) => {
                                if (!spot.lat || !spot.lng) return null;
                                const angle = (i * 45 + windTime * 5) % 360; 
                                const windIcon = L.divIcon({
                                    className: 'wind-icon',
                                    html: `<svg width="24" height="24" style="transform: rotate(${angle}deg)"><path d="M12 21V3M5 10l7-7 7 7" stroke="#6366f1" fill="none" stroke-width="2.5" stroke-linecap="round"/></svg>`,
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                });
                                return <Marker key={`wind-${i}`} position={[spot.lat, spot.lng]} icon={windIcon} />;
                            })}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

                {hotspots.map((spot, idx) => (
                    <CircleMarker
                        key={`${viewMode}-${spot.id}`}
                        center={[spot.lat, spot.lng]}
                        radius={viewMode === 'area' ? 12 : Math.max(8, Math.min(22, spot.aqi / 15))}
                        eventHandlers={{ click: () => handleMarkerClick(spot) }}
                        pathOptions={{
                            color: getAQIColor(spot.aqi),
                            fillColor: getAQIColor(spot.aqi),
                            fillOpacity: 0.6,
                            weight: 2,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                            <div style={{ fontFamily: 'sans-serif', textAlign: 'center', minWidth: 110, padding: '4px' }}>
                                <strong style={{ fontSize: 13, color: '#0f172a', display: 'block', marginBottom: 2, fontWeight: 800 }}>{spot.name}</strong>
                                <span style={{ fontSize: 24, fontWeight: 900, color: getAQIColor(spot.aqi), display: 'block', lineHeight: 1 }}>{spot.aqi}</span>
                                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: getAQIColor(spot.aqi), marginTop: 2, display: 'block' }}>{spot.status}</span>
                            </div>
                        </Tooltip>
                        <Popup className="aqi-popup">
                            <div className="text-center font-sans p-1 min-w-[240px]">
                                <strong className="block text-slate-100 text-sm mb-1">{spot.name}</strong>
                                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 my-2">
                                    <span className="text-3xl font-black block" style={{ color: getAQIColor(spot.aqi) }}>
                                        {spot.aqi}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider block mt-1" style={{ color: getAQIColor(spot.aqi) }}>
                                        {spot.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                                        <p className="text-[9px] uppercase font-bold text-slate-500">PM2.5</p>
                                        <p className="text-xs font-black text-slate-200">{spot.pm2_5} μg/m³</p>
                                    </div>
                                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                                        <p className="text-[9px] uppercase font-bold text-slate-500">NO₂</p>
                                        <p className="text-xs font-black text-slate-200">{spot.no2} ppb</p>
                                    </div>
                                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                                        <p className="text-[9px] uppercase font-bold text-slate-500">CO₂</p>
                                        <p className="text-xs font-black text-slate-200">{spot.co2} ppm</p>
                                    </div>
                                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                                        <p className="text-[9px] uppercase font-bold text-slate-500">Wind</p>
                                        <p className="text-xs font-black text-slate-200">{spot.windSpeed} km/h</p>
                                    </div>
                                </div>
                                <div className="text-left bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><Info className="w-3 h-3"/> Advisory</p>
                                    <p className="text-[11px] text-slate-300 leading-tight">
                                        {spot.recommendation || 'Continuous monitoring active for this sector.'}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </motion.div>
    );
}
