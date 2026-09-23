const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  harvestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest' },
  type: {
    type: String,
    enum: ['warning', 'danger', 'info', 'success'],
    default: 'info',
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  // Channel readiness for future SMS/WhatsApp/push
  channels: {
    inApp: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
}, { timestamps: true });

notificationSchema.index({ farmerId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
