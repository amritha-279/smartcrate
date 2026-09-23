const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  crop: { type: String, required: true, trim: true },
  variety: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'kg' },
  initialWeight: { type: Number },
  harvestDate: { type: Date, required: true },
  harvestTime: { type: String },
  maturityStage: {
    type: String,
    enum: ['Immature', 'Mature', 'Semi-Ripe', 'Fully Ripe', 'Over-Ripe'],
  },
  storageType: { type: String },
  storageCondition: { type: String },
  farmerLocation: { type: String },
  status: {
    type: String,
    enum: ['Active', 'Sold', 'Spoiled', 'Archived'],
    default: 'Active',
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Harvest', harvestSchema);
