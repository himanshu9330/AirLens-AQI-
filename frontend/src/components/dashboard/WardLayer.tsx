'use client';
import { Polygon, Popup, Marker, useMap } from 'react-leaflet';
import { memo, useMemo, Fragment } from 'react';
import L from 'leaflet';

interface WardData {
    wardId: string;
    aqi: number;
    category: string;
    lat?: number;
    lon?: number;
    polygon?: [number, number][][]; // GeoJSON: [[[lon, lat], ...]]
}

interface WardLayerProps {
    wardData: WardData[];
}

const getColor = (aqi: number): string => {
    if (aqi <= 50)  return '#22c55e';
    if (aqi <= 100) return '#eab308';
    if (aqi <= 200) return '#f97316';
    if (aqi <= 300) return '#ef4444';
    return '#a855f7';
};

/**
 * Super-robust Ward Layer
 * Uses Leaflet Markers with DivIcons for permanent labels (bulletproof)
 * Uses high-contrast Polygons with flipped coordinates
 */
function WardLayer({ wardData }: WardLayerProps) {
    if (!wardData || wardData.length === 0) return null;

    return (
        <>
            {wardData.map((ward) => {
                const color = getColor(ward.aqi);
                
                // 1. FLIP COORDINATES: [lon, lat] -> [lat, lon] for Leaflet
                const leafletCoords = ward.polygon?.[0]?.map(coord => [coord[1], coord[0]]) as [number, number][];
                const center: [number, number] | null = ward.lat != null && ward.lon != null ? [ward.lat, ward.lon] : null;

                // 2. CREATE VOID ICON FOR LABEL: High visibility AQI badge
                const labelIcon = center ? L.divIcon({
                    className: 'custom-aqi-label',
                    html: `
                        <div style="
                            background: ${color};
                            color: white;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 11px;
                            font-weight: 900;
                            border: 1px solid rgba(255,255,255,0.4);
                            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
                            transform: translate(-50%, -50%);
                            pointer-events: none;
                        ">
                            ${ward.aqi}
                        </div>
                    `,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                }) : null;

                return (
                    <Fragment key={ward.wardId}>
                        {/* ── Boundary Polygon ── */}
                        {leafletCoords && leafletCoords.length > 0 && (
                            <Polygon
                                positions={leafletCoords}
                                pathOptions={{
                                    fillColor: color,
                                    fillOpacity: 0.4,
                                    color: '#ffffff', // Stark white border
                                    weight: 2,
                                    dashArray: '5, 5',
                                    lineJoin: 'round'
                                }}
                            >
                                <Popup>
                                    <div style={{ textAlign: 'center', color: '#f8fafc' }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>
                                            {ward.wardId.replace(/_/g, ' ')}
                                        </div>
                                        <div style={{ fontSize: 32, fontWeight: 900, color }}>{ward.aqi}</div>
                                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color }}>{ward.category}</div>
                                    </div>
                                </Popup>
                            </Polygon>
                        )}

                        {/* ── Permanent AQI Label ── */}
                        {center && labelIcon && (
                            <Marker 
                                position={center} 
                                icon={labelIcon} 
                                interactive={false}
                            />
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}

export default memo(WardLayer);
