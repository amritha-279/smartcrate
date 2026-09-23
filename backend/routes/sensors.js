const express = require('express');
const router = express.Router();
const { createReading, getLatestReading, getReadingHistory } = require('../controllers/sensorController');
const { protect } = require('../middleware/auth');

// ESP32 posts to this endpoint directly (no auth token needed from hardware)
// In production, secure this with a device API key instead
router.post('/readings', createReading);

router.get('/readings/:harvestId', protect, getLatestReading);
router.get('/history/:harvestId', protect, getReadingHistory);

module.exports = router;
