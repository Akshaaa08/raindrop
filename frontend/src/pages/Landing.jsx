import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RainEffect from '../components/RainEffect';

const features = [
  { icon: '⚡', title: 'Instant Access', desc: 'Scan, pay, and unlock in under 30 seconds. No app download needed.' },
  { icon: '🔄', title: 'Seamless Return', desc: 'Return at any Raindrop kiosk — not just where you rented from.' },
  { icon: '🔒', title: 'Quick Unlock', desc: 'Simple QR-based unlock. ₹150 deposit, ₹10/hour. Fair and transparent.' },
];

const steps = [
  { step: '01', title: 'Rent & Unlock', desc: 'Scan the QR code at any kiosk stand. Use the umbrella as needed. Drop it at any kiosk when you\'re done.' },
  { step: '02', title: 'Use & Return', desc: 'Use the umbrella as needed and easily return it at any kiosk stand. Done when you\'re done.' },
];

export default function Landing() {
  return (
    <div className="page-bg min-h-screen">
      <RainEffect intensity={150} />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm text-blue-300">
            <span>🌧️</span>
            <span>Available across Pune · Mumbai · Bengaluru · Hyderabad</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-4 leading-tight">
            Welcome to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Raindrop
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 font-light mb-3 italic font-display">
            "Rent. Roam. Return."
          </p>

          <p className="text-white/50 text-base max-w-lg mx-auto mb-10 leading-relaxed">
            Smart umbrella rentals at QR-powered kiosks. No more getting soaked.
            Just scan, pay ₹150, and you're covered.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ width: 'auto', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              >
                Start Renting — Free to Join
              </motion.button>
            </Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Floating price pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 glass px-8 py-4 rounded-2xl flex items-center gap-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-white">₹150</p>
            <p className="text-xs text-white/40 mt-1">Security deposit</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">₹10</p>
            <p className="text-xs text-white/40 mt-1">Per hour</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">6</p>
            <p className="text-xs text-white/40 mt-1">Kiosk locations</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">What We Provide</p>
            <h2 className="font-display text-4xl font-bold text-white">Built for the monsoon</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="glass glass-hover rounded-2xl p-7"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="relative z-10 py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest text-center mb-16">Services</p>
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="glass rounded-2xl p-8"
              >
                <p className="text-5xl font-display font-bold text-blue-500/30 mb-4">{s.step}</p>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌂</span>
            <span className="font-display font-bold text-white">Raindrop</span>
          </div>
          <p className="text-white/25 text-sm">Built with ❤️ for the Indian monsoon season</p>
          <div className="flex gap-6 text-white/30 text-sm">
            <Link to="/cities" className="hover:text-white/60 transition-colors">Kiosks</Link>
            <Link to="/register" className="hover:text-white/60 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
