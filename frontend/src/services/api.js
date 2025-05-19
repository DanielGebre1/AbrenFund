import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  // Add authorization token if exists
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type to multipart/form-data for FormData requests
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
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
          toast.error(response.data?.message || 'Server error occurred. Please try again later.');
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

      const response = await api.post('/api/verification/submit', formData);
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

  async createCampaign(formData) {
    try {
      const response = await api.post('/api/campaigns', formData);
      toast.success('Campaign submitted successfully');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors;
      }
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
  },

  async checkVerification() {
    try {
      const response = await api.get('/api/verification/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Challenge Service Methods
export const ChallengeService = {
  async getChallenges(params = {}) {
    try {
      // Add type filter to only get challenges
      const response = await api.get('/api/campaigns', { 
        params: { ...params, type: 'challenge' } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getChallengeDetails(id) {
    try {
      const response = await api.get(`/api/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getChallengeProposals(challengeId) {
    try {
      const response = await api.get(`/api/campaigns/${challengeId}/proposals`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Proposal Service Methods
export const ProposalService = {
  /**
   * Get proposals with optional filters
   * @param {Object} params - Filter parameters
   * @param {string|number} [params.campaignId] - Optional campaign ID filter
   * @param {string} [params.userId] - Optional user ID filter ('current' for authenticated user)
   * @param {string} [params.status] - Optional status filter
   * @param {string} [params.search] - Optional search term
   * @returns {Promise} API response
   */
  async getProposals(params = {}) {
    try {
      // Handle both campaign-specific and general proposals endpoint
      const endpoint = params.campaignId 
        ? `/api/campaigns/${params.campaignId}/proposals`
        : '/api/proposals';
      
      // Remove campaignId from params to avoid duplicate in URL
      const { campaignId, ...queryParams } = params;
      
      const response = await api.get(endpoint, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get proposals for the current authenticated user
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response
   */
  async getMyProposals(params = {}) {
    try {
      const response = await api.get('/api/proposals', {
        params: { ...params, user_id: 'current' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get proposal details by ID
   * @param {string|number} id - Proposal ID
   * @returns {Promise} API response
   */
  async getProposalDetails(id) {
    try {
      const response = await api.get(`/api/proposals/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new proposal for a challenge
   * @param {string|number} campaignId - Challenge ID
   * @param {Object|FormData} formData - Proposal data
   * @returns {Promise} API response
   */
  async createProposal(campaignId, formData) {
    try {
      const response = await api.post(`/api/campaigns/${campaignId}/proposals`, formData);
      toast.success('Proposal submitted successfully');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors;
      }
      throw error;
    }
  },

  /**
   * Update an existing proposal
   * @param {string|number} id - Proposal ID
   * @param {Object|FormData} data - Updated proposal data
   * @returns {Promise} API response
   */
  async updateProposal(id, data) {
    try {
      const response = await api.put(`/api/proposals/${id}`, data);
      toast.success('Proposal updated successfully');
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors;
      }
      throw error;
    }
  },

  /**
   * Delete a proposal
   * @param {string|number} id - Proposal ID
   * @returns {Promise} API response
   */
  async deleteProposal(id) {
    try {
      const response = await api.delete(`/api/proposals/${id}`);
      toast.success('Proposal deleted successfully');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update proposal status (admin/owner only)
   * @param {string|number} id - Proposal ID
   * @param {string} status - New status
   * @param {string} [feedback] - Optional feedback
   * @returns {Promise} API response
   */
  async updateProposalStatus(id, status, feedback = '') {
    try {
      const response = await api.put(`/api/proposals/${id}/status`, {
        status,
        feedback
      });
      toast.success(`Proposal ${status} successfully`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Admin: Get all proposals with filters
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response
   */
  async adminGetProposals(params = {}) {
    try {
      const response = await api.get('/api/admin/proposals', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Admin: Update proposal status
   * @param {string|number} id - Proposal ID
   * @param {string} status - New status
   * @param {string} [feedback] - Optional feedback
   * @returns {Promise} API response
   */
  async adminUpdateProposalStatus(id, status, feedback = '') {
    try {
      const response = await api.put(`/api/admin/proposals/${id}/status`, {
        status,
        feedback
      });
      toast.success(`Proposal ${status} successfully`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;