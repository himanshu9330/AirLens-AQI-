import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, LayersControl, LayerGroup, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getNationalHotspots } from '@/services/adminService';
import { ShieldAlert, Send, Wind as WindIcon, Factory, Bell, X, Info } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

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
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function AQIMapFeature() {
    const [mounted, setMounted] = useState(false);
    const [hotspots, setHotspots] = useState<any[]>([]);
    const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default India
    const [countryName, setCountryName] = useState('Detecting Location...');
    const [zoom, setZoom] = useState(4.5);
    const [deploying, setDeploying] = useState<string | null>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [seenRedZones] = useState(new Set<string>());

    // Simulated Industrial Zones (Major hubs)
    const industrialZones = [
        { name: 'Vapi Industrial Estate', coords: [20.37, 72.91], type: 'Chemical/Manufacturing' },
        { name: 'Jamnagar Petrochemical Complex', coords: [22.47, 70.06], type: 'Oil & Gas' },
        { name: 'Pimpri-Chinchwad Automative Hub', coords: [18.62, 73.81], type: 'Automotive' },
        { name: 'Howrah Industrial Belt', coords: [22.59, 88.26], type: 'Mixed Heavy' },
        { name: 'Chennai-Sriperumbudur corridor', coords: [12.97, 79.95], type: 'Automotive/Electronics' }
    ];

    // Simulated Wind Vectors (Dynamic effect)
    const [windTime, setWindTime] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setWindTime(t => t + 1), 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setMounted(true);

        const fetchHotspots = async (lat: number, lng: number) => {
            try {
                const hotspotsData = await getNationalHotspots(lat, lng);
                setHotspots(hotspotsData || []);

                // Check for NEW red zones to trigger alerts
                hotspotsData?.forEach((spot: any) => {
                    if (spot.aqi > 150 && !seenRedZones.has(spot.id)) {
                        seenRedZones.add(spot.id);
                        const newAlert = {
                            id: Date.now() + spot.id,
                            city: spot.city,
                            aqi: spot.aqi,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setAlerts(prev => [newAlert, ...prev].slice(0, 3));
                    }
                });
            } catch (err) {
                console.error("Failed to fetch map hotspots", err);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCenter([lat, lng]);

                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`);
                        const data = await res.json();
                        setCountryName(data.address?.country || 'Detected Region');

                        // Initial fetch
                        fetchHotspots(lat, lng);

                        // Polling Every 10 Seconds for True Live Feel
                        const interval = setInterval(() => {
                            fetchHotspots(lat, lng);
                        }, 10000);

                        return () => clearInterval(interval);
                    } catch (err) {
                        fetchHotspots(lat, lng);
                    }
                },
                () => {
                    setCountryName('India (Fallback)');
                    fetchHotspots(20.5937, 78.9629);
                    const interval = setInterval(() => fetchHotspots(20.5937, 78.9629), 10000);
                    return () => clearInterval(interval);
                }
            );
        } else {
            setCountryName('India (Fallback)');
            fetchHotspots(20.5937, 78.9629);
            const interval = setInterval(() => fetchHotspots(20.5937, 78.9629), 10000);
            return () => clearInterval(interval);
        }
    }, []);

    const handleDeploy = (id: string, city: string) => {
        setDeploying(id);
        setTimeout(() => {
            // alert(`Emergency protocol initiated for ${city}. Mobile smog units and dust control teams dispatched.`);
            const deployAlert = {
                id: 'deploy-' + Date.now(),
                city: city,
                type: 'deployment',
                message: `Emergency units dispatched.`
            };
            setAlerts(prev => [deployAlert, ...prev]);
            setDeploying(null);
        }, 1500);
    }

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    if (!mounted) {
        return (
            <div className="glass-panel w-full h-full min-h-[400px] rounded-3xl animate-pulse flex items-center justify-center">
                <span className="text-slate-500 text-sm font-medium">Initializing Map...</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel w-full h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden relative border border-slate-700/50"
        >
            <div className="absolute top-4 left-4 z-[400] bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/50 shadow-lg min-w-[200px]">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    National Overview
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[10px] uppercase tracking-wider font-black text-emerald-500">Live Updates</p>
                </div>
                <p className="text-xs text-slate-400 mt-1">Zone: <strong className="text-slate-200">{countryName}</strong></p>
            </div>

            {/* Live Notifications */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 max-w-[300px]">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={`p-3 rounded-xl border backdrop-blur-md flex gap-3 shadow-xl ${
                                alert.type === 'deployment' 
                                ? 'bg-emerald-500/20 border-emerald-500/30' 
                                : 'bg-rose-500/20 border-rose-500/30'
                            }`}
                        >
                            <div className={`p-2 rounded-lg h-fit ${alert.type === 'deployment' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                                {alert.type === 'deployment' ? <Send className="w-4 h-4 text-emerald-400" /> : <Bell className="w-4 h-4 text-rose-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {alert.type === 'deployment' ? 'Protocol Active' : 'Critical Detetion'}
                                    </span>
                                    <button onClick={() => removeAlert(alert.id)} className="text-slate-500 hover:text-white transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                                <p className="text-xs font-bold text-slate-50 truncate">{alert.city}</p>
                                <p className="text-[10px] text-slate-300 mt-0.5">
                                    {alert.message || `AQI reached ${alert.aqi} at ${alert.time}`}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%', background: '#020617' }}
                zoomControl={false}
            >
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                <LayersControl position="bottomright">
                    <LayersControl.BaseLayer checked name="Dark Map">
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    </LayersControl.BaseLayer>

                    <LayersControl.Overlay checked name="Wind Vectors">
                        <LayerGroup>
                            {/* Simulated dynamic wind lines */}
                            {hotspots.slice(0, 15).map((spot, i) => {
                                const angle = (i * 45 + windTime * 5) % 360; // Slightly faster rotation for visual effect
                                
                                let windIcon;
                                if (typeof window !== 'undefined') {
                                    const L = require('leaflet');
                                    windIcon = L.divIcon({
                                        className: 'custom-wind-arrow',
                                        html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${angle}deg); filter: drop-shadow(0px 0px 4px rgba(99,102,241,0.5));"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 12]
                                    });
                                }

                                return windIcon ? (
                                    <Marker
                                        key={`wind-${i}`}
                                        position={[spot.lat, spot.lng]}
                                        icon={windIcon}
                                    />
                                ) : null;
                            })}
                        </LayerGroup>
                    </LayersControl.Overlay>

                    <LayersControl.Overlay name="Industrial Clusters">
                        <LayerGroup>
                            {industrialZones.map((zone, i) => (
                                <CircleMarker
                                    key={`ind-${i}`}
                                    center={zone.coords as [number, number]}
                                    radius={12}
                                    pathOptions={{ color: '#94a3b8', fillColor: '#1e293b', fillOpacity: 0.8, weight: 1 }}
                                >
                                    <Popup>
                                        <div className="p-2 min-w-[150px]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Factory className="w-4 h-4 text-slate-400" />
                                                <strong className="text-sm text-slate-100">{zone.name}</strong>
                                            </div>
                                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Major Industrial Hub</p>
                                            <p className="text-xs text-slate-300 mt-1">{zone.type}</p>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>

                {hotspots.map((spot, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[spot.lat, spot.lng]}
                        radius={Math.max(8, Math.min(25, spot.aqi / 15))}
                        pathOptions={{
                            color: getAQIColor(spot.aqi),
                            fillColor: getAQIColor(spot.aqi),
                            fillOpacity: 0.5,
                            weight: 2,
                        }}
                    >
                        <Popup className="aqi-popup">
                            <div className="text-center font-sans p-1 min-w-[220px]">
                                <strong className="block text-slate-100 text-sm mb-1">{spot.city}</strong>
                                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 my-2">
                                    <span className="text-3xl font-black block" style={{ color: getAQIColor(spot.aqi) }}>
                                        {spot.aqi}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider block mt-1" style={{ color: getAQIColor(spot.aqi) }}>
                                        {spot.status}
                                    </span>
                                </div>

                                <div className="text-left bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50 mb-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Info className="w-3 h-3 text-indigo-400" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Advisory</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-200 leading-tight">
                                        Source: <span className="text-indigo-300">{spot.source || 'General Urban'}</span>
                                    </p>
                                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                                        {spot.recommendation || 'Continuous monitoring recommended for this sector.'}
                                    </p>
                                </div>
                                
                                {spot.aqi > 150 && (
                                    <button
                                        onClick={() => handleDeploy(spot.id, spot.city)}
                                        disabled={deploying === spot.id}
                                        className="w-full mt-1.5 py-2.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-3 h-3" />
                                        {deploying === spot.id ? 'Deploying Teams...' : 'Dispatch Resources'}
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </motion.div>
    );
}

