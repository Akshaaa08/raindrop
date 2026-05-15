import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌂</span>
          <span className="font-display text-xl font-bold text-white tracking-wide">
            Raindrop
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/cities"
                className={`text-sm font-medium transition-colors ${
                  isActive('/cities') ? 'text-blue-400' : 'text-white/60 hover:text-white'
                }`}
              >
                Find Kiosk
              </Link>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-blue-400' : 'text-white/60 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/40">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs py-2 px-4"
                  style={{ width: 'auto' }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
