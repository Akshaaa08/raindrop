import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CitySelect from './pages/CitySelect';
import KioskDisplay from './pages/KioskDisplay';
import Scan from './pages/Scan';
import Payment from './pages/Payment';
import Waiting from './pages/Waiting';
import Return from './pages/Return';
import FinalPay from './pages/FinalPay';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/scan/:kioskId" element={<Scan />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/cities"
            element={<ProtectedRoute><CitySelect /></ProtectedRoute>}
          />
          <Route
            path="/kiosk/:kioskId"
            element={<ProtectedRoute><KioskDisplay /></ProtectedRoute>}
          />
          <Route
            path="/payment/:kioskId"
            element={<ProtectedRoute><Payment /></ProtectedRoute>}
          />
          <Route
            path="/waiting"
            element={<ProtectedRoute><Waiting /></ProtectedRoute>}
          />
          <Route
            path="/return/:kioskId"
            element={<ProtectedRoute><Return /></ProtectedRoute>}
          />
          <Route
            path="/final"
            element={<ProtectedRoute><FinalPay /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
