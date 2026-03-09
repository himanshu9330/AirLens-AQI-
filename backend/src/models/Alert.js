const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    ward: { type: String, required: true },
    level: { type: String, enum: ['Low', 'Moderate', 'High', 'Severe'], required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['AQI', 'POLLUTANT', 'SYSTEM'], default: 'AQI' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
