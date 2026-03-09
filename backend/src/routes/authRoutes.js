const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, adminLogin } = require('../controllers/authController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/register', apiLimiter, registerUser);
router.post('/login', apiLimiter, loginUser);
router.post('/google', apiLimiter, googleLogin);
router.post('/admin', apiLimiter, adminLogin);

module.exports = router;
