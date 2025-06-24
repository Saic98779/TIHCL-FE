// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg-img.jpg';
import logo from '../../assets/tihcl-logo.png';
import './Login.css';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = () => {
    setError('');

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (/\D/.test(phone)) {
      setError('Phone number should only contain numbers');
      return false;
    }

    if (!/^[5-9]/.test(phone)) {
      setError('Phone number must start with 5, 6, 7, 8 or 9');
      return false;
    }

    if (phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }

    return true;
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier: "executive1@gmail.com",
        password: 'password123', // default password as per your request
      });

      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify({
          userId: response.data.userId,
          identifiers: response.data.identifiers,
          role: response.data.userRole,
          UserName: response.data.userName
        }));
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('primaryContactNumber', phone);

        navigate('/Otp');
      } else {
        setError('Login failed. No token received.');
      }

    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <section className="login-content">
        <div className="container-fluid">
          <div className="row align-items-center vh-100">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
              <div className="gradient-bg shadow-theme p-3">
                <div className="text-center mb-4">
                  <img src={logo} alt="Logo" className="img-fluid" width="120" />
                </div>

                <h5 className="text-center mb-3">Login to your account</h5>
                <form onSubmit={handlePhoneLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="tel"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="phone"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhone(value);

                        if (
                          error && (
                            (error.includes('short') && value.length >= 10) ||
                            (error.includes('long') && value.length <= 10) ||
                            (error.includes('start') && /^[5-9]/.test(value)) ||
                            (error.includes('only contain') && !/\D/.test(value))
                          )
                        ) {
                          setError('');
                        }
                      }}
                      onBlur={() => {
                        if (phone.length === 10) validatePhone();
                      }}
                      disabled={isLoading}
                      inputMode="numeric"
                    />
                    <label htmlFor="phone">Mobile No.</label>
                    {error && <div className="invalid-feedback">{error}</div>}
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : 'Send OTP'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
