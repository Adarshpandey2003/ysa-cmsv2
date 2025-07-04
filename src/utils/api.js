// src/utils/api.js
import axios from 'axios';

// hard-coded or from config/env as appropriate:
const API_BASE_URL = 'http://localhost:5400/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// —— Add this interceptor ——
// before every request, grab the token and set the header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ysa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
