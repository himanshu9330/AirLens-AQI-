const axios = require('axios');
const Prediction = require('../models/Prediction');
const logger = require('../utils/logger');

class MLService {
    constructor() {
        this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001/ml';
    }

    async generatePredictions(ward) {
        try {
            logger.info(`Requesting ML predictions for ${ward} from Python service`);

            const response = await axios.post(`${this.mlServiceUrl}/predict-aqi`, {
                ward,
                current_aqi: 150, // This would be fetched from database
            });

            const forecast = response.data.forecast;
            const now = new Date();
            const predictions = forecast.map((f, i) => ({
                ward,
                timestamp: new Date(now.getTime() + (i + 1) * 3600000),
                predictedAqi: f.predicted_aqi,
                confidence: f.confidence,
                pollutantPredictions: {
                    pm25: f.predicted_aqi * 0.4, // Simplified
                    pm10: f.predicted_aqi * 0.6
                },
                modelId: response.data.model_version
            }));

            await Prediction.insertMany(predictions);
            logger.info(`Successfully integrated Python predictions for ${ward}`);
        } catch (error) {
            logger.error(`Node MLService Error: ${error.message}`);
        }
    }

    async detectPollutionSource(wardData) {
        try {
            const response = await axios.post(`${this.mlServiceUrl}/predict-source`, {
                pm25: wardData.pm25,
                pm10: wardData.pm10,
                no2: wardData.no2 || 0
            });
            return response.data.source;
        } catch (error) {
            logger.error(`Source Detection Error: ${error.message}`);
            return 'Unknown';
        }
    }
}

module.exports = new MLService();
