import React, { useState } from 'react';
import Level1 from '../Components/PendingApplication/Level1';
import Level2 from '../Components/PendingApplication/Level2';
import Level3 from '../Components/PendingApplication/Level3';

function Manager() {
  const [selectedLevel, setSelectedLevel] = useState(1);

  const renderLevel = () => {
    switch (selectedLevel) {
      case 1: return <Level1 />;
      case 2: return <Level2 />;
      case 3: return <Level3 />;
      default: return null;
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <div className="container-fluid d-block">
          <div className="row">
            <div className="col-6 col-md-4"></div>
            <div className="col-6 col-md-8">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item"><a className="nav-link" href="#">Dashboard</a></li>
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
            </div>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: '80px' }}>{renderLevel()}</div>
    </>
  );
}

export default Manager;