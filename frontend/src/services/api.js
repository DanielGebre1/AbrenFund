import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  // Only get CSRF cookie for non-GET requests
  if (config.method !== 'get') {
    try {
      await axios.get(`${config.baseURL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('CSRF token could not be retrieved:', error);
      return Promise.reject(error);
    }
  }

  // Add authorization token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          toast.error('Session expired. Please log in again.');
          // window.location.href = '/login';
          break;

        case 403:
          toast.error('You are not authorized to perform this action');
          break;

        case 422:
          // Validation errors handled in specific components
          break;

        case 500:
          toast.error('Server error occurred. Please try again later.');
          break;

        default:
          toast.error(response.data?.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// -------------------------
// Auth Service Methods
// -------------------------
export const AuthService = {
  async requestResetLink(email) {
    try {
      const response = await api.post('/api/password/email', { email });
      toast.success('If an account exists, a reset link has been sent');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(data) {
    try {
      const response = await api.post('/reset-password', data);
      toast.success('Password reset successfully');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors;
      }
      throw error;
    }
  },

  async verifyResetToken(token, email) {
    try {
      const response = await api.get(
        `/api/verify-reset-token?token=${token}&email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { valid: false };
      }
      throw error;
    }
  }
};

// -------------------------
// Campaign Service Methods
// -------------------------
export const CampaignService = {
  /**
   * Create a new campaign
   * @param {object} data - Campaign data including images
   * @returns {Promise}
   */
  async createCampaign(data) {
    try {
      const response = await api.post('/api/campaigns', data);
      toast.success('Campaign submitted successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;


