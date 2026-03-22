/**
 * Grid Generation Service
 *
 * Generates a uniform 1 km grid of lat/lon points within a bounding box.
 * 1 km ≈ 0.009° latitude (and roughly similar at mid-latitudes for longitude).
 */

const MAX_POINTS = 2000;

// Pre-defined bounds for supported locations
const LOCATION_BOUNDS = {
    india:    { north: 30.0, south: 20.0, east: 85.0,  west: 70.0  }, // Focused on North-Central India
    delhi:    { north: 28.88, south: 28.40, east: 77.35, west: 76.84 },
    mumbai:   { north: 19.27, south: 18.89, east: 72.98, west: 72.77 },
    bangalore:{ north: 13.14, south: 12.83, east: 77.76, west: 77.46 },
    chennai:  { north: 13.23, south: 12.90, east: 80.33, west: 80.17 },
    hyderabad:{ north: 17.55, south: 17.30, east: 78.60, west: 78.30 },
    kolkata:  { north: 22.65, south: 22.45, east: 88.45, west: 88.28 },
    pune:     { north: 18.63, south: 18.43, east: 73.95, west: 73.75 },
    ahmedabad:{ north: 23.12, south: 22.94, east: 72.68, west: 72.50 },
    jaipur:   { north: 27.00, south: 26.80, east: 75.88, west: 75.70 },
    lucknow:  { north: 26.95, south: 26.75, east: 81.05, west: 80.85 },
};

/**
 * Returns bounding box for a given location string.
 * @param {string} location - lowercase location key
 * @returns {{ north: number, south: number, east: number, west: number } | null}
 */
const getLocationBounds = (location) => {
    return LOCATION_BOUNDS[location] || null;
};

/**
 * Generates a grid of points within the given bounds.
 * Uses ~1 km spacing (0.009°). Caps at MAX_POINTS.
 *
 * @param {{ north: number, south: number, east: number, west: number }} bounds
 * @returns {{ lat: number, lon: number }[]}
 */
const generateGrid = (bounds, location) => {
    const isIndia = location === 'india';
    const LAT_STEP = isIndia ? 0.2 : 0.009; // Use 20km steps for national view, 1km for cities
    const LON_STEP = isIndia ? 0.2 : 0.009;

    const points = [];
    for (let lat = bounds.south; lat <= bounds.north; lat += LAT_STEP) {
        for (let lon = bounds.west; lon <= bounds.east; lon += LON_STEP) {
            points.push({
                lat: parseFloat(lat.toFixed(6)),
                lon: parseFloat(lon.toFixed(6)),
            });
            if (points.length >= MAX_POINTS) return points;
        }
    }
    return points;
};

module.exports = {
    getLocationBounds,
    generateGrid,
    LOCATION_BOUNDS,
};
