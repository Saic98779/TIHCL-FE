import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../services/authService/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) return <Navigate to="/TeamLogin" replace />;

  const userRole = getUserRole();
  if (!userRole) return <Navigate to="/unauthorized" replace />;

  // Handle the typo in role (MANEGER vs MANAGER)
  const normalizedRole = userRole.toUpperCase().includes('MANAGER') ? 'MANAGER' : userRole;
  
  const roleString = String(normalizedRole).toUpperCase();
  const isAllowed = allowedRoles.some(role =>
    roleString.includes(role.toUpperCase()) ||
    role.toUpperCase().includes(roleString)
  );

  return isAllowed ? children : <Navigate to="/unauthorized" replace />;
};


export default ProtectedRoute;