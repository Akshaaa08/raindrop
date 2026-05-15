import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RainEffect from '../components/RainEffect';

export default function FinalPay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary } = location.state || {};

  if (!summary) {
    navigate('/dashboard');
    return null;
  }

  const { hoursCharged, rentalCost, securityDeposit, refundAmount, extraCharge, duration } = summary;
  const gotRefund = refundAmount > 0;

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <RainEffect intensity={60} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Receipt header */}
        <div className="glass rounded-3xl overflow-hidden">
          {/* Top band */}
          <div
            className="p-8 text-center"
            style={{ background: gotRefund ? 'rgba(34,197,94,0.07)' : 'rgba(251,146,60,0.07)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {gotRefund ? '✅' : '💳'}
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              {gotRefund ? 'Welcome Back!' : 'All Settled!'}
            </h1>
            <p className="text-white/40 text-sm">
              {gotRefund
                ? `You'll receive a refund of ₹${refundAmount}`
                : `An extra charge of ₹${extraCharge} was collected`}
            </p>
          </div>

          {/* Receipt body */}
          <div className="p-7 space-y-4">
            {/* Duration */}
            <div className="text-center mb-5">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Duration Used</p>
              <p className="font-display text-2xl font-bold text-white">
                {duration.hours}h {duration.minutes}m
              </p>
            </div>

            {/* Bill breakdown */}
            <div className="glass rounded-xl p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Hours charged (rounded up)</span>
                <span className="text-white">{hoursCharged} hr{hoursCharged !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Rate</span>
                <span className="text-white">₹10 × {hoursCharged} = ₹{rentalCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Security deposit paid</span>
                <span className="text-white">₹{securityDeposit}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                {gotRefund ? (
                  <div className="flex justify-between font-semibold">
                    <span className="text-green-400">Refund Amount</span>
                    <span className="text-green-400 text-xl">+ ₹{refundAmount}</span>
                  </div>
                ) : (
                  <div className="flex justify-between font-semibold">
                    <span className="text-orange-400">Extra Charged</span>
                    <span className="text-orange-400 text-xl">₹{extraCharge}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dashed separator for receipt feel */}
            <div className="border-t border-dashed border-white/10 my-2" />

            <p className="text-center text-white/20 text-xs">
              Thank you for using Raindrop 🌂 · Stay dry!
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => navigate('/cities')}
            className="btn-primary"
            style={{ flex: 1 }}
          >
            Rent Again →
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            style={{ flex: 1, width: 'auto' }}
          >
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
