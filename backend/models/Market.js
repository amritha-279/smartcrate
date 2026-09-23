const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  district: { type: String },
  state: { type: String },
  marketType: { type: String, enum: ['APMC', 'Local', 'Wholesale', 'Retail', 'Other'], default: 'Local' },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  isActive: { type: Boolean, default: true },
  distance: { type: Number, default: 0 },       // km from a reference point
  travelTime: { type: String },                  // e.g. '30 mins'
  travelTimeHours: { type: Number, default: 0.5 },
  transportCost: { type: Number, default: 0 },   // flat ₹ cost (optional override)
}, { timestamps: true });

module.exports = mongoose.model('Market', marketSchema);
