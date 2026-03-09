const Measurement = require('../models/Measurement');
const WardHourly = require('../models/WardHourly');
const logger = require('../utils/logger');

class ProcessingService {
    // Simple AQI calculation placeholder based on PM2.5 (Simplified Indian AQI logic)
    calculateAQI(pm25) {
        if (pm25 <= 30) return (pm25 * 50 / 30);
        if (pm25 <= 60) return 50 + (pm25 - 30) * 50 / 30;
        if (pm25 <= 90) return 100 + (pm25 - 60) * 100 / 30;
        if (pm25 <= 120) return 200 + (pm25 - 90) * 100 / 30;
        if (pm25 <= 250) return 300 + (pm25 - 120) * 100 / 130;
        return 400 + (pm25 - 250) * 100 / 130;
    }

    async processWardData() {
        try {
            // In a real system, we'd use GIS data to map stations to wards. 
            // Here we aggregate by station as a proxy for hyper-local areas.
            const measurements = await Measurement.find().sort({ timestamp: -1 }).limit(100);

            const wardGroups = {};
            measurements.forEach(m => {
                const ward = 'Ward-' + (m.station.toString().substring(0, 3)); // Mock ward mapping
                if (!wardGroups[ward]) {
                    wardGroups[ward] = { aqiSum: 0, count: 0, pm25Sum: 0 };
                }
                const pm25 = m.pollutants.pm25?.value || 0;
                const aqi = this.calculateAQI(pm25);
                wardGroups[ward].aqiSum += aqi;
                wardGroups[ward].pm25Sum += pm25;
                wardGroups[ward].count += 1;
            });

            for (const [ward, data] of Object.entries(wardGroups)) {
                await WardHourly.create({
                    ward,
                    city: 'Delhi',
                    timestamp: new Date(),
                    avgAqi: data.aqiSum / data.count,
                    pollutantAverages: {
                        pm25: data.pm25Sum / data.count
                    }
                });
            }
            logger.info('Ward data processing completed');
        } catch (error) {
            logger.error(`Processing Error: ${error.message}`);
        }
    }
}

module.exports = new ProcessingService();
