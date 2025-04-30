// stores/authStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { toast } from 'react-toastify';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      role: null,
      isLoading: false,
      isInitialized: false,
      theme: 'light',

      setAuthData: (authData) => {
        set({
          isLoggedIn: authData.isLoggedIn,
          user: authData.user,
          token: authData.token,
          role: authData.role,
        });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          await api.get('/sanctum/csrf-cookie');
          const { data } = await api.post('/api/login', credentials);
          const { token: authToken, user: userData } = data;

          if (!userData.email_verified_at) {
            toast.warning('Please verify your email before logging in.');
            set({ isLoading: false });
            return false;
          }

          localStorage.setItem('auth-token', authToken);
          localStorage.setItem('userData', JSON.stringify(userData));

          set({
            isLoggedIn: true,
            user: userData,
            token: authToken,
            role: userData.role || null,
          });

          toast.success('Login successful!');
          return true;
        } catch (error) {
          console.error('Login error:', error);
          const msg = error.response?.data?.message || 'Login failed';
          toast.error(msg);
          set({ isLoggedIn: false, user: null, token: null, role: null });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/api/logout');
        } catch (err) {
          console.warn('Logout error:', err);
        } finally {
          set({ theme: 'light' });
          localStorage.removeItem('auth-token');
          localStorage.removeItem('userData');
          set({ isLoggedIn: false, user: null, token: null, role: null });
          toast.success('Logged out successfully!');
          set({ isLoading: false });
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          await api.get('/sanctum/csrf-cookie');
          await api.post('/api/register', userData);
          toast.success('Registration successful! Please verify your email before logging in.');
          return true;
        } catch (error) {
          console.error('Register error:', error);
          const errors = error.response?.data?.errors;
          if (errors) {
            Object.values(errors).forEach((msgArr) =>
              msgArr.forEach((msg) => toast.error(msg))
            );
          } else {
            toast.error(error.response?.data?.message || 'Registration failed');
          }
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        const storedToken = localStorage.getItem('auth-token');
        const storedUserData = localStorage.getItem('userData');

        if (!storedToken || !storedUserData) {
          set({
            isLoggedIn: false,
            user: null,
            token: null,
            role: null,
            theme: localStorage.getItem('theme') || 'light',
            isInitialized: true,
            isLoading: false,
          });
          return;
        }

        try {
          const { data: user } = await api.get('/api/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          set({
            isLoggedIn: true,
            user,
            token: storedToken,
            role: user.role || null,
            theme: localStorage.getItem('theme') || 'light',
          });
        } catch (error) {
          console.error('Check auth error:', error);
          localStorage.removeItem('auth-token');
          localStorage.removeItem('userData');
          set({
            isLoggedIn: false,
            user: null,
            token: null,
            role: null,
            theme: localStorage.getItem('theme') || 'light',
          });
        } finally {
          set({ isInitialized: true, isLoading: false });
        }
      },

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'auth',
      getStorage: () => localStorage,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
);
