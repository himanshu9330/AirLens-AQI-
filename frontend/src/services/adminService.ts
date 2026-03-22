const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getAdminStats = async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
};

export const getAdminChartData = async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/chart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch admin chart data');
    return response.json();
};

export const getNationalHotspots = async (level: string = 'state', state?: string, city?: string) => {
    const token = localStorage.getItem('adminToken');
    let url = `${API_URL}/admin/national-hotspots?level=${level}`;
    if (state) url += `&state=${encodeURIComponent(state)}`;
    if (city) url += `&city=${encodeURIComponent(city)}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch national hotspots');
    return response.json();
};
export const getDetailedAlerts = async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/detailed-alerts`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch detailed alerts');
    return response.json();
};

export const getDetailedPredictions = async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/detailed-predictions`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch detailed predictions');
    return response.json();
};

export const dispatchStateAlert = async (state: string, aqi: number) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/dispatch-alert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ state, aqi })
    });
    if (!response.ok) throw new Error('Failed to dispatch alert');
    return response.json();
};

export const getModelAccuracyMetrics = async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/accuracy-metrics`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch model accuracy metrics');
    return response.json();
};

export const getWardwiseAqi = async () => {
    const response = await fetch(`${API_URL}/aqi/wardwise`);
    if (!response.ok) throw new Error('Failed to fetch ward-wise AQI data');
    return response.json();
};

export const getHyperlocalAqi = async () => {
    // Falls back to national hotspots as grid source until dedicated endpoint is added
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/national-hotspots?level=state`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch hyperlocal AQI data');
    const data = await response.json();
    // Normalize to {lat, lon, aqi} format
    return (data || []).map((d: any) => ({ lat: d.lat, lon: d.lng, aqi: d.aqi }));
};

export const getGridData = async (location: string = 'india') => {
    const response = await fetch(`${API_URL}/grid?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error('Failed to fetch grid data');
    return response.json();
};

