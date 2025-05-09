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
  // Add authorization token if exists
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only get CSRF cookie for non-GET requests
  if (config.method !== 'get') {
    try {
      await axios.get(`${config.baseURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: config.headers
      });
    } catch (error) {
      console.error('CSRF token could not be retrieved:', error);
      return Promise.reject(error);
    }
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const { response, config } = error;

    if (response) {
      switch (response.status) {
        case 401:
          if (!config.url.includes('/verification/') && 
              !config.url.includes('/admin/') && 
              !config.url.includes('/moderator/')) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('userData');
            toast.error('Session expired. Please log in again.');
            window.location.href = '/login';
          } else {
            return Promise.reject({
              ...error,
              isAuthError: true,
              message: 'Authentication required'
            });
          }
          break;

        case 403:
          toast.error('You are not authorized to perform this action');
          break;

        case 422:
          // Validation errors are handled by the calling component
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

// Auth Service Methods
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

// Verification Service Methods
export const VerificationService = {
  async submitVerification(formData) {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw { isAuthError: true, message: 'Authentication required' };
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await api.post('/api/verification/submit', formData, config);
      toast.success('Verification submitted successfully');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors;
      }
      throw error;
    }
  },

  async getVerificationStatus() {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        return { status: 'unauthenticated' };
      }

      const response = await api.get('/api/verification/status');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { status: 'unauthenticated' };
      }
      throw error;
    }
  }
};

// Admin Verification Service Methods
export const AdminVerificationService = {
  async getVerifications(page = 1, status = 'pending') {
    try {
      const response = await api.get('/api/admin/verifications', {
        params: { page, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getVerificationDetails(id) {
    try {
      const response = await api.get(`/api/admin/verifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async approveVerification(id) {
    try {
      const response = await api.put(`/api/admin/verifications/${id}/approve`);
      toast.success('Verification approved successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async rejectVerification(id, reason) {
    try {
      const response = await api.put(`/api/admin/verifications/${id}/reject`, { reason });
      toast.success('Verification rejected');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Moderator Verification Service Methods
export const ModeratorVerificationService = {
  async getVerifications(page = 1, status = 'pending') {
    try {
      const response = await api.get('/api/moderator/verifications', {
        params: { page, status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getVerificationDetails(id) {
    try {
      const response = await api.get(`/api/moderator/verifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async approveVerification(id) {
    try {
      const response = await api.put(`/api/moderator/verifications/${id}/approve`);
      toast.success('Verification approved successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async rejectVerification(id, reason) {
    try {
      const response = await api.put(`/api/moderator/verifications/${id}/reject`, { reason });
      toast.success('Verification rejected');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Campaign Service Methods
export const CampaignService = {
  async createCampaign(data) {
    try {
      const response = await api.post('/api/campaigns', data);
      toast.success('Campaign submitted successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCampaigns(params = {}) {
    try {
      const response = await api.get('/api/campaigns', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCampaignDetails(id) {
    try {
      const response = await api.get(`/api/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCampaign(id, data) {
    try {
      const response = await api.put(`/api/campaigns/${id}`, data);
      toast.success('Campaign updated successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCampaign(id) {
    try {
      const response = await api.delete(`/api/campaigns/${id}`);
      toast.success('Campaign deleted successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// User Service Methods
export const UserService = {
  async getUsers(params = {}) {
    try {
      const response = await api.get('/api/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserDetails(id) {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(id, data) {
    try {
      const response = await api.put(`/api/admin/users/${id}`, data);
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/api/admin/users/${id}`);
      toast.success('User deleted successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;