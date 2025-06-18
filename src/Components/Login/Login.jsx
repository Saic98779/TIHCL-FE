// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg-img.jpg';
import logo from '../../assets/tihcl-logo.png';
import './Login.css';
import { adminLogin } from '../../services/authService/authService';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('executive1@gmail.com'); // Pre-filled for demo
  const [password, setPassword] = useState('password123'); // Pre-filled for demo
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const validatePhone = () => {
    if (!phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await adminLogin(email, password);
      navigate('/dashboard'); // Redirect to admin dashboard
    } catch (error) {
      setError(error.response?.data?.message || 'Admin login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setIsLoading(true);
    setError('');

    try {
      // Store phone in localStorage for OTP verification and later use
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('primaryContactNumber', phone);
      
      // Navigate to OTP page
      navigate('/Otp');
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'Network error. Please try again.');
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
                
                {isAdminLogin ? (
                  <>
                    <h5 className="text-center mb-3">Admin Login</h5>
                    <form onSubmit={handleAdminLogin}>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                      <div className="d-grid mb-3">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                      </div>
                      <div className="text-center">
                        <button 
                          type="button" 
                          className="btn btn-link"
                          onClick={() => setIsAdminLogin(false)}
                        >
                          Back to User Login
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h5 className="text-center mb-3">Login to your account</h5>
                    <form onSubmit={handlePhoneLogin}>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className={`form-control ${error ? 'is-invalid' : ''}`}
                          id="phone"
                          placeholder="Mobile No."
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (error) validatePhone();
                          }}
                          disabled={isLoading}
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
                              Checking...
                            </>
                          ) : 'Send OTP'}
                        </button>
                      </div>
                      <div className="text-center">
                        <button 
                          type="button" 
                          className="btn btn-link"
                          onClick={() => setIsAdminLogin(true)}
                        >
                          Admin Login
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;