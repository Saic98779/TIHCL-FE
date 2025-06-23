import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg-img.jpg';
import logo from '../assets/tihcl-logo.png';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const TeamLogin = () => {
  const navigate = useNavigate();
  const [identifier, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!identifier || !password) {
    setError('Please enter both identifier and password');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      identifier,
      password
    });

    const { token, userRole, userId } = response.data;

    if (!token) throw new Error('Authentication failed');

    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userData', JSON.stringify({
      userId,
      identifier,
      role: userRole
    }));

    // Convert role to uppercase for consistent comparison
    const normalizedRole = userRole.toUpperCase();
    
    // Redirect based on exact role matches
    if (normalizedRole === 'MANEGER' || normalizedRole === 'MANAGER') {
      navigate('/Manager');
    } else if (normalizedRole === 'EXECUTIVE-MANAGER') {
      navigate('/ApplicationNew');
    } else {
      navigate('/TeamLogin');
    }
    
  } catch (error) {
    console.error("Login error:", error);
    setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
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
                <h5 className="text-center mb-3">Team Login</h5>
                <form onSubmit={handleLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="identifier"
                      placeholder="name@example.com"
                      value={identifier}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <label htmlFor="email">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <label htmlFor="password">Password</label>
                    {error && <div className="invalid-feedback">{error}</div>}
                  </div>
                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...</>
                      ) : 'Login'}
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

export default TeamLogin;
