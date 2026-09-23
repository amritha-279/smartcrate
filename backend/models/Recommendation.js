const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  harvestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  predictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' },

  action: {
    type: String,
    enum: ['Sell Today', 'Wait for Better Price', 'Transport to Another Market', 'Move Produce to Storage'],
    required: true,
  },
  reasons: [{ type: String }],

  // Market comparison snapshot used to generate this recommendation
  marketsConsidered: [{
    marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market' },
    marketName: String,
    distance: Number,
    travelTime: String,
    pricePerKg: Number,
    transportCost: Number,
    grossValue: Number,
    netValue: Number,
    safeToTravel: Boolean,
  }],

  bestMarketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Market' },

  // Inputs used
  remainingShelfLife: { type: Number },
  spoilageRisk: { type: String },
  quantity: { type: Number },

  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
