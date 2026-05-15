const mongoose = require('mongoose');

const kioskSchema = new mongoose.Schema({
  kioskId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  location: { type: String, required: true },
  totalUmbrellas: { type: Number, default: 10 },
  availableUmbrellas: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Kiosk', kioskSchema);
