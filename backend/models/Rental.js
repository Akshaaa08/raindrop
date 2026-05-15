const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'Kiosk', required: true },
  kioskId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
  securityDeposit: { type: Number, default: 150 },
  hourlyRate: { type: Number, default: 10 },
  hoursCharged: { type: Number },
  rentalCost: { type: Number },
  refundAmount: { type: Number },
  extraCharge: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
