const express = require('express');
const auth = require('../middleware/auth');
const Rental = require('../models/Rental');
const Kiosk = require('../models/Kiosk');

const router = express.Router();

const SECURITY_DEPOSIT = Number(process.env.SECURITY_DEPOSIT) || 150;
const HOURLY_RATE = Number(process.env.HOURLY_RATE) || 10;

// GET /api/rental/check/:kioskId  → 'rent' or 'return'
router.get('/check/:kioskId', auth, async (req, res) => {
  try {
    const activeRental = await Rental.findOne({
      user: req.user._id,
      status: 'active',
    });

    if (activeRental) {
      return res.json({
        action: 'return',
        rental: activeRental,
        message: 'You have an active rental. Return umbrella?',
      });
    }

    return res.json({
      action: 'rent',
      message: 'No active rental. Proceed to rent?',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/rental/start  → begin rental
router.post('/start', auth, async (req, res) => {
  try {
    const { kioskId } = req.body;

    const existing = await Rental.findOne({ user: req.user._id, status: 'active' });
    if (existing) return res.status(400).json({ message: 'You already have an active rental' });

    const kiosk = await Kiosk.findOne({ kioskId });
    if (!kiosk) return res.status(404).json({ message: 'Kiosk not found' });
    if (kiosk.availableUmbrellas < 1)
      return res.status(400).json({ message: 'No umbrellas available at this kiosk' });

    kiosk.availableUmbrellas -= 1;
    await kiosk.save();

    const rental = await Rental.create({
      user: req.user._id,
      kiosk: kiosk._id,
      kioskId,
      securityDeposit: SECURITY_DEPOSIT,
      hourlyRate: HOURLY_RATE,
    });

    res.status(201).json({ rental, message: '🌂 Umbrella unlocked! Enjoy your day.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/rental/active  → current active rental
router.get('/active', auth, async (req, res) => {
  try {
    const rental = await Rental.findOne({ user: req.user._id, status: 'active' }).populate('kiosk');
    if (!rental) return res.status(404).json({ message: 'No active rental' });
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/rental/return  → return umbrella + compute cost
router.post('/return', auth, async (req, res) => {
  try {
    const { kioskId } = req.body;

    const rental = await Rental.findOne({ user: req.user._id, status: 'active' });
    if (!rental) return res.status(404).json({ message: 'No active rental found' });

    const endTime = new Date();
    const elapsedMs = endTime - rental.startTime;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const hoursCharged = Math.ceil(elapsedHours); // round up to next hour
    const rentalCost = hoursCharged * HOURLY_RATE;

    let refundAmount = 0;
    let extraCharge = 0;

    if (rentalCost <= SECURITY_DEPOSIT) {
      refundAmount = SECURITY_DEPOSIT - rentalCost;
    } else {
      extraCharge = rentalCost - SECURITY_DEPOSIT;
    }

    rental.endTime = endTime;
    rental.status = 'completed';
    rental.hoursCharged = hoursCharged;
    rental.rentalCost = rentalCost;
    rental.refundAmount = refundAmount;
    rental.extraCharge = extraCharge;
    await rental.save();

    // Return umbrella to original or new kiosk
    const returnKiosk = await Kiosk.findOne({ kioskId: kioskId || rental.kioskId });
    if (returnKiosk) {
      returnKiosk.availableUmbrellas = Math.min(
        returnKiosk.availableUmbrellas + 1,
        returnKiosk.totalUmbrellas
      );
      await returnKiosk.save();
    }

    res.json({
      rental,
      summary: {
        hoursCharged,
        rentalCost,
        securityDeposit: SECURITY_DEPOSIT,
        refundAmount,
        extraCharge,
        duration: {
          hours: Math.floor(elapsedHours),
          minutes: Math.floor((elapsedHours % 1) * 60),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/rental/history  → past rentals
router.get('/history', auth, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id, status: 'completed' })
      .populate('kiosk', 'name city location')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
