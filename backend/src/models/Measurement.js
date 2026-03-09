const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    timestamp: { type: Date, required: true },
    pollutants: {
        pm25: { value: Number, unit: String },
        pm10: { value: Number, unit: String },
        no2: { value: Number, unit: String },
        so2: { value: Number, unit: String },
        co: { value: Number, unit: String },
        o3: { value: Number, unit: String },
    },
    aqi: { type: Number },
}, { timestamps: true });

measurementSchema.index({ station: 1, timestamp: -1 });

module.exports = mongoose.model('Measurement', measurementSchema);
