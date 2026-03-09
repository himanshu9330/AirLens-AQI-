const express = require('express');
const router = express.Router();
const { updateLocation, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

router.put('/location', apiLimiter, protect, updateLocation);
router.get('/profile', apiLimiter, protect, getUserProfile);

module.exports = router;
