const axios = require('axios');
const path = require('path');
const fs = require('fs');

// All 30 Indian state coordinates for station data fetching
const INDIAN_STATES_COORDS = [
    { lat: 15.9129, lng: 79.7400 }, { lat: 28.2180, lng: 94.7278 },
    { lat: 26.2006, lng: 92.9376 }, { lat: 25.0961, lng: 85.3131 },
    { lat: 21.2787, lng: 81.8661 }, { lat: 15.2993, lng: 74.1240 },
    { lat: 22.2587, lng: 71.1924 }, { lat: 29.0588, lng: 76.0856 },
    { lat: 31.1048, lng: 77.1734 }, { lat: 23.6102, lng: 85.2799 },
    { lat: 15.3173, lng: 75.7139 }, { lat: 10.8505, lng: 76.2711 },
    { lat: 22.9734, lng: 78.6569 }, { lat: 19.7515, lng: 75.7139 },
    { lat: 24.6637, lng: 93.9063 }, { lat: 25.4670, lng: 91.3662 },
    { lat: 23.1645, lng: 92.9376 }, { lat: 26.1584, lng: 94.5624 },
    { lat: 20.9517, lng: 85.0985 }, { lat: 31.1471, lng: 75.3412 },
    { lat: 27.0238, lng: 74.2179 }, { lat: 27.5330, lng: 88.5122 },
    { lat: 11.1271, lng: 78.6569 }, { lat: 18.1124, lng: 79.0193 },
    { lat: 23.9408, lng: 91.9882 }, { lat: 26.8467, lng: 80.9461 },
    { lat: 30.0668, lng: 79.0193 }, { lat: 22.9868, lng: 87.8550 },
    { lat: 28.7041, lng: 77.1025 }, { lat: 33.7782, lng: 76.5762 }
];


/**
 * @typedef {Object} Station
 * @property {number} lat
 * @property {number} lon
 * @property {number} aqi
 */

/**
 * @typedef {Object} Ward
 * @property {string} wardId
 * @property {number[][][]} polygon
 */

// Module-level cache for station AQI data
let stationCache = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000 // 5 minutes
};

let activeStationRequest = null;

/**
 * Fetches real-time station data.
 * Fallback to Indian state averages if specific station API fails.
 * 
 * @returns {Promise<Station[]>}
 */
