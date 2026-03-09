import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getNationalHotspots } from '@/services/adminService';
import { ShieldAlert, Send } from 'lucide-react';

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

    useEffect(() => {
        setMounted(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCenter([lat, lng]);

                    try {
                        // Reverse geocoding to get country bounds
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`);
                        const data = await res.json();
                        if (data.address && data.address.country) {
                            setCountryName(data.address.country);
                        } else {
                            setCountryName('Unknown Region');
                        }

                        // Fetch national-level hotspots around center
                        const hotspotsData = await getNationalHotspots(lat, lng);
                        setHotspots(hotspotsData || []);
                    } catch (err) {
                        console.error("Failed to fetch map data", err);
                    }
                },
                () => {
                    setCountryName('India (Fallback)');
                    getNationalHotspots(20.5937, 78.9629).then(setHotspots);
                }
            );
        } else {
            setCountryName('India (Fallback)');
            getNationalHotspots(20.5937, 78.9629).then(setHotspots);
        }
    }, []);

    const handleDeploy = (id: string, city: string) => {
        setDeploying(id);
        setTimeout(() => {
            alert(`Emergency protocol initiated for ${city}. Mobile smog units and dust control teams dispatched.`);
            setDeploying(null);
        }, 1500);
    }

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
                <p className="text-xs text-slate-400 mt-1">Live Zone: <strong className="text-slate-200">{countryName}</strong></p>
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
                            <div className="text-center font-sans p-1 min-w-[200px]">
                                <strong className="block text-slate-100 text-sm mb-1">{spot.city}</strong>
                                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 my-2">
                                    <span className="text-3xl font-black block" style={{ color: getAQIColor(spot.aqi) }}>
                                        {spot.aqi}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider block mt-1" style={{ color: getAQIColor(spot.aqi) }}>
                                        {spot.status}
                                    </span>
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

