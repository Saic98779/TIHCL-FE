// src/services/RegistrationService.js
import api from '../api';
import { getAuthToken } from '../authService/authService'; // update path as needed

export const saveRegistration = async (registrationData) => {
  try {
    const token = getAuthToken();

    const response = await api.post('/registrations/save', registrationData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error saving registration:', error.response?.data || error.message);
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

export const NewApplication = async (pageNo = 1, pageSize = 10) => {

  try {
    const response = await api.get('/registrations/new/applications', {
      params: {
        pageSize,
        pageNo
      }
    });
    // Assuming response.data contains:
    // {
    //   data: [array of applications],
    //   totalItems: number
    // }

    return response.data; // no restructuring here
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

export const PendingApplication = async (pageNo = 1, pageSize = 4) => {
  try {
    const response = await api.get('/registrations/under-processing', {
      params: { pageNo: pageNo - 1, pageSize } // Note: pageNo-1 for 0-based index
    });

    // Return the raw API response structure
    return response.data;
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    throw error;
  }
};






//  this function is for preliminary assessment


export const preliminaryAssessment = async (registrationUsageId) => {
  try {
    const response = await api.get(`/registrations/usage/id/${registrationUsageId}`);
    return response.data; // Return just the data part
  } catch (error) {
    console.error("Error in preliminaryAssessment:", error);
    throw error;
  }
};

export const submitPreliminaryAssessment = async (applicationNo, assessmentData) => {
  try {
    const response = await api.post(
      `/registrations/preliminary/save/${applicationNo}`,
      assessmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting assessment:", error);
    throw error;
  }
};




// manager level1 
export const managerLevelOne = async (pageNo = 0, pageSize = 10) => {
  try {
    const response = await api.get(`/registrations/status`, {
      params: {
        status: "PRELIMINARY_ASSESSMENT",
        pageNo,
        pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error in managerLevelOne:", error);
    throw error;
  }
};




// manager one application status updating



export const updateApplicationStatusByManagerOneApprove = async (
  applicationNo,
  applicationStatus,
  reasonForRejection
) => {
  console.log(applicationNo, applicationStatus, reasonForRejection);

  try {
    const response = await api.put(
      `/registrations/status/updation/${applicationNo}?appStatus=${applicationStatus}&reasonForRejection=${reasonForRejection}`,

    );

    console.log("Response from manager one API:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};


export const updateApplicationStatusByManagerOneReject = async (
  applicationNo,
  applicationStatus,
  reasonForRejection
) => {
  console.log(applicationNo, applicationStatus, reasonForRejection);

  try {
    const response = await api.put(
      `/registrations/status/updation/${applicationNo}?appStatus=${applicationStatus}&reasonForRejection=${reasonForRejection}`,

    );

    console.log("Response from manager one API:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};




//  unit visit api call 

export const UnitVisit = async () => {

  try {
    const response = api.post(`/unitvisit/save`)

    console.log(response.data)
    return response.data
  } catch (error) {

    console.log('error in the unit visit api', error)

  }

}
