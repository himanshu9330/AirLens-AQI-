/**
 * @typedef {Object} Station
 * @property {number} lat
 * @property {number} lon
 * @property {number} aqi
 */

/**
 * @typedef {Object} Point
 * @property {number} lat
 * @property {number} lon
 */

const MAX_DISTANCE_KM = 50;
const EPSILON = 0.0001;

/**
 * Calculates accurate geospatial distance between two points.
 * 
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
const getHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Estimates AQI at a coordinate point using Inverse Distance Weighting.
 * 
 * @param {Point} point 
 * @param {Station[]} stations 
 * @returns {number} Estimated AQI
 */
const calculateIDW = (point, stations) => {
    let numerator = 0;
    let denominator = 0;
    let minDistance = Infinity;
    let nearestStationAqi = 0;
    let stationsInRange = 0;

    for (const station of stations) {
        const distance = getHaversineDistance(point.lat, point.lon, station.lat, station.lon);
        
        // Exact station match or extremely close
        if (distance < EPSILON) return station.aqi;

        if (distance < minDistance) {
            minDistance = distance;
            nearestStationAqi = station.aqi;
        }

        if (distance <= MAX_DISTANCE_KM) {
            // Weight logic: 1 / d^2
            const weight = 1 / Math.pow(distance, 2);
            numerator += station.aqi * weight;
            denominator += weight;
            stationsInRange++;
        }
    }

    // Fallback: If no stations within 50km, use the nearest one
    if (stationsInRange === 0 || denominator === 0) {
        return nearestStationAqi;
    }

    return numerator / denominator;
};

module.exports = {
    calculateIDW,
    getHaversineDistance
};
