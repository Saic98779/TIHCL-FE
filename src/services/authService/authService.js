// src/services/authService/authService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Admin login function
export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify({
        userId: response.data.userId,
        email: response.data.email,
        role: response.data.userRole
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Get JWT token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

// Get user role from localStorage
export const getUserRole = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData).role : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout function
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userData');
};

// You can also add a default export if needed
export default {
  adminLogin,
  getAuthToken,
  getUserRole,
  isAuthenticated,
  logout
};