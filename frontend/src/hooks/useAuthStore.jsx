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
          
          // Normalize user data structure
          const normalizedUser = userData.me || userData;

          if (!normalizedUser.email_verified_at) {
            toast.warning('Please verify your email before logging in.');
            set({ isLoading: false });
            return false;
          }

          localStorage.setItem('auth-token', authToken);
          localStorage.setItem('userData', JSON.stringify(normalizedUser));

          set({
            isLoggedIn: true,
            user: normalizedUser,
            token: authToken,
            role: normalizedUser.role || null,
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
          const token = localStorage.getItem('auth-token');
          if (token) {
            await api.post('/api/logout', null, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
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
          const { data } = await api.get('/api/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          // Normalize user data structure
          const normalizedUser = data.me || data;

          localStorage.setItem('userData', JSON.stringify(normalizedUser));

          set({
            isLoggedIn: true,
            user: normalizedUser,
            token: storedToken,
            role: normalizedUser.role || null,
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

      updateProfile: async (updatedData) => {
        set({ isLoading: true });
        try {
          const { token } = get();
          const { data } = await api.put('/api/profile', updatedData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          // Normalize user data structure
          const normalizedUser = data.user || data;

          localStorage.setItem('userData', JSON.stringify(normalizedUser));
          set({ user: normalizedUser });

          toast.success('Profile updated successfully!');
          return normalizedUser;
        } catch (error) {
          console.error('Profile update error:', error);
          const msg = error.response?.data?.message || 'Failed to update profile';
          toast.error(msg);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      uploadAvatar: async (file) => {
        set({ isLoading: true });
        try {
          const { token } = get();
          const formData = new FormData();
          formData.append('avatar', file);

          const { data } = await api.post('/api/upload-avatar', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          const currentUser = get().user;
          const updatedUser = { 
            ...currentUser, 
            avatar: data.url 
          };

          localStorage.setItem('userData', JSON.stringify(updatedUser));
          set({ user: updatedUser });

          toast.success('Profile picture updated!');
          return data.url;
        } catch (error) {
          console.error('Avatar upload error:', error);
          const msg = error.response?.data?.message || 'Failed to upload avatar';
          toast.error(msg);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
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