import axios from 'axios';

// In development: VITE_API_URL is not set, so falls back to '/api'
// which hits the Vite dev proxy → localhost:5000
// In production: VITE_API_URL = 'https://your-backend.onrender.com/api'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('raindrop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('raindrop_token');
      localStorage.removeItem('raindrop_user');
    }
    return Promise.reject(err);
  }
);

export default api;
