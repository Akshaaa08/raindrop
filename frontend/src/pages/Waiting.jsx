import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import RainEffect from '../components/RainEffect';

export default function Waiting() {
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [elapsed, setElapsed] = useState({ h: 0, m: 0, s: 0 });
  const [currentCost, setCurrentCost] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rental/active')
      .then((r) => setRental(r.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!rental) return;
    const timer = setInterval(() => {
      const diff = Date.now() - new Date(rental.startTime).getTime();
      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setElapsed({ h, m, s });

      // Live cost (round up to next hour)
      const hours = diff / 3600000;
      const hoursCharged = Math.ceil(hours);
      const cost = Math.min(hoursCharged * 10, 150); // cap at deposit for display
      setCurrentCost(hoursCharged * 10);
    }, 1000);
    return () => clearInterval(timer);
  }, [rental]);

  const pad = (n) => String(n).padStart(2, '0');

  if (loading) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <RainEffect />
        <p className="relative z-10 text-white/40">Loading...</p>
      </div>
    );
  }

  const refundPreview = Math.max(0, 150 - currentCost);
  const extraPreview = Math.max(0, currentCost - 150);

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <RainEffect intensity={130} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-6xl mb-5"
          >
            🌂
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            You've Unlocked Your Raindrop
          </h1>
          <p className="text-white/40 text-sm italic font-display">Enjoy the day</p>
        </div>

        {/* Live Timer */}
        <div className="glass rounded-2xl p-7 mb-5 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Time Elapsed</p>
          <div className="flex items-center justify-center gap-3">
            {[
              { val: elapsed.h, label: 'HR' },
              { val: elapsed.m, label: 'MIN' },
              { val: elapsed.s, label: 'SEC' },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="glass rounded-xl px-5 py-3 min-w-[70px]">
                  <p className="text-4xl font-mono font-bold text-white">{pad(t.val)}</p>
                </div>
                <p className="text-white/20 text-xs mt-2 tracking-widest">{t.label}</p>
                {i < 2 && <div className="absolute">:</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Cost preview */}
        <div className="glass rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Estimated cost so far</span>
            <span className="text-white font-semibold">₹{currentCost}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Security deposit</span>
            <span className="text-white font-semibold">₹150</span>
          </div>
          {refundPreview > 0 && (
            <div className="flex justify-between text-sm border-t border-white/5 pt-3">
              <span className="text-green-400">Estimated refund</span>
              <span className="text-green-400 font-semibold">+₹{refundPreview}</span>
            </div>
          )}
          {extraPreview > 0 && (
            <div className="flex justify-between text-sm border-t border-white/5 pt-3">
              <span className="text-orange-400">Extra charge (over deposit)</span>
              <span className="text-orange-400 font-semibold">₹{extraPreview}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/return/${rental?.kioskId}`)}
            className="btn-primary"
            style={{ flex: 2 }}
          >
            Return Umbrella →
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            style={{ flex: 1, width: 'auto' }}
          >
            Dashboard
          </button>
        </div>

        <p className="text-white/20 text-xs text-center mt-5">
          Rental started: {rental && new Date(rental.startTime).toLocaleTimeString('en-IN')}
        </p>
      </motion.div>
    </div>
  );
}
