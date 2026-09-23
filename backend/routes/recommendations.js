const express = require('express');
const router = express.Router();
const { generateRecommendation, getLatestRecommendation } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate', generateRecommendation);
router.get('/:harvestId/latest', getLatestRecommendation);

module.exports = router;
