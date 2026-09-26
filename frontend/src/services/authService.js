import api from './api';

export const sendOtp = (mobile) => api.post('/auth/send-otp', { mobile });

export const verifyOtp = (mobile, otp) => api.post('/auth/verify-otp', { mobile, otp });

export const register = (data) => api.post('/auth/register', data);

export const getMe = () => api.get('/auth/me');
