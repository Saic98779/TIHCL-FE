import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../services/authService/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/TeamLogin" replace />;
  }

  const userRole = getUserRole();
  
  // Check if user has any allowed role
  const isAllowed = allowedRoles.some(allowedRole => 
    userRole.includes(allowedRole) ||  // Check if role contains allowed role (for "EXECUTIVE-MANAGER")
    allowedRole.includes(userRole)     // Or if allowed role contains user role
  );
  
  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;