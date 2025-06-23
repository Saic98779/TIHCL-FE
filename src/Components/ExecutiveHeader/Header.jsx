import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ activeTab }) => {
  return (
    <header className='mb-5' style={{height:"50px"}}>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <div className="container-fluid d-block">
          <div className="row">
            <div className="col-6 col-md-4">                        
              <Link className="navbar-brand" to="/">
                <img src="assets/img/tihcl-logo.png" alt="" className="img-fluid w-auto" />
              </Link>
            </div>
            <div className="col-6 col-md-8">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/">Dashboard</Link>
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
          </div>                
        </div>
      </nav>
    </header>
  );
};

export default Header;