import api from './api';

export const getMarkets = () => api.get('/markets');

export const getLatestPricesForCrop = (crop) => api.get('/markets/prices/latest', { params: { crop } });

export const getMarketPrices = (marketId, crop) =>
  api.get(`/markets/${marketId}/prices`, { params: crop ? { crop } : {} });
