import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg-img.jpg';
import logo from '../../assets/tihcl-logo.png';
//import './Login.css';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Registration() {
  const navigate = useNavigate();
  const [registerNumber, setRegisterNumber] = useState('');
  const [registerError, setRegisterError] = useState('');

  const validateRegisterNumber = () => {
    const phoneRegex = /^\+91[5-9][0-9]{9}$/;

    if (!registerNumber.trim()) {
      setRegisterError('Phone number is required.');
      return false;
    }

    if (!phoneRegex.test(registerNumber)) {
      setRegisterError('Enter a valid number with country code +91 and 10 digits starting from 5 to 9.');
      return false;
    }

    setRegisterError('');
    return true;
  };

  const handleRegister =  (e) => {
    e.preventDefault();

    const isValid = validateRegisterNumber();
    if (!isValid) return;

    try {
       handlePhoneSubmit(registerNumber);
      navigate('/otp');
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handlePhoneSubmit = async (phone) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/RegiterNumber`, { phone });
      console.log("Phone sent successfully:", res.data);
    } catch (err) {
      console.error("Error sending phone:", err);
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
                  <img src={logo} alt="Logo" className="img-fluid" width="100" />
                </div>
                <h5 className="text-center mb-1">Hi! Welcome to TIHC</h5>
                <p className="text-center text-muted">Create your account</p>
                <form onSubmit={handleRegister}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="+91XXXXXXXXXX"
                      value={registerNumber}
                      onChange={(e) => {
                        setRegisterNumber(e.target.value);
                        if (registerError) validateRegisterNumber(); // real-time validate if error already shown
                      }}
                      onBlur={validateRegisterNumber} // validate when input loses focus
                    />
                    <label htmlFor="phone">Phone No.</label>
                    {registerError && registerNumber && (
                      <small className="text-danger">{registerError}</small>
                    )}
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary">Register</button>
                  </div>

                  <div className="text-center">
                    <p>Already have an account? <a href="login.html">Login</a></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Registration;
