const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    ward: { type: String, required: true },
    timestamp: { type: Date, required: true },
    predictedAqi: { type: Number, required: true },
    confidence: { type: Number },
    pollutantPredictions: {
        pm25: Number,
        pm10: Number,
        no2: Number,
    },
    modelId: { type: String },
}, { timestamps: true });

predictionSchema.index({ ward: 1, timestamp: 1 });

module.exports = mongoose.model('Prediction', predictionSchema);
