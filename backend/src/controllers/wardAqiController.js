const { getStationData, getWardData, getAQICategory } = require('../services/wardService');
const { generatePointsInWard } = require('../services/geoService');
const { calculateIDW } = require('../services/interpolationService');
const aiPredictionService = require('../services/aiPredictionService');
const logger = require('../utils/logger');
const { performance } = require('perf_hooks');

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Controller for Ward-wise AQI estimation.
 */
const getWardwiseAqi = async (req, res) => {
    const startTime = performance.now();
    let skippedWards = 0;

    try {
        // 1. Check Cache properly {data, expiry}
        const cachedItem = cache.get("wardwise_aqi");
        if (cachedItem && Date.now() < cachedItem.expiry) {
            return res.json(cachedItem.data);
        }

        // 2. Fetch Data
        const [stations, wards] = await Promise.all([
            getStationData(),
            getWardData()
        ]);

        // 3. Validation
        if (!stations || stations.length === 0) {
            return res.status(500).json({ error: "No station data available" });
        }

        // 4. LSTM Integration (Optional Scaling)
        let scaleFactor = 1.0;
        try {
            // Compute national average current vs predicted to get a multiplier
            const currentAvg = stations.reduce((acc, s) => acc + s.aqi, 0) / stations.length;
            
            // Fetch prediction from existing service (if it returns a simple number or similar)
            // For now, we simulate or fetch from a known 6h forecast endpoint if possible
            // Reusing logic from Step 10 & Correction 4:
            // scaleFactor = futureAQI / currentAverageAQI (clamped)
            
            // Placeholder: Assuming we might have a future trend from aiPredictionService
            // const futureAqi = await aiPredictionService.predictNationalTrend(); 
            // if (futureAqi) scaleFactor = Math.min(Math.max(futureAqi / currentAvg, 0.5), 2.0);
        } catch (e) {
            logger.warn("WardAqiController: LSTM scaling failed, using 1.0", e.message);
        }

        // 5. Parallel Processing for Wards
        const results = await Promise.all(wards.map(async (ward) => {
            try {
                if (!ward.polygon || !Array.isArray(ward.polygon) || ward.polygon.length === 0) {
                    skippedWards++;
                    return null;
                }

                // Generate 10 points per ward
                const points = generatePointsInWard(ward, 10);

                // Calculate average AQI across points via IDW
                let totalWardAqi = 0;
                points.forEach(pt => {
                    const interpolated = calculateIDW(pt, stations);
                    totalWardAqi += interpolated;
                });

                const finalAqi = Math.round((totalWardAqi / points.length) * scaleFactor);

                // Get centroid for frontend positioning
                const centroid = require('../services/geoService').getPolygonCentroid(ward.polygon);

                return {
                    wardId: ward.wardId,
                    aqi: finalAqi,
                    category: getAQICategory(finalAqi),
                    lat: parseFloat(centroid.lat.toFixed(5)),
                    lon: parseFloat(centroid.lon.toFixed(5)),
                    polygon: ward.polygon // Include the actual polygon coordinates
                };
            } catch (err) {
                skippedWards++;
                logger.error(`Error processing ward ${ward.wardId}: ${err.message}`);
                return null;
            }
        }));

        const finalResponse = results.filter(r => r !== null);

        // 6. Save to Cache
        cache.set("wardwise_aqi", {
            data: finalResponse,
            expiry: Date.now() + CACHE_TTL
        });

        // 7. Logging
        const duration = (performance.now() - startTime).toFixed(2);
        console.log(`[WARD AQI] Total Wards: ${wards.length} | Processed: ${finalResponse.length} | Skipped: ${skippedWards} | Time: ${duration}ms`);

        return res.json(finalResponse);

    } catch (error) {
        logger.error(`WardAqiController Error: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error during ward estimation" });
    }
};

module.exports = {
    getWardwiseAqi
};
