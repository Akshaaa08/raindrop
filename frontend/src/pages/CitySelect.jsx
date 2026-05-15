import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import RainEffect from '../components/RainEffect';

const cityEmoji = { Pune: '🌧️', Mumbai: '🌊', Bengaluru: '🌿', Hyderabad: '🏙️' };

export default function CitySelect() {
  const navigate = useNavigate();
  const [kiosks, setKiosks] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/kiosk/all').then((res) => {
      setKiosks(res.data);
      const uniqueCities = [...new Set(res.data.map((k) => k.city))];
      setCities(uniqueCities);
      setSelectedCity(uniqueCities[0]);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = kiosks.filter((k) => k.city === selectedCity);

  return (
    <div className="page-bg min-h-screen pt-24 pb-16 px-6">
      <RainEffect intensity={90} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-blue-400 text-sm uppercase tracking-widest font-medium mb-2">
            Thank you for choosing Raindrop
          </p>
          <h1 className="font-display text-4xl font-bold text-white">Find a Kiosk</h1>
          <p className="text-white/40 mt-1 text-sm">Select your city and pick the nearest kiosk</p>
        </motion.div>

        {/* City Tabs */}
        {!loading && (
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                <span>{cityEmoji[city] || '📍'}</span>
                <span>{city}</span>
              </button>
            ))}
          </div>
        )}

        {/* Kiosk Grid */}
        {loading ? (
          <div className="text-center py-20 text-white/40">Loading kiosks...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((kiosk, i) => {
              const available = kiosk.availableUmbrellas;
              const pct = Math.round((available / kiosk.totalUmbrellas) * 100);
              return (
                <motion.div
                  key={kiosk._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/kiosk/${kiosk.kioskId}`)}
                  className="glass glass-hover rounded-2xl p-6 cursor-pointer border border-transparent hover:border-blue-500/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{kiosk.name}</h3>
                      <p className="text-white/40 text-sm mt-1">{kiosk.location}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      available > 0
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {available > 0 ? `${available} available` : 'Empty'}
                    </span>
                  </div>

                  {/* Availability bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/30 mb-1.5">
                      <span>Umbrella availability</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          pct > 50 ? 'bg-blue-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-xs font-mono">{kiosk.kioskId}</span>
                    <span className="text-blue-400 text-sm font-medium">View QR →</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
