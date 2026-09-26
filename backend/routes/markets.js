const express = require('express');
const router = express.Router();
const { getMarkets, getMarketPrices, getLatestPricesForCrop, createMarket, addMarketPrice } = require('../controllers/marketController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getMarkets);
router.get('/prices/latest', protect, getLatestPricesForCrop);
router.get('/:id/prices', protect, getMarketPrices);
router.post('/', protect, adminOnly, createMarket);
router.post('/prices', protect, adminOnly, addMarketPrice);

module.exports = router;
