const express = require('express');
const router = express.Router();
const { getWardwiseAqi } = require('../controllers/wardAqiController');

/**
 * @route GET /api/aqi/wardwise
 * @desc Get estimated AQI for all wards using spatial interpolation (IDW)
 * @access Public
 */
router.get('/wardwise', getWardwiseAqi);

module.exports = router;
