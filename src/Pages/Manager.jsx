import React, { useState } from 'react';
import Level1 from '../Components/PendingApplication/Level1';
import Level2 from '../Components/PendingApplication/Level2';
import Level3 from '../Components/PendingApplication/Level3';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/tihcl-logo.png'; // ✅ Make sure the path is correct

function Manager() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const username = userData?.username || 'User';

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    navigate('/'); // Navigate to login or home
  };

  const renderLevel = () => {
    switch (selectedLevel) {
      case 1: return <Level1  />;
      case 2: return <Level2 />;
      case 3: return <Level3 />;
      default: return null;
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center px-4">
          
          {/* Left Section: Logo and Nav Items */}
          <div className="d-flex align-items-center gap-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ height: '40px' }}
            />

            <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
              <li className="nav-item">
                <a className="nav-link" href="#">Dashboard</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                  Pending Approvals
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><button className="dropdown-item" onClick={() => setSelectedLevel(1)}>Level 1</button></li>
                  <li><button className="dropdown-item" onClick={() => setSelectedLevel(2)}>Level 2</button></li>
                  <li><button className="dropdown-item" onClick={() => setSelectedLevel(3)}>Level 3</button></li>
                </ul>
              </li>
              <li className="nav-item"><a className="nav-link" href="#">View Application</a></li>
            </ul>
          </div>

          {/* Right Section: User */}
          <div className="position-relative">
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer' }}
            >
              <FaUserCircle size={24} className="me-2" />
              <span>{username}</span>
            </div>
            {dropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow p-2"
                style={{ minWidth: '150px', zIndex: 1000 }}
              >
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger w-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: '80px' }}>
        {renderLevel()}
      </div>
    </>
  );
}

export default Manager;
