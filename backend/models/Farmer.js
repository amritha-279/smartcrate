const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true, match: /^\d{10}$/ },
  location: { type: String, trim: true },
  village: { type: String, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },
  preferredLanguage: { type: String, default: 'English' },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  isActive: { type: Boolean, default: true },
  joinedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
