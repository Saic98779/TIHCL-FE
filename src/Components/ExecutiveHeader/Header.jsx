import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/tihcl-logo.png';
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ activeTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUsername(parsed?.username || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <header className="mb-5" style={{ height: "50px" }}>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light ">
        <div className="container-fluid d-block">
          <div className="row align-items-center">
            <div className="col-6 col-md-4">
              <Link className="navbar-brand" to="/">
                <img src={logo} alt="" className="img-fluid w-auto" />
              </Link>
            </div>

            <div className="col-6 col-md-4">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Dashboard</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link className={`nav-link dropdown-toggle ${activeTab === 'applications' ? 'active' : ''}`}
                      to="#" id="navbarDropdown" role="button"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      Applications
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li>
                        <Link className={`dropdown-item ${activeTab === 'new' ? 'active' : ''}`}
                          to="/ApplicationNew">New</Link>
                      </li>
                      <li>
                        <Link className={`dropdown-item ${activeTab === 'pending' ? 'active' : ''}`}
                          to="/ApplicationPending">Pending</Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/repayment">Repayment</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/performance">Update Performance</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* ✅ USER PROFILE DROPDOWN */}
            <div className="col-6 col-md-4 d-flex justify-content-end align-items-center position-relative">
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer' }}
              >
                <FaUserCircle size={24} className="me-2" />
                <span>{username}</span>
              </div>

              {showDropdown && (
                <div
                  className="position-absolute end-0 mt-2 bg-white shadow rounded px-3 py-2"
                  style={{ top: '100%', zIndex: 1000 }}
                >
                  <button className="btn btn-sm btn-outline-danger w-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
