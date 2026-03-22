'use client';
import { Circle, Popup } from 'react-leaflet';

interface GridPoint {
    lat: number;
    lon: number;
    aqi: number;
}

const getColor = (aqi: number): string => {
    if (aqi <= 50) return '#22c55e';   // green
    if (aqi <= 100) return '#eab308';  // yellow
    if (aqi <= 200) return '#f97316';  // orange
    if (aqi <= 300) return '#ef4444';  // red
    return '#a855f7';                  // purple
};

interface GridHeatmapProps {
    data: GridPoint[];
}

export default function GridHeatmap({ data }: GridHeatmapProps) {
    return (
        <>
            {data.map((point, idx) => (
                <Circle
                    key={`grid-${idx}`}
                    center={[point.lat, point.lon]}
                    radius={500}
                    pathOptions={{
                        color: getColor(point.aqi),
                        fillColor: getColor(point.aqi),
                        fillOpacity: 0.55,
                        weight: 1,
                    }}
                >
                    <Popup>
                        <div className="text-center p-1">
                            <strong className="block text-sm">AQI Station</strong>
                            <span
                                className="block text-2xl font-black mt-1"
                                style={{ color: getColor(point.aqi) }}
                            >
                                {point.aqi}
                            </span>
                            <span className="text-xs text-slate-400">
                                {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
                            </span>
                        </div>
                    </Popup>
                </Circle>
            ))}
        </>
    );
}
