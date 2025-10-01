import apiClient from './apiClient';

const authService = {
  async login(credentials) {
    return await apiClient.post('/auth/login', credentials);
  },

  async register(userData) {
    return await apiClient.post('/auth/register', userData);
  },

  async refreshToken(refreshToken) {
    return await apiClient.post('/auth/refresh-token', { refreshToken });
  },

  async revokeToken(username) {
    return await apiClient.post('/auth/revoke-token', { username });
  },

  async getProfile() {
    return await apiClient.get('/auth/profile');
  },

  async getUserSummary(userId) {
    return await apiClient.get(`/auth/summary/${userId}`);
  }
};

export default authService;
