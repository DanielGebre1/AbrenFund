// This is a simple utility to check if user is logged in and redirect if needed
// In a real app, this would use your authentication system

export const checkAuthAndRedirect = (redirectPath) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      window.location.href = redirectPath;
      return false;
    }
    
    return true;
  };