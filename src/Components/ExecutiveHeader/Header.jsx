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
    navigate('/Teamlogin');
  };

  return (
    <header className="mb-5" style={{ height: "50px" }}>
  <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
    <div className="container-fluid">
      {/* Logo (left side) */}
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: "40px" }} />
      </Link>

      {/* Nav Menu (immediately after logo) */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item dropdown">
            <Link
              className={`nav-link dropdown-toggle ${activeTab === "applications" ? "active" : ""}`}
              to="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Applications
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link className={`dropdown-item ${activeTab === "new" ? "active" : ""}`} to="/ApplicationNew">
                  New
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item ${activeTab === "pending" ? "active" : ""}`} to="/ApplicationPending">
                  Pending
                </Link>
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

      {/* User Profile (right side) */}
      <div className="d-flex align-items-center ms-auto">
        <div className="dropdown">
          <div
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserCircle size={24} className="me-2" />
            <span>{username}</span>
          </div>
          {showDropdown && (
            <div className="dropdown-menu dropdown-menu-end show">
              <button className="dropdown-item btn btn-sm btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Toggle Button (only shows on small screens) */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
</header>
  );
};

export default Header;
