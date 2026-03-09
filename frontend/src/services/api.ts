import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const wardService = {
    getWards: () => api.get('/wards'),
    getWardCurrent: (id: string) => api.get(`/wards/${id}/current`),
    getWardHistory: (id: string) => api.get(`/wards/${id}/history`),
    getWardPrediction: (id: string) => api.get(`/wards/${id}/prediction`),
};

export const authService = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (userData: any) => api.post('/auth/register', userData),
};

export default api;
