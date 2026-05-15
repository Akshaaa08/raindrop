import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import RainEffect from '../components/RainEffect';

export default function Scan() {
  const { kioskId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking'); // checking | rent | return | error
  const [rental, setRental] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      // Save where they came from, redirect to login
      sessionStorage.setItem('scan_redirect', `/scan/${kioskId}`);
      navigate('/login');
      return;
    }
    check();
  }, []);

  const check = async () => {
    try {
      const { data } = await api.get(`/rental/check/${kioskId}`);
      setStatus(data.action);
      if (data.rental) setRental(data.rental);
    } catch {
      setError('Could not check kiosk status. Please try again.');
      setStatus('error');
    }
  };

  const handleAction = () => {
    if (status === 'rent') navigate(`/payment/${kioskId}`);
    if (status === 'return') navigate(`/return/${kioskId}`);
  };

  const dot = (
    <motion.div
      animate={{ scale: [1, 1.4, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="w-3 h-3 rounded-full bg-blue-400"
    />
  );

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <RainEffect />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 glass rounded-3xl p-10 max-w-sm w-full text-center"
      >
        <div className="text-5xl mb-6">🌂</div>
        <p className="text-xs font-mono text-blue-400 mb-2">{kioskId}</p>

        {status === 'checking' && (
          <>
            <div className="flex justify-center mb-5">{dot}</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Scanning...</h2>
            <p className="text-white/40 text-sm">Checking your rental status</p>
          </>
        )}

        {status === 'rent' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-4xl mb-4">✨</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Ready to Rent!</h2>
            <p className="text-white/40 text-sm mb-7">
              No active rental found. Pay ₹150 deposit to unlock an umbrella.
            </p>
            <div className="glass rounded-xl p-4 mb-7 text-sm">
              <div className="flex justify-between text-white/60 mb-2">
                <span>Security deposit</span><span className="text-white font-medium">₹150</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Rate</span><span className="text-white font-medium">₹10/hour</span>
              </div>
            </div>
            <button onClick={handleAction} className="btn-primary">Proceed to Payment →</button>
          </motion.div>
        )}

        {status === 'return' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-4xl mb-4">🔁</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Return Umbrella</h2>
            <p className="text-white/40 text-sm mb-7">
              You have an active rental. Return the umbrella here and settle the payment.
            </p>
            <button onClick={handleAction} className="btn-primary">Calculate & Return →</button>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-xl font-bold text-red-400 mb-3">Error</h2>
            <p className="text-white/40 text-sm mb-6">{error}</p>
            <button onClick={check} className="btn-secondary" style={{ width: '100%' }}>Retry</button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
