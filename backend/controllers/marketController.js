const Market = require('../models/Market');
const MarketPrice = require('../models/MarketPrice');

// GET /api/markets
const getMarkets = async (req, res, next) => {
  try {
    const markets = await Market.find({ isActive: true });
    res.json(markets);
  } catch (err) {
    next(err);
  }
};

// GET /api/markets/:id/prices?crop=Tomato
const getMarketPrices = async (req, res, next) => {
  try {
    const { crop } = req.query;
    const filter = { marketId: req.params.id };
    if (crop) filter.crop = crop;

    // Get the most recent price entry per crop
    const prices = await MarketPrice.find(filter).sort({ date: -1 }).limit(30);
    res.json(prices);
  } catch (err) {
    next(err);
  }
};

// GET /api/markets/prices/latest?crop=Tomato  — latest price across all markets for a crop
const getLatestPricesForCrop = async (req, res, next) => {
  try {
    const { crop } = req.query;
    if (!crop) return res.status(400).json({ message: 'crop query param required' });

    // Aggregate: latest price per market for this crop
    const prices = await MarketPrice.aggregate([
      { $match: { crop } },
      { $sort: { date: -1 } },
      { $group: { _id: '$marketId', latestPrice: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$latestPrice' } },
    ]);

    // Populate market info
    const populated = await MarketPrice.populate(prices, { path: 'marketId', model: 'Market' });
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// POST /api/markets  (admin)
const createMarket = async (req, res, next) => {
  try {
    const market = await Market.create(req.body);
    res.status(201).json(market);
  } catch (err) {
    next(err);
  }
};

// POST /api/markets/prices  (admin or dataset import)
const addMarketPrice = async (req, res, next) => {
  try {
    const price = await MarketPrice.create(req.body);
    res.status(201).json(price);
  } catch (err) {
    next(err);
  }
};

// GET /api/markets/compare?crop=Tomato&quantity=100&transportCostPerKm=5
const compareMarkets = async (req, res, next) => {
  try {
    const { crop, quantity = 100, transportCostPerKm = 5 } = req.query;
    if (!crop) return res.status(400).json({ message: 'crop query param required' });

    const markets = await Market.find({ isActive: true });

    const results = await Promise.all(
      markets.map(async (market) => {
        const priceDoc = await MarketPrice.findOne({ marketId: market._id, crop })
          .sort({ date: -1 });
        const modalPrice = priceDoc?.modalPrice || null;
        const distance = market.distance || 0;
        const transportCost = distance * parseFloat(transportCostPerKm);
        const grossValue = modalPrice ? modalPrice * parseFloat(quantity) : null;
        const netValue = grossValue !== null ? grossValue - transportCost : null;
        return {
          marketId: market._id,
          name: market.name,
          location: market.location,
          district: market.district,
          state: market.state,
          distance,
          travelTime: market.travelTime || null,
          modalPrice,
          minPrice: priceDoc?.minPrice || null,
          maxPrice: priceDoc?.maxPrice || null,
          transportCost,
          grossValue,
          netValue,
          priceDate: priceDoc?.date || null,
        };
      })
    );

    results.sort((a, b) => {
      if (b.netValue === null) return -1;
      if (a.netValue === null) return 1;
      return b.netValue - a.netValue;
    });

    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMarkets, getMarketPrices, getLatestPricesForCrop, createMarket, addMarketPrice, compareMarkets };
