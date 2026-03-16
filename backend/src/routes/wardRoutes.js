const express = require('express');
const router = express.Router();
const {
    getWards,
    getWardCurrent,
    getWardHistory,
    getWardPrediction,
    createAlert,
    getActiveAlerts
} = require('../controllers/wardController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { validateAlert } = require('../middleware/validator');

/**
 * @route GET /api/wards
 * @desc Get list of all wards
 */
router.get('/', apiLimiter, getWards);

/**
 * @route GET /api/wards/:id/current
 * @desc Get current AQI and data for a specific ward
 */
router.get('/:id/current', apiLimiter, getWardCurrent);

/**
 * @route GET /api/wards/:id/history
 * @desc Get historical AQI data for a ward
 */
router.get('/:id/history', apiLimiter, getWardHistory);

/**
 * @route GET /api/wards/:id/prediction
 * @desc Get AQI predictions for a ward
 */
router.get('/:id/prediction', apiLimiter, getWardPrediction);

/**
 * @route POST /api/alerts
 * @desc Create a new alert
 */
router.post('/alerts', apiLimiter, validateAlert, createAlert);

/**
 * @route GET /api/alerts/active
 * @desc Get currently active broadcasted alerts
 */
router.get('/alerts/active', apiLimiter, getActiveAlerts);

module.exports = router;
