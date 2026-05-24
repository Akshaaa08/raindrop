const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { seedKiosks } = require('./utils/seed');

dotenv.config();

const app = express();

// Support multiple allowed origins: local dev + production Vercel URL
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/kiosk', require('./routes/kiosk'));
app.use('/api/rental', require('./routes/rental'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'Raindrop API 🌧️' })
);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/raindrop';

console.log(process.env.MONGO_URI);
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedKiosks();

    app.listen(PORT, () => {
      console.log(`🌱 Kiosks seeded`);
      console.log(`🌧️ Raindrop server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ FULL MongoDB Error:');
    console.error(err);
    process.exit(1);
  });
