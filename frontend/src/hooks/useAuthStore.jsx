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

      cleanStorage: () => {
        // Clear all auth-related keys consistently
        localStorage.removeItem('auth');
        localStorage.removeItem('auth-token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userVerified');
        localStorage.removeItem('pendingVerificationEmail');
        
        // Only keep non-auth preferences
        const theme = localStorage.getItem('theme') || 'light';
        localStorage.clear();
        localStorage.setItem('theme', theme); // Preserve theme preference
        
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          role: null,
          theme: theme,
          isInitialized: true
        });
      },

      clearVerificationState: () => {
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('userVerified');
        
        // Update state if needed
        if (get().user) {
          set({
            user: {
              ...get().user,
              is_verified: 1,
              email_verified_at: new Date().toISOString()
            }
          });
        }
      },

      checkStorageConsistency: () => {
        const authToken = localStorage.getItem('auth-token');
        const userData = localStorage.getItem('userData');
        const authState = JSON.parse(localStorage.getItem('auth') || '{}').state;
        
        // If inconsistencies found, clean up
        if ((authToken && !userData) || 
            (userData && !authToken) || 
            (authState?.isLoggedIn && !authToken)) {
          console.warn('Storage inconsistency detected, cleaning...');
          get().cleanStorage();
          return false;
        }
        return true;
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          await api.get('/sanctum/csrf-cookie');
          const { data } = await api.post('/api/login', credentials);
          
          // Clear any pending verification state
          localStorage.removeItem('pendingVerificationEmail');
          
          const { token: authToken, user: userData } = data;
          const normalizedUser = {
            ...(userData.me || userData),
            role: (userData.me || userData).role || 'user' // Default role
          };

          if (!normalizedUser.email_verified_at) {
            toast.warning('Please verify your email before logging in.');
            localStorage.setItem('pendingVerificationEmail', credentials.email);
            set({ isLoading: false });
            return false;
          }

          localStorage.setItem('auth-token', authToken);
          localStorage.setItem('userData', JSON.stringify(normalizedUser));

          set({
            isLoggedIn: true,
            user: normalizedUser,
            token: authToken,
            role: normalizedUser.role,
          });

          toast.success('Login successful!');
          return true;
        } catch (error) {
          console.error('Login error:', error);
          const msg = error.response?.data?.message || 'Login failed';
          if (msg.includes('verify')) {
            localStorage.setItem('pendingVerificationEmail', credentials.email);
          }
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
          const token = get().token || localStorage.getItem('auth-token');
          if (token) {
            await api.post('/api/logout', null, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        } catch (err) {
          console.warn('Logout error:', err);
        } finally {
          get().cleanStorage();
          toast.success('Logged out successfully!');
          set({ isLoading: false });
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          await api.get('/sanctum/csrf-cookie');
          await api.post('/api/register', userData);
          localStorage.setItem('pendingVerificationEmail', userData.email);
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

      resendVerification: async (email) => {
        set({ isLoading: true });
        try {
          await api.get('/sanctum/csrf-cookie');
          const { data } = await api.post('/api/email/verification-notification', { email });
          if (data.message === 'Verification link sent!') {
            toast.success('Verification email has been sent!');
            return true;
          } else {
            toast.error('Failed to resend verification email');
            return false;
          }
        } catch (error) {
          console.error('Resend verification error:', error);
          toast.error(error.response?.data?.message || 'An error occurred while resending the email');
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        
        if (!get().checkStorageConsistency()) {
          set({ isInitialized: true, isLoading: false });
          return;
        }

        const storedToken = localStorage.getItem('auth-token');
        const storedUserData = localStorage.getItem('userData');

        if (!storedToken || !storedUserData) {
          get().cleanStorage();
          set({ isInitialized: true, isLoading: false });
          return;
        }

        try {
          const { data } = await api.get('/api/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          const normalizedUser = {
            ...(data.user || data.me || data),
            role: (data.user || data.me || data).role || JSON.parse(storedUserData).role
          };
          localStorage.setItem('userData', JSON.stringify(normalizedUser));

          set({
            isLoggedIn: true,
            user: normalizedUser,
            token: storedToken,
            role: normalizedUser.role || null,
            theme: localStorage.getItem('theme') || 'light',
          });

          // Clear verification state if user is verified
          if (normalizedUser.email_verified_at) {
            get().clearVerificationState();
          }
        } catch (error) {
          console.error('Check auth error:', error);
          if (error.response?.status === 401) {
            get().cleanStorage();
          }
        } finally {
          set({ isInitialized: true, isLoading: false });
        }
      },

      setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
      },

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