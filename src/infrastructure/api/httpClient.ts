import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const httpClient = axios.create({ baseURL: API_URL });

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('saag_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
