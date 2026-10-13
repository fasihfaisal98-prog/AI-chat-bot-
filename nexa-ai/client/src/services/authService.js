import api from '../lib/api';

/**
 * Register a new user account.
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data?.token) {
    localStorage.setItem('nexa_token', response.data.token);
  }
  return response.data;
};

/**
 * Authenticate existing user with credentials.
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data?.token) {
    localStorage.setItem('nexa_token', response.data.token);
  }
  return response.data;
};

/**
 * Log out user and invalidate cookie.
 */
export const logoutUser = async () => {
  localStorage.removeItem('nexa_token');
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Fetch current authenticated user session.
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
