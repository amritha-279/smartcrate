const express = require('express');
const router = express.Router();
const {
  getMarkets, getMarketPrices, getLatestPricesForCrop,
  createMarket, addMarketPrice, compareMarkets,
} = require('../controllers/marketController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

router.get('/', protect, getMarkets);
router.get('/prices/latest', protect, getLatestPricesForCrop);
router.get('/compare', protect, compareMarkets);
router.get('/:id/prices', protect, getMarketPrices);

// Admin-only
router.post('/', protect, adminOnly, createMarket);
router.post('/prices', protect, adminOnly, addMarketPrice);

module.exports = router;
