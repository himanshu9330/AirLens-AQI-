/**
 * @typedef {Object} Point
 * @property {number} lat
 * @property {number} lon
 */

/**
 * @typedef {Object} Ward
 * @property {string} wardId
 * @property {number[][][]} polygon - GeoJSON format [[[lon, lat], ...]]
 */

/**
 * Checks if a point is inside a polygon using the Ray-Casting algorithm.
 * Handles GeoJSON coordinate order [lon, lat].
 * 
 * @param {Point} point 
 * @param {number[][][]} polygon 
 * @returns {boolean}
 */
const isPointInsidePolygon = (point, polygon) => {
    // GeoJSON polygon can have holes, but for simplicity we use the exterior ring (index 0)
    const ring = polygon[0];
    let inside = false;
    
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0], yi = ring[i][1];
        const xj = ring[j][0], yj = ring[j][1];
        
        // Raycasting logic: point.lon is x, point.lat is y
        const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
            (point.lon < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
            
        if (intersect) inside = !inside;
    }
    
    return inside;
};

/**
 * Calculates the bounding box of a polygon.
 * 
 * @param {number[][][]} polygon 
 */
const getBoundingBox = (polygon) => {
    const ring = polygon[0];
    let minLat = ring[0][1], maxLat = ring[0][1];
    let minLon = ring[0][0], maxLon = ring[0][0];
    
    for (const [lon, lat] of ring) {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
    }
    
    return { minLat, maxLat, minLon, maxLon };
};

/**
 * Simple polygon centroid calculation as a safety fallback.
 * 
 * @param {number[][][]} polygon 
 * @returns {Point}
 */
const getPolygonCentroid = (polygon) => {
    const ring = polygon[0];
    let latSum = 0, lonSum = 0;
    
    for (const [lon, lat] of ring) {
        latSum += lat;
        lonSum += lon;
    }
    
    return {
        lat: latSum / ring.length,
        lon: lonSum / ring.length
    };
};

/**
 * Generates N validated points inside a ward polygon.
 * 
 * @param {Ward} ward 
 * @param {number} numPoints 
 * @returns {Point[]}
 */
const generatePointsInWard = (ward, numPoints = 10) => {
    const points = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 100;
    
    const { minLat, maxLat, minLon, maxLon } = getBoundingBox(ward.polygon);
    
    while (points.length < numPoints && attempts < MAX_ATTEMPTS) {
        const testPoint = {
            lat: minLat + Math.random() * (maxLat - minLat),
            lon: minLon + Math.random() * (maxLon - minLon)
        };
        
        if (isPointInsidePolygon(testPoint, ward.polygon)) {
            points.push(testPoint);
        }
        attempts++;
    }
    
    // Fallback if no points found after 100 attempts
    if (points.length === 0) {
        points.push(getPolygonCentroid(ward.polygon));
    }
    
    return points;
};

module.exports = {
    isPointInsidePolygon,
    generatePointsInWard,
    getPolygonCentroid
};
