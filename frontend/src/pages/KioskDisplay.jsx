import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import RainEffect from '../components/RainEffect';

export default function KioskDisplay() {
  const { kioskId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/kiosk/${kioskId}/qr`).then((res) => {
      setData(res.data);
    }).catch(() => {
      setError('Could not load kiosk information.');
    }).finally(() => setLoading(false));
  }, [kioskId]);

  const handleSimulateScan = () => {
    navigate(`/scan/${kioskId}`);
  };

  if (loading) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <RainEffect />
        <p className="relative z-10 text-white/40">Loading kiosk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <RainEffect />
        <div className="relative z-10 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => navigate('/cities')} className="btn-secondary" style={{ width: 'auto' }}>
            ← Back to Kiosks
          </button>
        </div>
      </div>
    );
  }

  const { kiosk, qr } = data;

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
      <RainEffect intensity={100} />

      <div className="relative z-10 w-full max-w-lg">
        <motion.button
          onClick={() => navigate('/cities')}
          className="text-white/40 text-sm hover:text-white/70 mb-6 flex items-center gap-2 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ← Back to cities
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 text-center"
        >
          {/* Kiosk info */}
          <div className="mb-7">
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              {kiosk.kioskId}
            </span>
            <h1 className="font-display text-2xl font-bold text-white mt-4 mb-1">{kiosk.name}</h1>
            <p className="text-white/40 text-sm">{kiosk.location}</p>
          </div>

          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-xl mb-7 text-sm">
            <span className="text-2xl">🌂</span>
            <span className="text-white/60">
              <span className="text-white font-semibold">{kiosk.availableUmbrellas}</span>
              {' '}of {kiosk.totalUmbrellas} available
            </span>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-4 inline-block mb-7 shadow-2xl">
            <img src={qr} alt="Kiosk QR Code" className="w-48 h-48" />
          </div>

          <p className="text-white/30 text-sm mb-7">
            Scan this QR with your phone camera, or tap the button below to simulate a scan
          </p>

          {/* Simulate scan button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSimulateScan}
            className="btn-primary"
            disabled={kiosk.availableUmbrellas === 0}
          >
            {kiosk.availableUmbrellas === 0 ? '❌ No Umbrellas Available' : '📷 Simulate QR Scan'}
          </motion.button>

          {kiosk.availableUmbrellas === 0 && (
            <p className="text-orange-400 text-xs mt-3">This kiosk is currently empty. Try another one.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
