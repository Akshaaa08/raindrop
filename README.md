# 🌂 Raindrop — Umbrella Rental Platform

> "Rent. Roam. Return."  
> A smart umbrella rental system with QR-based kiosk integration. Built with the **MERN stack**.

---

## 🏗️ Architecture

```
User Scans QR at Kiosk
    ↓
/scan/:kioskId  →  Check active rental?
    ├── No rental → /payment/:kioskId → Pay ₹150 deposit → Umbrella unlocked
    └── Has rental → /return/:kioskId → Calculate time × ₹10 → Settle & refund
```

**Tech Stack:**
- **MongoDB** — stores users, kiosks, rentals
- **Express.js** — REST API backend
- **React + Vite** — frontend with animations
- **Node.js** — server runtime
- **QRCode** — generates kiosk QR codes
- **JWT** — authentication
- **Framer Motion** — page transitions & animations
- **Tailwind CSS** — styling

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`) OR a MongoDB Atlas URI

---

### 1. Clone / Set Up the Project

```bash
# Project is already structured. Navigate to it:
cd raindrop
```

---

### 2. Set Up the Backend

```bash
cd backend

# Install dependencies
npm install

# The .env file is already created with defaults.
# Edit it if you want to use MongoDB Atlas:
# MONGO_URI=mongodb+srv://your-atlas-uri

# Start the backend server (development)
npm run dev
```

You should see:
```
✅ MongoDB connected
🌱 Kiosks seeded (6 kiosks across Pune, Mumbai, Bengaluru, Hyderabad)
🌧️  Raindrop server running on http://localhost:5000
```

---

### 3. Set Up the Frontend

```bash
# In a new terminal:
cd frontend

# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### 4. Open the App

Visit: **http://localhost:5173**

---

## 🗺️ User Flow (How to Demo)

### Renting an Umbrella:
1. **Register** a new account at `/register`
2. Go to **Find a Kiosk** (`/cities`)
3. Click any kiosk → see the **QR code** displayed
4. Click **"Simulate QR Scan"** (or scan the actual QR with your phone)
5. You're redirected to `/payment/:kioskId`
6. Click **"Pay ₹150 & Unlock Umbrella"** (simulated payment)
7. ✅ Umbrella unlocked! You're on the waiting page with a live timer

### Returning an Umbrella:
1. From the waiting page, click **"Return Umbrella"**
2. Or: scan the kiosk QR again → auto-detected as a return
3. Review the cost breakdown
4. Click **"Confirm Return"**
5. ✅ Final receipt shown with refund amount

### QR Code Integration:
- Each kiosk has a real QR code at: `GET /api/kiosk/:kioskId/qr`
- QR encodes: `http://localhost:5173/scan/:kioskId`
- In production, scanning with a phone camera opens the app directly
- For demo: use the "Simulate QR Scan" button on the kiosk page

---

## 📡 API Reference

### Auth
```
POST   /api/auth/register     { name, email, phone, password }
POST   /api/auth/login        { email, password }
GET    /api/auth/me           (requires token)
```

### Kiosks
```
GET    /api/kiosk/all                  → all active kiosks
GET    /api/kiosk/:kioskId             → single kiosk
GET    /api/kiosk/:kioskId/qr          → QR code (base64 PNG)
```

### Rentals
```
GET    /api/rental/check/:kioskId      → 'rent' or 'return' action
POST   /api/rental/start               { kioskId } → start rental
GET    /api/rental/active              → current active rental
POST   /api/rental/return              { kioskId } → return umbrella
GET    /api/rental/history             → past rentals
```

---

## 💡 Pricing Logic

```
Security Deposit: ₹150 (paid upfront)
Hourly Rate:      ₹10/hour (rounded up to next hour)

If rental cost ≤ ₹150:
  → Refund = ₹150 - rental cost

If rental cost > ₹150 (15+ hours):
  → Extra charge = rental cost - ₹150
  → No refund

Example: 3.5 hours → billed as 4 hours → ₹40 → ₹110 refund
```

---

## 🌐 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/raindrop
JWT_SECRET=raindrop_super_secret_key_2024
CLIENT_URL=http://localhost:5173
SECURITY_DEPOSIT=150
HOURLY_RATE=10
```

---

## 📁 Project Structure

```
raindrop/
├── backend/
│   ├── models/
│   │   ├── User.js        ← user schema
│   │   ├── Kiosk.js       ← kiosk schema
│   │   └── Rental.js      ← rental tracking
│   ├── routes/
│   │   ├── auth.js        ← register/login
│   │   ├── kiosk.js       ← kiosk + QR code gen
│   │   └── rental.js      ← rent/return logic
│   ├── middleware/
│   │   └── auth.js        ← JWT verification
│   ├── utils/
│   │   └── seed.js        ← seeds 6 kiosks
│   └── server.js          ← Express entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Landing.jsx    ← hero page
        │   ├── Login.jsx      ← sign in
        │   ├── Register.jsx   ← sign up
        │   ├── Dashboard.jsx  ← rental status + history
        │   ├── CitySelect.jsx ← browse kiosks
        │   ├── KioskDisplay.jsx ← QR code display
        │   ├── Scan.jsx       ← QR scan handler
        │   ├── Payment.jsx    ← security deposit
        │   ├── Waiting.jsx    ← active rental + timer
        │   ├── Return.jsx     ← return confirmation
        │   └── FinalPay.jsx   ← receipt & refund
        ├── components/
        │   ├── Navbar.jsx
        │   ├── RainEffect.jsx ← animated rain canvas
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── api.js             ← Axios instance
```

---

## 🚀 Production Deployment Tips

1. **Frontend**: `npm run build` → deploy `dist/` to Vercel/Netlify
2. **Backend**: deploy to Railway/Render, set env vars
3. **MongoDB**: use MongoDB Atlas free tier
4. Update `CLIENT_URL` in backend `.env` to your production frontend URL
5. Update `vite.config.js` proxy or use absolute API URL in production

---

## 🎯 Resume Highlights

- **QR Code Generation**: Dynamic per-kiosk QR codes using the `qrcode` npm library
- **JWT Authentication**: Stateless auth with 7-day token expiry
- **Real-time Timer**: Live elapsed time counter on active rental page
- **Business Logic**: Deposit/refund calculation, umbrella availability tracking
- **Responsive UI**: Mobile-first design with rain animation, glassmorphism, Framer Motion
- **REST API**: 12+ endpoints with proper auth middleware and error handling

---

Built with ❤️ for the Indian monsoon season.
