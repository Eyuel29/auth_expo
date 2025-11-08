import axios from 'axios';

const API_BASE_URL = 'https://syn-exp-1.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export type ApiClient = typeof apiClient;
