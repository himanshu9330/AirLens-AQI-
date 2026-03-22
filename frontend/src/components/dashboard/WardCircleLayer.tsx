'use client';
import { Circle, Popup, Tooltip } from 'react-leaflet';
import { memo, Fragment, useMemo } from 'react';

interface WardData {
    wardId: string;
    aqi: number;
    category: string;
    lat?: number;
    lon?: number;
    polygon?: [number, number][][];
}

interface WardCircleLayerProps {
    wardData: WardData[];
    visible?: boolean;
    zoom?: number;
}

/**
 * Returns a color based on AQI value (standard EPA scale).
 */
function getAQIColor(aqi: number): string {
    if (aqi <= 50)  return '#22c55e';  // Good – green
    if (aqi <= 100) return '#eab308';  // Moderate – yellow
    if (aqi <= 150) return '#f97316';  // Unhealthy for Sensitive – orange
    if (aqi <= 200) return '#ef4444';  // Unhealthy – red
    if (aqi <= 300) return '#a855f7';  // Very Unhealthy – purple
    return '#991b1b';                   // Hazardous – dark red
}

/**
 * Zoom-adaptive radius for ward circles.
 * Ward circles are slightly larger than grid circles for emphasis.
 */
function getWardRadius(zoom: number): number {
    if (zoom >= 14) return 600;
    if (zoom >= 13) return 500;
    if (zoom >= 12) return 450;
    if (zoom >= 11) return 400;
    if (zoom >= 10) return 350;
    return 300;
}

/**
 * WardCircleLayer — AQI-Colored Edition
 *
 * Renders a circle at each ward's centroid with:
 *   - AQI-based coloring (green → red → purple)
 *   - Zoom-adaptive radius to prevent overlap
 *   - Prominent borders for visual distinction from the grid layer
 */
function WardCircleLayer({ wardData, visible = true, zoom = 10 }: WardCircleLayerProps) {
    if (!visible || !wardData || wardData.length === 0) return null;

    const radius = getWardRadius(zoom);

    // Filter only wards with coordinates
    const validWards = useMemo(
        () => wardData.filter((w) => w.lat != null && w.lon != null),
        [wardData]
    );

    return (
        <>
            {validWards.map((ward) => {
                const center: [number, number] = [ward.lat!, ward.lon!];
                const color = getAQIColor(ward.aqi);

                return (
                    <Fragment key={ward.wardId}>
                        <Circle
                            center={center}
                            radius={radius}
                            pathOptions={{
                                fillColor: color,
                                fillOpacity: 0.35,
                                weight: 2,
                                color: color,
                                opacity: 0.8,
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -10]} sticky>
                                <div style={{ fontFamily: 'sans-serif', fontSize: 11, textAlign: 'center', minWidth: 100 }}>
                                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                                        {ward.wardId.replace(/Ward_/g, '').replace(/_/g, ' ')}
                                    </div>
                                    <div style={{
                                        fontSize: 16, fontWeight: 900,
                                        color: color,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}>
                                        AQI {ward.aqi}
                                    </div>
                                    <div style={{
                                        fontSize: 9, fontWeight: 600,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {ward.category}
                                    </div>
                                </div>
                            </Tooltip>
                            <Popup>
                                <div style={{ textAlign: 'center', padding: 4 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                                        WARD DETAILS
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                                        {ward.wardId.replace(/Ward_/g, '').replace(/_/g, ' ')}
                                    </div>
                                    <div style={{
                                        fontSize: 20, fontWeight: 900, color,
                                        margin: '4px 0'
                                    }}>
                                        AQI {ward.aqi}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#94a3b8' }}>
                                        {ward.lat!.toFixed(4)}, {ward.lon!.toFixed(4)}
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                    </Fragment>
                );
            })}
        </>
    );
}

export default memo(WardCircleLayer);
