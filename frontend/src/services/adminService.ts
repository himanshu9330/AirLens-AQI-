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

export const getNationalHotspots = async (lat: number, lng: number) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_URL}/admin/national-hotspots?lat=${lat}&lng=${lng}`, {
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
