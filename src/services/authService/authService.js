import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const adminLogin = async (identifiers, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { identifiers, password });
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify({
        userId: response.data.userId,
        identifiers: response.data.identifiers,
        role: response.data.userRole,
        UserName: response.data.userName
      }));
    }
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

export const getAuthToken = () => localStorage.getItem('jwtToken');
export const getUserRole = () => JSON.parse(localStorage.getItem('userData'))?.role || null;
export const isAuthenticated = () => !!getAuthToken();
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userData');
};

export default { adminLogin, getAuthToken, getUserRole, isAuthenticated, logout };