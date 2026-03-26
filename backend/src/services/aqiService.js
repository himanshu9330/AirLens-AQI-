const axios = require('axios');
const logger = require('../utils/logger');

// Predefined coordinates for Indian states (roughly center points)
const INDIAN_STATES_COORDS = [
    { name: "AP", lat: 15.9129, lng: 79.7400 }, { name: "AR", lat: 28.2180, lng: 94.7278 },
    { name: "AS", lat: 26.2006, lng: 92.9376 }, { name: "BR", lat: 25.0961, lng: 85.3131 },
    { name: "CT", lat: 21.2787, lng: 81.8661 }, { name: "GA", lat: 15.2993, lng: 74.1240 },
    { name: "GJ", lat: 22.2587, lng: 71.1924 }, { name: "HR", lat: 29.0588, lng: 76.0856 },
    { name: "HP", lat: 31.1048, lng: 77.1734 }, { name: "JH", lat: 23.6102, lng: 85.2799 },
    { name: "KA", lat: 15.3173, lng: 75.7139 }, { name: "KL", lat: 10.8505, lng: 76.2711 },
    { name: "MP", lat: 22.9734, lng: 78.6569 }, { name: "MH", lat: 19.7515, lng: 75.7139 },
    { name: "MN", lat: 24.6637, lng: 93.9063 }, { name: "ML", lat: 25.4670, lng: 91.3662 },
    { name: "MZ", lat: 23.1645, lng: 92.9376 }, { name: "NL", lat: 26.1584, lng: 94.5624 },
    { name: "OR", lat: 20.9517, lng: 85.0985 }, { name: "PB", lat: 31.1471, lng: 75.3412 },
    { name: "RJ", lat: 27.0238, lng: 74.2179 }, { name: "SK", lat: 27.5330, lng: 88.5122 },
    { name: "TN", lat: 11.1271, lng: 78.6569 }, { name: "TS", lat: 18.1124, lng: 79.0193 },
    { name: "TR", lat: 23.9408, lng: 91.9882 }, { name: "UP", lat: 26.8467, lng: 80.9461 },
    { name: "UK", lat: 30.0668, lng: 79.0193 }, { name: "WB", lat: 22.9868, lng: 87.8550 },
    { name: "DL", lat: 28.7041, lng: 77.1025 }, { name: "JK", lat: 33.7782, lng: 76.5762 }
];

// Module-level cache for national AQI data
let nationalCache = {
    data: null,
    timestamp: 0,
    ttl: 10 * 60 * 1000, // 10 minutes for success
    errorTtl: 1 * 60 * 1000 // 1 minute for errors
};

let activeNationalRequest = null;

/**
 * Fetches real-time and historical AQI data using Open-Meteo API.
 */
const fetchNationalAQIData = async () => {
    const now = Date.now();
    
    // Check cache
    if (nationalCache.data && (now - nationalCache.timestamp < nationalCache.ttl)) {
        return nationalCache.data;
    }
    
    // Check if we recently failed (prevent hammering)
    if (nationalCache.isError && (now - nationalCache.timestamp < nationalCache.errorTtl)) {
        console.warn('[AQI] Within error-backoff period, using fallback');
        return nationalCache.data; // Return last known good or null
    }

    // Request Locking
    if (activeNationalRequest) {
        return activeNationalRequest;
    }

    activeNationalRequest = (async () => {
        try {
            const lats = INDIAN_STATES_COORDS.map(c => c.lat).join(',');
            const lngs = INDIAN_STATES_COORDS.map(c => c.lng).join(',');
            
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&hourly=us_aqi&current=us_aqi&past_days=1`;
            
            console.log(`[AQI] Fetching national data for ${INDIAN_STATES_COORDS.length} regions...`);
            const response = await axios.get(url, { timeout: 15000 });
            const data = response.data;
            
            const results = Array.isArray(data) ? data : [data];
            const allHourlyUsAqi = [];
            const allCurrentUsAqi = [];
            
            results.forEach(res => {
                if (res.hourly && res.hourly.us_aqi) allHourlyUsAqi.push(res.hourly.us_aqi);
                if (res.current && res.current.us_aqi) allCurrentUsAqi.push(res.current.us_aqi);
            });
            
            if (allHourlyUsAqi.length === 0) throw new Error('No valid AQI data returned from API');

            // Calculate averages
            const numPoints = allHourlyUsAqi.length;
            const timeSteps = allHourlyUsAqi[0].length;
            const avgHourly = [];
            for (let t = 0; t < timeSteps; t++) {
                let sum = 0;
                let validPoints = 0;
                allHourlyUsAqi.forEach(history => { 
                    if (history[t] !== null && history[t] !== undefined) {
                        sum += history[t]; 
                        validPoints++;
                    }
                });
                
                if (validPoints > 0) {
                    avgHourly.push(Math.round(sum / validPoints));
                } else {
                    // If the entire country returned null for this hour, carry forward the previous hour to avoid 0s
                    const lastValid = avgHourly.length > 0 ? avgHourly[avgHourly.length - 1] : 65;
                    avgHourly.push(lastValid);
                }
            }

            const history24h = avgHourly.slice(-24);
            const currentSum = allCurrentUsAqi.reduce((a, b) => a + b, 0);
            const currentAvg = Math.round(currentSum / allCurrentUsAqi.length);
            
            const result = {
                currentAqi: currentAvg,
                history24h: history24h,
                source: 'Open-Meteo API'
            };

            // Update cache (Success)
            nationalCache = {
                data: result,
                timestamp: now,
                ttl: 10 * 60 * 1000,
                errorTtl: 1 * 60 * 1000,
                isError: false
            };

            return result;
        } catch (error) {
            const is429 = error.response && error.response.status === 429;
            logger.error(`AQI Service Error [${is429 ? '429-RateLimit' : 'General'}]: ${error.message}`);
            
            // Update cache (Error State) to prevent immediate retry
            nationalCache.timestamp = now;
            nationalCache.isError = true;
            
            return nationalCache.data; // Return stale data if exists
        }
    })().finally(() => {
        activeNationalRequest = null;
    });

    return activeNationalRequest;
};

module.exports = {
    fetchNationalAQIData,
    INDIAN_STATES_COORDS
};
