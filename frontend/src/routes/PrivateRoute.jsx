// src/routes/PrivateRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

// PrivateRoute with optional role-based access
const PrivateRoute = ({ children, roles = [] }) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" />; // redirect to home if role is not allowed
  }

  return <>{children}</>;
};

export default PrivateRoute;
