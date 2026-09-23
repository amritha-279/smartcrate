const express = require('express');
const router = express.Router();
const { getStats, getAllFarmers, getAllHarvests } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/farmers', getAllFarmers);
router.get('/harvests', getAllHarvests);

module.exports = router;
