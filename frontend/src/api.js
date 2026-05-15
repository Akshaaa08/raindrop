import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
