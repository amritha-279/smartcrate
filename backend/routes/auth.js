const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.get('/me', protect, getMe);

module.exports = router;
