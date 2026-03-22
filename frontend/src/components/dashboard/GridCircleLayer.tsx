'use client';
import { useEffect, useState, useMemo, memo } from 'react';
import { Circle, Tooltip, useMap } from 'react-leaflet';

interface GridPoint {
    lat: number;
    lon: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Zoom-adaptive radius: at higher zoom levels, circles are larger and more
 * detailed. At lower zooms they shrink so they don't form a solid blob.
 */
function getRadiusForZoom(zoom: number): number {
    if (zoom >= 14) return 500;
    if (zoom >= 13) return 400;
    if (zoom >= 12) return 350;
    if (zoom >= 11) return 300;
    if (zoom >= 10) return 250;
    return 200;
}

/**
 * Spatial decimation factor: skip every Nth point at lower zoom levels
 * to prevent overlap. At high zoom, show all points.
 */
function getDecimationFactor(zoom: number, totalPoints: number): number {
    if (zoom >= 13) return 1;            // Show all
    if (zoom >= 12) return 2;            // Show every 2nd
    if (zoom >= 11) return 3;            // Show every 3rd
    if (zoom >= 10) return 4;            // Show every 4th
    if (totalPoints > 500) return 8;     // Heavy decimation for large grids
    return 4;
}

/**
 * GridCircleLayer — Zoom-Adaptive Edition
 *
 * Fetches a 1 km grid from the backend and renders each point as a
 * translucent circle on the Leaflet map. Uses:
 *   - Zoom-adaptive radius (smaller at low zoom, larger when zoomed in)
 *   - Spatial decimation (skip points at lower zoom to reduce clutter)
 *   - Viewport culling (only render points within the current map bounds)
 */
function GridCircleLayer({
    location = 'delhi',
    visible = true,
    zoom = 10,
}: {
    location?: string;
    visible?: boolean;
    zoom?: number;
}) {
    const [grid, setGrid] = useState<GridPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const map = useMap();

    useEffect(() => {
        if (!visible) return;

        let cancelled = false;

        const fetchGrid = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/grid?location=${encodeURIComponent(location)}`);
                if (!res.ok) throw new Error(`Grid fetch failed: ${res.status}`);
                const data: GridPoint[] = await res.json();
                if (!cancelled) setGrid(data);
            } catch (err) {
                console.error('[GridCircleLayer] fetch error:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchGrid();
        return () => { cancelled = true; };
    }, [location, visible]);

    // Compute visible + decimated points based on zoom and viewport
    const visiblePoints = useMemo(() => {
        if (!visible || grid.length === 0) return [];

        const bounds = map.getBounds();
        const pad = 0.02; // Small padding beyond viewport
        const north = bounds.getNorth() + pad;
        const south = bounds.getSouth() - pad;
        const east = bounds.getEast() + pad;
        const west = bounds.getWest() - pad;

        // 1. Viewport culling
        const inView = grid.filter(
            (pt) => pt.lat >= south && pt.lat <= north && pt.lon >= west && pt.lon <= east
        );

        // 2. Spatial decimation
        const factor = getDecimationFactor(zoom, inView.length);
        if (factor <= 1) return inView;
        return inView.filter((_, idx) => idx % factor === 0);
    }, [grid, zoom, visible, map]);

    const radius = getRadiusForZoom(zoom);

    if (!visible || visiblePoints.length === 0) return null;

    return (
        <>
            {visiblePoints.map((pt, idx) => (
                <Circle
                    key={`grid-${pt.lat}-${pt.lon}`}
                    center={[pt.lat, pt.lon]}
                    radius={radius}
                    pathOptions={{
                        fillColor: '#3b82f6',
                        fillOpacity: 0.15,
                        weight: 1,
                        color: '#60a5fa',
                        opacity: 0.4,
                    }}
                >
                    <Tooltip direction="top" offset={[0, -10]}>
                        <div style={{ fontFamily: 'sans-serif', fontSize: 11, textAlign: 'center' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>Grid Zone</div>
                            <div style={{ color: '#475569', fontSize: 10 }}>
                                {pt.lat.toFixed(4)}, {pt.lon.toFixed(4)}
                            </div>
                        </div>
                    </Tooltip>
                </Circle>
            ))}
        </>
    );
}

export default memo(GridCircleLayer);
