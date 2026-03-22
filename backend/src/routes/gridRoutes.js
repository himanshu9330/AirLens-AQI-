const express = require('express');
const router = express.Router();
const { getOrCreateGrid } = require('../controllers/gridController');

/**
 * @route  GET /api/grid
 * @desc   Returns 1 km grid points for a given location
 * @query  location - e.g. "india", "delhi", "mumbai"
 * @access Public
 */
router.get('/', getOrCreateGrid);

module.exports = router;
