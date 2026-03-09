const WardHourly = require('../models/WardHourly');
const Prediction = require('../models/Prediction');
const Alert = require('../models/Alert');

const getWards = async (req, res, next) => {
    try {
        const wards = await WardHourly.distinct('ward');
        res.json(wards);
    } catch (error) {
        next(error);
    }
};

const getWardCurrent = async (req, res, next) => {
    try {
        const data = await WardHourly.findOne({ ward: req.params.id }).sort({ timestamp: -1 });
        if (!data) return res.status(404).json({ message: 'Ward data not found' });
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getWardHistory = async (req, res, next) => {
    try {
        const history = await WardHourly.find({ ward: req.params.id })
            .sort({ timestamp: -1 })
            .limit(24);
        res.json(history);
    } catch (error) {
        next(error);
    }
};

const getWardPrediction = async (req, res, next) => {
    try {
        const predictions = await Prediction.find({ ward: req.params.id })
            .sort({ timestamp: 1 })
            .limit(6);
        res.json(predictions);
    } catch (error) {
        next(error);
    }
};

const createAlert = async (req, res, next) => {
    try {
        const alert = await Alert.create(req.body);
        res.status(201).json(alert);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWards,
    getWardCurrent,
    getWardHistory,
    getWardPrediction,
    createAlert
};
