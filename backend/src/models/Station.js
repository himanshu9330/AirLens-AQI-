const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    ward: { type: String },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    source: { type: String, enum: ['OpenAQ', 'CPCB'], default: 'OpenAQ' },
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);
