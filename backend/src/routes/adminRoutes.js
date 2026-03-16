const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardChartData, getNationalHotspots, getDetailedAlerts, getDetailedPredictions, dispatchAlert } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route GET /api/admin/stats
 * @desc Get aggregated dashboard stats for admin
 * @access Private/Admin
 */
router.get('/stats', protect, getDashboardStats);
router.get('/chart', protect, getDashboardChartData);
router.get('/national-hotspots', protect, getNationalHotspots);
router.get('/detailed-alerts', protect, getDetailedAlerts);
router.get('/detailed-predictions', protect, getDetailedPredictions);
router.post('/dispatch-alert', protect, dispatchAlert);

module.exports = router;
