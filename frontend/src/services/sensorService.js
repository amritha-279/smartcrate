import api from './api';

export const postSensorReading = (data) => api.post('/sensors/readings', data);

export const getLatestReading = (harvestId) => api.get(`/sensors/readings/${harvestId}`);

export const getReadingHistory = (harvestId, limit = 50) =>
  api.get(`/sensors/history/${harvestId}`, { params: { limit } });
