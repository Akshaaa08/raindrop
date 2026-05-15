const express = require('express');
const QRCode = require('qrcode');
const Kiosk = require('../models/Kiosk');

const router = express.Router();

// GET /api/kiosk/all
router.get('/all', async (req, res) => {
  try {
    const kiosks = await Kiosk.find({ isActive: true });
    res.json(kiosks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/kiosk/:kioskId
router.get('/:kioskId', async (req, res) => {
  try {
    const kiosk = await Kiosk.findOne({ kioskId: req.params.kioskId });
    if (!kiosk) return res.status(404).json({ message: 'Kiosk not found' });
    res.json(kiosk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/kiosk/:kioskId/qr  → returns base64 PNG QR code
router.get('/:kioskId/qr', async (req, res) => {
  try {
    const kiosk = await Kiosk.findOne({ kioskId: req.params.kioskId });
    if (!kiosk) return res.status(404).json({ message: 'Kiosk not found' });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const scanUrl = `${clientUrl}/scan/${req.params.kioskId}`;

    const qrDataUrl = await QRCode.toDataURL(scanUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      color: { dark: '#1e3a5f', light: '#ffffff' },
      width: 300,
    });

    res.json({ qr: qrDataUrl, scanUrl, kiosk });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
