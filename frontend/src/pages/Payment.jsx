import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import RainEffect from '../components/RainEffect';

export default function Payment() {
  const { kioskId } = useParams();
  const navigate = useNavigate();
  const [kiosk, setKiosk] = useState(null);
  const [step, setStep] = useState('confirm'); // confirm | processing | done
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/kiosk/${kioskId}`).then((r) => setKiosk(r.data)).catch(() => {});
  }, [kioskId]);

  const handlePay = async () => {
    setStep('processing');
    setError('');
    try {
      // Simulate a 1.5s payment gateway delay, then start rental
      await new Promise((r) => setTimeout(r, 1500));
      await api.post('/rental/start', { kioskId });
      setStep('done');
      setTimeout(() => navigate('/waiting'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setStep('confirm');
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <RainEffect />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-3xl p-8"
            >
              <div className="text-center mb-7">
                <span className="text-5xl">💳</span>
                <h1 className="font-display text-3xl font-bold text-white mt-4 mb-1">
                  Confirm Payment
                </h1>
                {kiosk && (
                  <p className="text-white/40 text-sm">{kiosk.name} · {kiosk.city}</p>
                )}
              </div>

              {/* Payment breakdown */}
              <div className="glass rounded-2xl p-5 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">Security Deposit</span>
                  <span className="text-white font-semibold">₹150</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="text-white/50 text-sm">Rental Rate</span>
                  <span className="text-white font-semibold">₹10 / hour</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="text-white/50 text-sm">Refundable?</span>
                  <span className="text-green-400 text-sm font-medium">✓ Yes (unused portion)</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="text-white font-semibold">Amount to Pay Now</span>
                  <span className="text-2xl font-bold text-white">₹150</span>
                </div>
              </div>

              {/* Simulated payment methods */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['UPI', 'Card', 'Wallet'].map((m) => (
                  <div key={m} className="glass rounded-xl p-3 text-center text-white/40 text-sm">
                    {m}
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
              )}

              <button onClick={handlePay} className="btn-primary">
                Pay ₹150 & Unlock Umbrella 🌂
              </button>
              <p className="text-white/20 text-xs text-center mt-4">
                Simulated payment — no real money is charged
              </p>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="text-5xl inline-block mb-6"
              >
                ⚙️
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Processing...</h2>
              <p className="text-white/40 text-sm">Securing your payment and unlocking umbrella</p>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-6xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-white mb-3">Umbrella Unlocked!</h2>
              <p className="text-white/50 text-sm">Enjoy your day, {' '}
                <span className="text-blue-300">stay dry</span>!
              </p>
              <p className="text-white/20 text-xs mt-4">Redirecting to your rental status...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
