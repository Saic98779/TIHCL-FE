import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from '../../assets/tihcl-logo.png'
const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container space-between">
          {/* Logo/Brand */}
          <a className="navbar-brand" href="#">
            <img 
              src={logo} 
              alt="TIHCL Logo" 
              style={{ height: '50px' }} // Adjust height as needed
            />
          </a>
          
          {/* Mobile Toggle Button */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent" 
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Content - Will collapse on mobile */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Contact Info - Aligned to right on desktop, stacked on mobile */}
            <div className="ms-lg-auto"> {/* ms-lg-auto pushes right only on large screens */}
              <ul className="navbar-nav">
                <li className="nav-item">
                  <span className="nav-link">
                    <i className="bi bi-geo-alt me-1"></i> Hyderabad, India
                  </span>
                </li>
                <li className="nav-item">
                  <span className="nav-link">
                    <i className="bi bi-envelope me-1"></i> compliance@tihcl.com
                  </span>
                </li>
                <li className="nav-item">
                  <span className="nav-link">
                    <i className="bi bi-telephone me-1"></i> 040-232363990
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;