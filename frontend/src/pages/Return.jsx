import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import RainEffect from '../components/RainEffect';

export default function Return() {
  const { kioskId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm'); // confirm | processing
  const [error, setError] = useState('');

  const handleReturn = async () => {
    setStep('processing');
    setError('');
    try {
      const { data } = await api.post('/rental/return', { kioskId });
      navigate('/final', { state: { summary: data.summary, rental: data.rental } });
    } catch (err) {
      setError(err.response?.data?.message || 'Return failed. Please try again.');
      setStep('confirm');
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <RainEffect />

      <AnimatePresence mode="wait">
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 glass rounded-3xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-7">
              <span className="text-5xl">🔁</span>
              <h1 className="font-display text-3xl font-bold text-white mt-4 mb-1">Return Umbrella</h1>
              <p className="text-white/40 text-sm">Returning to kiosk: <span className="font-mono text-blue-400">{kioskId}</span></p>
            </div>

            <div className="glass rounded-2xl p-5 mb-6 space-y-3 text-sm">
              <p className="text-white/50">
                Your rental cost will be calculated based on the time you've used the umbrella.
                The deposit will be settled accordingly.
              </p>
              <div className="border-t border-white/5 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50">Rate</span>
                  <span className="text-white">₹10 / hour (rounded up)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Deposit held</span>
                  <span className="text-white">₹150</span>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mb-4">{error}</p>
            )}

            <button onClick={handleReturn} className="btn-primary mb-3">
              Confirm Return & Calculate Bill
            </button>
            <button
              onClick={() => navigate('/waiting')}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              Keep the umbrella
            </button>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 glass rounded-3xl p-12 text-center max-w-sm w-full"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="text-5xl inline-block mb-6"
            >
              ⚙️
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Processing Return...</h2>
            <p className="text-white/40 text-sm">Calculating your final bill</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
