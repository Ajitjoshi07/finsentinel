import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({ baseURL: BASE, timeout: 15000 });

// Dashboard
export const getDashboard = () => api.get('/analytics/dashboard').then(r => r.data);
export const getRiskDistribution = () => api.get('/analytics/risk-distribution').then(r => r.data);
export const getCategoryBreakdown = () => api.get('/analytics/category-breakdown').then(r => r.data);
export const getHourlyStats = () => api.get('/analytics/hourly').then(r => r.data);
export const getTimeSeries = () => api.get('/analytics/timeseries').then(r => r.data);
export const getGeoBubbles = () => api.get('/analytics/geo-bubbles').then(r => r.data);
export const getTopCards = () => api.get('/analytics/top-cards-at-risk').then(r => r.data);

// Transactions
export const getTransactions = (params?: any) =>
  api.get('/transactions', { params }).then(r => r.data);
export const getTransaction = (id: string) =>
  api.get(`/transactions/${id}`).then(r => r.data);

// Alerts
export const getAlerts = (params?: any) =>
  api.get('/alerts', { params }).then(r => r.data);
export const updateAlert = (id: string, payload: any) =>
  api.patch(`/alerts/${id}`, payload).then(r => r.data);

// Simulate
export const simulate = (scenario: string, count: number) =>
  api.post('/simulate', { scenario, count }).then(r => r.data);

// Model
export const getModelInfo = () => api.get('/model/info').then(r => r.data);

// WebSocket
export const createWebSocket = (): WebSocket => {
  const wsBase = BASE.replace(/^http/, 'ws');
  return new WebSocket(`${wsBase}/ws/feed`);
};
