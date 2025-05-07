import { useState, useEffect } from 'react';
import { useAuthStore } from '../hooks/useAuthStore'; // Import your auth store

export const useUserRole = () => {
  // Get user data from your auth store
  const { user, setUser } = useAuthStore();
  const [role, setRole] = useState(user?.role || 'user');

  // Sync with auth store whenever role changes
  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  // Update both local state and auth store
  const updateRole = (newRole) => {
    setRole(newRole);
    setUser({ ...user, role: newRole });
  };

  // Role hierarchy check
  const hasRole = (requiredRole) => {
    const roleHierarchy = {
      user: 0,
      creator: 1,
      moderator: 2,
      admin: 3
    };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  // Role-specific checks
  const isModerator = () => role === 'moderator';
  const isCreator = () => role === 'creator';
  const isAdmin = () => role === 'admin';

  // Auth status from store
  const isLoggedIn = () => !!user;

  // Login should be handled by your auth store
  const login = () => {
    // Your auth store should handle actual login
    console.log('Login should be handled by auth store');
  };

  // Logout should be handled by your auth store
  const logout = () => {
    // Your auth store should handle actual logout
    console.log('Logout should be handled by auth store');
  };

  return { 
    role, 
    updateRole, 
    hasRole,
    isModerator,
    isCreator,
    isAdmin,
    isLoggedIn,
    login,
    logout
  };
};