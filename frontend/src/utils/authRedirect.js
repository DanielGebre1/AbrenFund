// authRedirect.js
import { useAuthStore } from '../hooks/useAuthStore';

export const checkAuthAndRedirect = (redirectPath = '/login') => {
  const { isInitialized, isLoggedIn, checkAuth } = useAuthStore.getState();

  return new Promise(async (resolve) => {
    if (!isInitialized) {
      await checkAuth();
    }

    const { isLoggedIn: loggedIn } = useAuthStore.getState();

    if (!loggedIn) {
      window.location.href = redirectPath;
      resolve(false);
    } else {
      resolve(true);
    }
  });
};

// Simple synchronous check
export const getAuthState = () => {
  const { isInitialized, isLoggedIn, user, role, token } = useAuthStore.getState();
  return { isInitialized, isLoggedIn, user, role, token };
};
