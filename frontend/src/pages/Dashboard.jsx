import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import RainEffect from '../components/RainEffect';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeRental, setActiveRental] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!activeRental) return;
    const timer = setInterval(() => {
      const diff = Date.now() - new Date(activeRental.startTime).getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeRental]);

  const fetchData = async () => {
    try {
      const [activeRes, histRes] = await Promise.allSettled([
        api.get('/rental/active'),
        api.get('/rental/history'),
      ]);
      if (activeRes.status === 'fulfilled') setActiveRental(activeRes.value.data);
      if (histRes.status === 'fulfilled') setHistory(histRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-6">
      <RainEffect intensity={80} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-blue-400 text-sm uppercase tracking-widest font-medium mb-2">My Dashboard</p>
          <h1 className="font-display text-4xl font-bold text-white">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-white/40 mt-1">Manage your rentals and view history</p>
        </motion.div>

        {loading ? (
          <div className="text-white/40 text-center py-20">Loading your rentals...</div>
        ) : (
          <>
            {/* Active Rental Card */}
            {activeRental ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-7 mb-8 border border-blue-500/20"
                style={{ background: 'rgba(59,130,246,0.06)' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-blue-400 text-xs uppercase tracking-widest font-medium mb-1">Active Rental</p>
                    <h2 className="font-display text-2xl font-bold text-white">🌂 Umbrella Out</h2>
                  </div>
                  <div className="glass px-4 py-2 rounded-xl text-center">
                    <p className="text-white font-mono font-bold text-lg">{elapsed || '...'}</p>
                    <p className="text-white/40 text-xs mt-1">Time elapsed</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-xl p-4">
                    <p className="text-white/40 text-xs mb-1">Kiosk ID</p>
                    <p className="text-white font-mono text-sm">{activeRental.kioskId}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-white/40 text-xs mb-1">Rate</p>
                    <p className="text-white font-semibold">₹{activeRental.hourlyRate}/hr</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/waiting')}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    View Rental Status
                  </button>
                  <button
                    onClick={() => navigate(`/return/${activeRental.kioskId}`)}
                    className="btn-secondary"
                    style={{ width: 'auto', flex: 1 }}
                  >
                    Return Umbrella
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-7 mb-8 text-center"
              >
                <p className="text-4xl mb-3">🌤️</p>
                <p className="text-white/60 mb-4">No active rental right now</p>
                <Link to="/cities">
                  <button className="btn-primary" style={{ width: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
                    Find a Kiosk →
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Rental History */}
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-4">Rental History</h2>
              {history.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-white/30 text-sm">
                  No completed rentals yet
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((r, i) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass glass-hover rounded-xl p-5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium text-sm">{r.kiosk?.name || r.kioskId}</p>
                        <p className="text-white/40 text-xs mt-1">
                          {new Date(r.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{r.hoursCharged}h charged
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{r.rentalCost}</p>
                        {r.refundAmount > 0 && (
                          <p className="text-green-400 text-xs mt-1">+₹{r.refundAmount} refund</p>
                        )}
                        {r.extraCharge > 0 && (
                          <p className="text-orange-400 text-xs mt-1">₹{r.extraCharge} extra</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
