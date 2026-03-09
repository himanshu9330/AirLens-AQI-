const mongoose = require('mongoose');

const wardHourlySchema = new mongoose.Schema({
    ward: { type: String, required: true },
    city: { type: String, required: true },
    timestamp: { type: Date, required: true },
    avgAqi: { type: Number },
    pollutantAverages: {
        pm25: Number,
        pm10: Number,
        no2: Number,
        so2: Number,
        co: Number,
        o3: Number,
    },
    isPredicted: { type: Boolean, default: false },
}, { timestamps: true });

wardHourlySchema.index({ ward: 1, timestamp: -1 });

module.exports = mongoose.model('WardHourly', wardHourlySchema);
