import api from './api';

export const createHarvest = (data) => api.post('/harvests', data);

export const getHarvests = (status) => api.get('/harvests', { params: status ? { status } : {} });

export const getHarvest = (id) => api.get(`/harvests/${id}`);

export const updateHarvest = (id, data) => api.put(`/harvests/${id}`, data);

export const deleteHarvest = (id) => api.delete(`/harvests/${id}`);
