import { ApiErrorHandler } from '@/lib/utils';
import { getStoredToken } from '@/Neuron/hooks/use-auth';
import axios, { AxiosError, type AxiosResponse } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Axios response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => ApiErrorHandler.handle(error) // Centralized error handling
);
