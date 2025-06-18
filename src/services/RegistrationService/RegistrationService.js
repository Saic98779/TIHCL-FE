// src/services/RegistrationService.js
import api from '../api';

export const saveRegistration = async (registrationData) => {
  try {
    const response = await api.post('/registrations/save', registrationData);
    return response.data;
  } catch (error) {
    console.error('Error saving registration:', error);
    throw error;
  }
};

export const getRegistration = async (id) => {
  try {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching registration:', error);
    throw error;
  }
};

export const updateRegistration = async (id, data) => {
  try {
    const response = await api.put(`/registrations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating registration:', error);
    throw error;
  }
};

export const getAllDistricts = async () => {
  try {
    const response = await api.get('/getAllDistricts');
    return response.data;
  } catch (error) {
    console.error("Error fetching districts", error);
    throw error;
  }
};

export const getMandalsByDistrict = async (districtId) => {
  try {
    const response = await api.get(`/getAllmandalsOfDistrictsById/${districtId}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching mandals", error);
    throw error;
  }
};