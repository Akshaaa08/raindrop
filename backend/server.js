const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { seedKiosks } = require('./utils/seed');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/kiosk', require('./routes/kiosk'));
app.use('/api/rental', require('./routes/rental'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Raindrop API 🌧️' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/raindrop';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedKiosks();
    app.listen(PORT, () => {
      console.log(`🌱 Kiosks seeded (6 kiosks across Pune, Mumbai, Bengaluru, Hyderabad)`);
      console.log(`🌧️  Raindrop server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
