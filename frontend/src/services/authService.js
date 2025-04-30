// services/AuthService.js

import api from './api';
import { toast } from 'react-toastify';

const AuthService = {
  /**
   * Login the user
   * @param {object} data { email, password, remember }
   * @returns Promise
   */
  async login({ email, password, remember }) {
    try {
      await api.get('/sanctum/csrf-cookie'); // Ensure CSRF token

      const response = await api.post('/api/login', {
        email,
        password,
        remember,
      });

      toast.success('Login successful');
      return response.data;
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.response) {
        if (error.response.status === 422) {
          message = error.response.data.message || 'Validation error';
        } else if (error.response.status === 401) {
          message = 'Invalid email or password';
        }
      }
      toast.error(message);
      throw error;
    }
  },

  /**
   * Request password reset link
   * @param {string} email
   * @returns Promise
   */
  async requestResetLink(email) {
    try {
      const response = await api.post('/forgot-password', { email });
      toast.success('Reset link sent to your email');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
      throw error;
    }
  },

  /**
   * Reset user password
   * @param {object} data { token, email, password, password_confirmation }
   * @returns Promise
   */
  async resetPassword(data) {
    try {
      const response = await api.post('/reset-password', data);
      toast.success('Password reset successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
      throw error;
    }
  },

  /**
   * Verify reset token validity
   * @param {string} token
   * @param {string} email
   * @returns Promise
   */
  async verifyResetToken(token, email) {
    try {
      const response = await api.get(
        `/verify-reset-token?token=${token}&email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      toast.error('Invalid or expired reset token');
      throw error;
    }
  },
};

export default AuthService;
