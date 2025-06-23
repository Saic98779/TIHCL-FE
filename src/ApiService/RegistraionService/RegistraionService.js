// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// console.log("backend url ",API_BASE_URL)
// const handleResponse = async (response) => {
//   // First check if the response has content
//   const contentLength = response.headers.get('content-length');
//   const hasContent = contentLength && parseInt(contentLength) > 0;
  
//   try {
//     // Handle empty responses (like 204 No Content)
//     if (!hasContent || response.status === 204) {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return null;
//     }

//     // Try to parse JSON
//     const data = await response.json();
    
//     if (!response.ok) {
//       const error = new Error(data.message || `API request failed with status ${response.status}`);
//       error.response = response;
//       error.data = data;
//       throw error;
//     }
    
//     return data;
//   } catch (error) {
//     // If JSON parsing fails, try to get the response text
//     if (error instanceof SyntaxError) {
//       const text = await response.text();
//       const error = new Error(text || `Request failed with status ${response.status}`);
//       error.response = response;
//       throw error;
//     }
//     throw error;
//   }
// };

// export const saveRegistration = async (registrationData) => {
//   try {
//     console.log('API Request to:', `${API_BASE_URL}/registrations/save`);
//     console.log('Request Payload:', registrationData);
    
//     const response = await fetch(`${API_BASE_URL}/registrations/save`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(registrationData),
//     });

//     const data = await handleResponse(response);
//     console.log('API Response:', data);
//     return data;
//   } catch (error) {
//     console.error('API Error Details:', {
//       message: error.message,
//       stack: error.stack,
//       response: error.response ? {
//         status: error.response.status,
//         statusText: error.response.statusText,
//         url: error.response.url
//       } : undefined
//     });
    
//     // Enhance error message for common cases
//     if (error.message.includes('Failed to fetch')) {
//       throw new Error('Network error - please check your internet connection');
//     } else if (error.response?.status === 404) {
//       throw new Error('API endpoint not found (404) - please check the URL');
//     } else if (error.response?.status === 500) {
//       throw new Error('Server error - please try again later');
//     }
    
//     throw error;
//   }
// };

// export const getRegistrationStatus = async (registrationId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}`);
//     return await handleResponse(response);
//   } catch (error) {
//     console.error('Status Check Error:', {
//       registrationId,
//       error: error.message
//     });
//     throw error;
//   }
// };

// // Utility function for testing the API connection
// export const testApiConnection = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/health`);
//     return await handleResponse(response);
//   } catch (error) {
//     console.error('API Connection Test Failed:', error);
//     throw error;
//   }
// };