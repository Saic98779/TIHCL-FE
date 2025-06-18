import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import otpImage from '../../assets/otp.png'; 
import bgImage from '../../assets/bg-img.jpg';
import axios from 'axios';
import { adminLogin, getAuthToken } from '../../services/authService/authService';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
const OTP_TIMEOUT = 15000;
const DEFAULT_OTP = '123456';

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Admin credentials (you might want to get these from a proper login flow)
  const ADMIN_CREDS = {
    email: 'executive1@gmail.com',
    password: 'password123'
  };

  const isOtpCorrect = otp === DEFAULT_OTP;
  
  const validateOtp = useCallback(() => {
    if (!otp.trim()) {
      setError('OTP is required');
      return false;
    }
    if (otp !== DEFAULT_OTP) {
      setError(`Invalid OTP. Please enter ${DEFAULT_OTP}`);
      return false;
    }
    setError('');
    return true;
  }, [otp]);

  // Function to authenticate admin before making the request
  const authenticateAdmin = async () => {
    try {
      setIsAuthenticating(true);
      await adminLogin(ADMIN_CREDS.email, ADMIN_CREDS.password);
      return true;
    } catch (error) {
      console.error('Admin authentication failed:', error);
      setError('System authentication failed. Please try again later.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchRegistrationData = async (phone, token) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/registrations/mobile/no/${phone}`, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) return;

    setIsLoading(true);
    setError('');

    const phone = localStorage.getItem('userPhone');
    if (!phone) {
      setIsLoading(false);
      setError('Phone number not found');
      return;
    }

    try {
      // First ensure we have a valid token
      let token = getAuthToken();
      if (!token) {
        const authSuccess = await authenticateAdmin();
        if (!authSuccess) return;
        token = getAuthToken();
      }

      // Now make the request with the token
      const response = await fetchRegistrationData(phone, token);

      if (response?.status === 200) {
        const { data } = response;
        navigate('/ApplicationForm', { 
          state: { 
            initialStep: 3,
            formData: {
              ...data,
              primaryContactNumber: phone
            },
            registrationId: data.applicationNo || `TH${Math.floor(100000 + Math.random() * 900000)}`,
            submissionDate: data.createdOn 
              ? new Date(data.createdOn).toLocaleDateString() 
              : new Date().toLocaleDateString()
          } 
        });
      } else {
        navigate('/ApplicationForm', { 
          state: { 
            initialStep: 1,
            formData: {
              primaryContactNumber: phone
            }
          } 
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.response?.status === 403) {
        // Token might be expired, try to re-authenticate
        try {
          const authSuccess = await authenticateAdmin();
          if (authSuccess) {
            const token = getAuthToken();
            const response = await fetchRegistrationData(phone, token);
            // Handle successful response here
            return;
          }
        } catch (reauthError) {
          setError('Session expired. Please try again from the beginning.');
          localStorage.removeItem('jwtToken');
          setTimeout(() => navigate('/'), 2000);
        }
      } else if (error.response?.status === 404) {
        navigate('/ApplicationForm', { state: { initialStep: 1 } });
      } else {
        setError(error.response?.data?.message || 
               'Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleResendOtp = useCallback((e) => {
    e.preventDefault();
    setOtp(DEFAULT_OTP);
    setError('');
  }, []);

  return (
    <section 
      className="otp-wrapper d-flex align-items-center justify-content-center min-vh-100" 
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-4">
            <div className="gradient-bg shadow-theme p-4 rounded-3">
              <div className="text-center mb-4">
                <img 
                  src={otpImage} 
                  alt="OTP Logo" 
                  className="img-fluid" 
                  width="150" 
                  loading="lazy"
                />
              </div>
              
              <h5 className="text-center mb-3">Verify Mobile Number</h5>
              <p className="text-center text-muted mb-4">
                We sent an OTP to your mobile number
                <br />
                Use dummy OTP: <strong>{DEFAULT_OTP}</strong>
              </p>

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                  {error.includes('too long') && (
                    <div className="mt-2">
                      <button 
                        className="btn btn-sm btn-outline-light"
                        onClick={handleSubmit}
                      >
                        Retry Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    id="otp" 
                    placeholder="Enter OTP" 
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                  <label htmlFor="otp">Enter OTP</label>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100"
                      onClick={() => navigate(-1)}
                      disabled={isLoading}
                    >
                      Back
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
        type="submit" 
        className="btn btn-primary w-100"
        disabled={!isOtpCorrect || isLoading}  // Only this line changes
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Verifying...
          </>
        ) : 'Submit'}
      </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Didn't receive code?{' '}
                    <button 
                      className="btn btn-link p-0" 
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Otp;