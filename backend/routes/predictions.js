const express = require('express');
const router = express.Router();
const { getLatestPrediction, getPredictionHistory } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/:harvestId/latest', getLatestPrediction);
router.get('/:harvestId/history', getPredictionHistory);

module.exports = router;
