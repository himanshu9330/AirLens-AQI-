'use client';
import { useEffect, useState, useCallback, memo } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dynamic from 'next/dynamic';
import { getNationalHotspots, getWardwiseAqi } from '@/services/adminService';
import type { StateAQIData } from './StateLayer';

// Dynamically import layers to prevent SSR issues
const StateLayerDynamic = dynamic(() => import('./StateLayer'), { ssr: false });
const WardLayerDynamic  = dynamic(() => import('./WardLayer'),  { ssr: false });
const WardCircleLayerDynamic = dynamic(() => import('./WardCircleLayer'), { ssr: false });
const GridCircleLayerDynamic = dynamic(() => import('./GridCircleLayer'), { ssr: false });

// Fix Leaflet icon paths
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl:        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

/** Zoom threshold — state view below, city/ward view at or above */
const ZOOM_THRESHOLD = 9.0;

interface WardData {
    wardId: string;
    aqi: number;
    category: string;
    lat?: number;
    lon?: number;
    polygon?: [number, number][][];
}

// ─── Zoom tracker inside the MapContainer ────────────────────────────────────
function MapTracker({ onUpdate }: { onUpdate: (z: number, c: [number, number]) => void }) {
    const map = useMapEvents({
        zoomend() { onUpdate(map.getZoom(), [map.getCenter().lat, map.getCenter().lng]); },
        moveend() { onUpdate(map.getZoom(), [map.getCenter().lat, map.getCenter().lng]); }
    });
    return null;
}

// ─── Safe setView wrapper ─────────────────────────────────────────────────────
function InitView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (map && map.getContainer()) map.setView(center, zoom);
    }, []); // Only on mount
    return null;
}

// ─── Main AQIMap component ───────────────────────────────────────────────────
function AQIMap({ isAdmin = false }: { isAdmin?: boolean }) {
    const [mounted,    setMounted]    = useState(false);
    const [gridLocation, setGridLocation] = useState('india'); 
    const [zoomLevel,  setZoomLevel]  = useState(7);
    const [stateData,  setStateData]  = useState<StateAQIData[]>([]);
    const [wardData,   setWardData]   = useState<WardData[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [mapCenter,  setMapCenter]  = useState<[number, number]>([22.5, 82.5]);

    const showWards = zoomLevel >= ZOOM_THRESHOLD;

    // Dynamically update grid location based on proximity to major cities when zoomed in
    useEffect(() => {
        if (zoomLevel < 8) {
            setGridLocation('india');
            return;
        }

        const cities = [
            { name: 'delhi', lat: 28.61, lon: 77.23 },
            { name: 'mumbai', lat: 19.07, lon: 72.87 },
            { name: 'bangalore', lat: 12.97, lon: 77.59 },
        ];

        let closest = 'india';
        let minDist = 2.0; // Distance threshold in degrees (~200km)

        cities.forEach(city => {
            const dist = Math.sqrt(Math.pow(mapCenter[0] - city.lat, 2) + Math.pow(mapCenter[1] - city.lon, 2));
            if (dist < minDist) {
                minDist = dist;
                closest = city.name;
            }
        });

        if (closest !== gridLocation) {
            setGridLocation(closest);
        }
    }, [zoomLevel, mapCenter]);

    useEffect(() => {
        setMounted(true);
        const fetchAll = async () => {
            try {
                // Fetch both in parallel
                const [states, wards] = await Promise.all([
                    getNationalHotspots('state'),
                    getWardwiseAqi().catch(() => [])
                ]);
                setStateData(states || []);
                
                // FORCE TEST WARD for guaranteed visibility during debugging
                const finalWards = (wards && wards.length > 0) ? wards : [
                    { 
                      wardId: "DIAGNOSTIC_TEST_WARD (AUTO-GEN)", 
                      aqi: 999, 
                      category: "CRITICAL", 
                      lat: 28.61, lon: 77.23, // Delhi Center
                      polygon: [[[77.1, 28.5], [77.4, 28.5], [77.4, 28.8], [77.1, 28.8], [77.1, 28.5]]]
                    }
                ];
                setWardData(finalWards);
            } catch (err) {
                console.error('[AQIMap] fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleUpdate = useCallback((z: number, c: [number, number]) => {
        setZoomLevel(z);
        setMapCenter(c);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>

            {/* ── Main Map Controller ── */}
            <MapContainer
                center={[22.5, 82.5]}
                zoom={7}
                style={{ height: '100%', width: '100%', background: '#020617' }}
                zoomControl
                preferCanvas={false}
            >
                <InitView center={[22.5, 82.5]} zoom={7} />
                <MapTracker onUpdate={handleUpdate} />
                
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; CARTO"
                    maxZoom={19}
                />

                {!showWards ? (
                    <StateLayerDynamic key="state-layer" data={stateData} />
                ) : (
                    <>
                        <WardLayerDynamic key={`ward-layer-${wardData.length}`} wardData={wardData} />
                        {isAdmin && <GridCircleLayerDynamic location={gridLocation} visible={showWards} zoom={zoomLevel} />}
                        {isAdmin && <WardCircleLayerDynamic wardData={wardData} visible={showWards} zoom={zoomLevel} />}
                    </>
                )}
            </MapContainer>
        </div>
    );
}

export default memo(AQIMap);
