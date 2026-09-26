import api from './api';

export const getLatestPrediction = (harvestId) => api.get(`/predictions/${harvestId}/latest`);

export const getPredictionHistory = (harvestId) => api.get(`/predictions/${harvestId}/history`);
