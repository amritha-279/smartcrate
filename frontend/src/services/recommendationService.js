import api from './api';

export const generateRecommendation = (harvestId) =>
  api.post('/recommendations/generate', { harvestId });

export const getLatestRecommendation = (harvestId) =>
  api.get(`/recommendations/${harvestId}/latest`);
