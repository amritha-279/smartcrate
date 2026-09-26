import api from './api';

export const getAdminStats = () => api.get('/admin/stats');

export const getAllFarmers = () => api.get('/admin/farmers');

export const getAllHarvests = () => api.get('/admin/harvests');