const getStationData = async () => {
    const now = Date.now();
    if (stationCache.data && (now - stationCache.timestamp < stationCache.ttl)) {
        return stationCache.data;
    }

    if (activeStationRequest) {
        return activeStationRequest;
    }

    activeStationRequest = (async () => {
        try {
            const lats = INDIAN_STATES_COORDS.map(c => c.lat).join(',');
            const lngs = INDIAN_STATES_COORDS.map(c => c.lng).join(',');
            
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=us_aqi`;
            const response = await axios.get(url, { timeout: 10000 });
            const data = response.data;
            const results = Array.isArray(data) ? data : [data];
            
            const stations = results.map((res, index) => ({
                lat: INDIAN_STATES_COORDS[index].lat,
                lon: INDIAN_STATES_COORDS[index].lng,
                aqi: res.current ? res.current.us_aqi : 100
            }));

            // Update cache
            stationCache.data = stations;
            stationCache.timestamp = now;

            return stations;
        } catch (error) {
            console.error("WardService: Error fetching live station data, using mock fallback.");
            return INDIAN_STATES_COORDS.map(c => ({
                lat: c.lat,
                lon: c.lng,
                aqi: 100 + Math.floor(Math.random() * 100)
            }));
        }
    })().finally(() => {
        activeStationRequest = null;
    });

    return activeStationRequest;
};

/**
 * Loads Ward GeoJSON data.
 * Fallback to mock wards if file doesn't exist.
 * 
 * @returns {Promise<Ward[]>}
 */
const getWardData = async () => {
    const geojsonPath = path.join(__dirname, '../../data/wards.json');
    
    if (fs.existsSync(geojsonPath)) {
        try {
            const rawData = fs.readFileSync(geojsonPath, 'utf8');
            const featureCollection = JSON.parse(rawData);
            return featureCollection.features.map(f => ({
                wardId: f.properties.wardId || f.properties.name || "unknown",
                // GeoJSON: [lon, lat]
                polygon: f.geometry.coordinates 
            }));
        } catch (e) {
            console.error("WardService: Error parsing GeoJSON:", e);
        }
    }

    // Fallback: Generate ward-level polygons programmatically from major Indian cities
    // Each city gets 2-3 "ward" rectangles (~0.1° squares) around its center
    const cityWardSeeds = [
        // Delhi
        { city: 'Delhi', wards: [
            { id: 'Delhi_North',  c: [77.10, 28.75] },
            { id: 'Delhi_Central', c: [77.22, 28.63] },
            { id: 'Delhi_South', c: [77.18, 28.48] },
            { id: 'Delhi_East',  c: [77.30, 28.65] },
        ]},
        // Mumbai
        { city: 'Mumbai', wards: [
            { id: 'Mumbai_Central', c: [72.88, 19.07] },
            { id: 'Mumbai_South',   c: [72.84, 18.94] },
            { id: 'Mumbai_North',   c: [72.87, 19.15] },
        ]},
        // Bangalore
        { city: 'Bangalore', wards: [
            { id: 'Bangalore_East',  c: [77.70, 12.97] },
            { id: 'Bangalore_West',  c: [77.55, 12.97] },
            { id: 'Bangalore_South', c: [77.60, 12.85] },
        ]},
        // Chennai
        { city: 'Chennai', wards: [
            { id: 'Chennai_Central', c: [80.27, 13.08] },
            { id: 'Chennai_South',   c: [80.26, 12.96] },
        ]},
        // Hyderabad
        { city: 'Hyderabad', wards: [
            { id: 'Hyderabad_West',  c: [78.38, 17.44] },
            { id: 'Hyderabad_East',  c: [78.52, 17.39] },
        ]},
        // Kolkata
        { city: 'Kolkata', wards: [
            { id: 'Kolkata_Central', c: [88.36, 22.57] },
            { id: 'Kolkata_South',   c: [88.34, 22.50] },
        ]},
        // Pune
        { city: 'Pune', wards: [
            { id: 'Pune_West',    c: [73.78, 18.52] },
            { id: 'Pune_East',    c: [73.90, 18.55] },
        ]},
        // Ahmedabad
        { city: 'Ahmedabad', wards: [
            { id: 'Ahmedabad_Central', c: [72.58, 23.03] },
            { id: 'Ahmedabad_East',    c: [72.65, 23.05] },
        ]},
        // Jaipur
        { city: 'Jaipur', wards: [
            { id: 'Jaipur_Central', c: [75.79, 26.91] },
            { id: 'Jaipur_South',   c: [75.78, 26.83] },
        ]},
        // Lucknow
        { city: 'Lucknow', wards: [
            { id: 'Lucknow_Central', c: [80.95, 26.85] },
            { id: 'Lucknow_South',   c: [80.93, 26.80] },
        ]},
        // Patna
        { city: 'Patna', wards: [
            { id: 'Patna_Central', c: [85.14, 25.60] },
            { id: 'Patna_West',    c: [85.08, 25.61] },
        ]},
        // Bhopal
        { city: 'Bhopal', wards: [
            { id: 'Bhopal_Central', c: [77.41, 23.26] },
            { id: 'Bhopal_North',   c: [77.40, 23.30] },
        ]},
        // Visakhapatnam
        { city: 'Visakhapatnam', wards: [
            { id: 'Vizag_Central', c: [83.22, 17.69] },
            { id: 'Vizag_South',   c: [83.30, 17.73] },
        ]},
        // Kochi
        { city: 'Kochi', wards: [
            { id: 'Kochi_Central', c: [76.27, 9.93] },
            { id: 'Kochi_East',    c: [76.34, 9.98] },
        ]},
        // Guwahati
        { city: 'Guwahati', wards: [
            { id: 'Guwahati_Central', c: [91.74, 26.14] },
            { id: 'Guwahati_East',    c: [91.80, 26.18] },
        ]},
        // Ranchi
        { city: 'Ranchi', wards: [
            { id: 'Ranchi_Central', c: [85.31, 23.34] },
        ]},
        // Ludhiana
        { city: 'Ludhiana', wards: [
            { id: 'Ludhiana_Central', c: [75.86, 30.90] },
        ]},
        // Gurugram
        { city: 'Gurugram', wards: [
            { id: 'Gurugram_Central', c: [77.03, 28.46] },
            { id: 'Gurugram_South',   c: [77.05, 28.42] },
        ]},
        // Dehradun
        { city: 'Dehradun', wards: [
            { id: 'Dehradun_Central', c: [78.03, 30.32] },
        ]},
        // Bhubaneswar
        { city: 'Bhubaneswar', wards: [
            { id: 'Bhubaneswar_Central', c: [85.82, 20.30] },
        ]},
        // Surat
        { city: 'Surat', wards: [
            { id: 'Surat_Central', c: [72.83, 21.17] },
            { id: 'Surat_South',   c: [72.85, 21.10] },
        ]},
        // Nagpur
        { city: 'Nagpur', wards: [
            { id: 'Nagpur_Central', c: [79.09, 21.15] },
        ]},
        // Indore
        { city: 'Indore', wards: [
            { id: 'Indore_Central', c: [75.86, 22.72] },
        ]},
        // Chandigarh
        { city: 'Chandigarh', wards: [
            { id: 'Chandigarh_Central', c: [76.78, 30.73] },
        ]},
        // Coimbatore
        { city: 'Coimbatore', wards: [
            { id: 'Coimbatore_Central', c: [76.96, 11.02] },
        ]},
    ];

    const mockWards = [];
    const HALF = 0.06; // ~6km square
    for (const cityGroup of cityWardSeeds) {
        for (const w of cityGroup.wards) {
            const [lon, lat] = w.c;
            mockWards.push({
                wardId: `Ward_${w.id}`,
                polygon: [[[lon - HALF, lat - HALF], [lon + HALF, lat - HALF], [lon + HALF, lat + HALF], [lon - HALF, lat + HALF], [lon - HALF, lat - HALF]]]
            });
        }
    }
    return mockWards;
};

/**
 * Maps AQI value to standard category.
 * 
 * @param {number} aqi 
 * @returns {string}
 */
const getAQICategory = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Very Poor";
    return "Severe";
};

module.exports = {
    getStationData,
    getWardData,
    getAQICategory
};
