const axios = require('axios');
const Station = require('../models/Station');
const Measurement = require('../models/Measurement');
const logger = require('../utils/logger');

class IngestionService {
    constructor() {
        this.openAQBaseUrl = 'https://api.openaq.org/v2';
        this.openMeteoBaseUrl = 'https://api.open-meteo.com/v1/forecast';
    }

    async fetchOpenAQData(city = 'Delhi') {
        try {
            logger.info(`Fetching OpenAQ data for ${city}`);
            const response = await axios.get(`${this.openAQBaseUrl}/latest`, {
                params: { city, limit: 100 },
                headers: { 'X-API-Key': process.env.OPENAQ_API_KEY || '' }
            });

            const results = response.data.results;
            for (const result of results) {
                let station = await Station.findOne({ stationId: result.location });
                if (!station) {
                    station = await Station.create({
                        stationId: result.location,
                        name: result.location,
                        city: result.city,
                        coordinates: {
                            latitude: result.coordinates.latitude,
                            longitude: result.coordinates.longitude,
                        },
                        source: 'OpenAQ'
                    });
                }

                const pollutants = {};
                result.measurements.forEach(m => {
                    const key = m.parameter.replace('.', ''); // simple normalization
                    pollutants[key] = { value: m.value, unit: m.unit };
                });

                await Measurement.create({
                    station: station._id,
                    timestamp: new Date(result.measurements[0].lastUpdated),
                    pollutants
                });
            }
            logger.info(`Successfully ingested ${results.length} stations from OpenAQ`);
        } catch (error) {
            logger.error(`OpenAQ Ingestion Error: ${error.message}`);
        }
    }

    async fetchWeatherMetadata(lat, lon) {
        try {
            const response = await axios.get(this.openMeteoBaseUrl, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true
                }
            });
            return response.data.current_weather;
        } catch (error) {
            logger.error(`Open-Meteo Error: ${error.message}`);
            return null;
        }
    }
}

module.exports = new IngestionService();
