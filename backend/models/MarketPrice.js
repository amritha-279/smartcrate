const mongoose = require('mongoose');

// Stores historical and current market prices per crop per market per date.
// Sourced from datasets (e.g. Agmarknet) or manual entry.
const marketPriceSchema = new mongoose.Schema({
  marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
  crop: { type: String, required: true },
  variety: { type: String },
  date: { type: Date, required: true },
  minPrice: { type: Number },   // ₹ per quintal or kg
  maxPrice: { type: Number },
  modalPrice: { type: Number }, // most common traded price
  arrivalQuantity: { type: Number }, // tonnes
  unit: { type: String, default: 'kg' },
  source: { type: String, default: 'manual' }, // 'dataset', 'api', 'manual'
}, { timestamps: true });

marketPriceSchema.index({ marketId: 1, crop: 1, date: -1 });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
