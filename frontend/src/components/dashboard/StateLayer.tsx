'use client';
import React, { memo } from 'react';
import { CircleMarker, Tooltip, Popup } from 'react-leaflet';

export interface StateAQIData {
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
    status: string;
    pm2_5?: number;
    no2?: number;
    windSpeed?: number;
}

interface StateLayerProps {
    data: StateAQIData[];
}

const getColor = (aqi: number): string => {
    if (aqi <= 50)  return '#22c55e';
    if (aqi <= 100) return '#eab308';
    if (aqi <= 200) return '#f97316';
    if (aqi <= 300) return '#ef4444';
    return '#a855f7';
};

const getRadius = (aqi: number): number =>
    Math.max(20, Math.min(55, aqi / 4));

function StateLayer({ data }: StateLayerProps) {
    if (!data || data.length === 0) return null;

    return (
        <>
            {data.map((state) => {
                const color = getColor(state.aqi);
                return (
                    <CircleMarker
                        key={state.id}
                        center={[state.lat, state.lng]}
                        radius={getRadius(state.aqi)}
                        pathOptions={{
                            color,
                            fillColor: color,
                            fillOpacity: 0.45,
                            weight: 1.5,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.97} sticky>
                            <div style={{ fontFamily: 'sans-serif', textAlign: 'center', minWidth: 110 }}>
                                <strong style={{ fontSize: 12, color: '#0f172a', display: 'block', marginBottom: 2, fontWeight: 800 }}>
                                    {state.name}
                                </strong>
                                <span style={{ fontSize: 22, fontWeight: 900, color, display: 'block', lineHeight: 1 }}>
                                    {state.aqi}
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginTop: 2 }}>
                                    {state.status}
                                </span>
                            </div>
                        </Tooltip>
                        <Popup>
                            <div style={{ fontFamily: 'sans-serif', textAlign: 'center', minWidth: 200 }}>
                                <strong style={{ fontSize: 13, color: '#e2e8f0', display: 'block', marginBottom: 6 }}>
                                    {state.name}
                                </strong>
                                <div style={{ padding: '10px', background: '#1e293b', borderRadius: 10, border: '1px solid #334155', marginBottom: 8 }}>
                                    <span style={{ color, fontSize: 32, fontWeight: 900, display: 'block', lineHeight: 1 }}>{state.aqi}</span>
                                    <span style={{ color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{state.status}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                    {state.pm2_5 != null && (
                                        <div style={{ background: '#0f172a', padding: '6px', borderRadius: 8, border: '1px solid #1e293b' }}>
                                            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PM2.5</div>
                                            <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 800 }}>{state.pm2_5} μg/m³</div>
                                        </div>
                                    )}
                                    {state.no2 != null && (
                                        <div style={{ background: '#0f172a', padding: '6px', borderRadius: 8, border: '1px solid #1e293b' }}>
                                            <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>NO₂</div>
                                            <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 800 }}>{state.no2} ppb</div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: 8, fontSize: 10, color: '#64748b' }}>
                                    🔍 Zoom in for ward-level detail
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </>
    );
}

export default memo(StateLayer);
