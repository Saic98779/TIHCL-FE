import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { NewApplication } from "../../services/RegistrationService/RegistrationService";
import Header from "../ExecutiveHeader/Header";
import { useNavigate } from "react-router-dom";

const ApplicationNew = () => {
  const [applications, setApplications] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const pageSize = 10;

  const fetchApplications = async (page) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await NewApplication(page-1, pageSize);
      const data = Array.isArray(res?.data) ? res.data : [];
      setApplications(data);
      setTotalItems(res.totalElements || 0);
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to load applications");
      setApplications([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);

  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);
    startPage = Math.max(1, endPage - visiblePages + 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handleSelectApplication = (application) => {
    navigate('/Status', { 
      state: { 
        application,
        initialStep: 1
      } 
    });
  };

  return (
    <>
      <Header className="mb-4"/>
      <div className="application-new-container mt-5">
        <div className="card">
          <div className="card-header bg-theme text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">New Applications</h6>
          </div>

          <div className="card-body">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox fs-1 text-muted"></i>
                <p className="mt-2">No applications found</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover w-100">
                    <thead className="table-light">
                      <tr>
                        <th>App No.</th>
                        <th>Enterprise</th>
                        <th>Promoter</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <tr key={app.registrationUsageId || index}>
                          <td>{app.applicationNo || "N/A"}</td>
                          <td>{app.enterpriseName || "N/A"}</td>
                          <td>{app.promoterName || "N/A"}</td>
                          <td>{app.contactNumber || "N/A"}</td>
                          <td>{app.createdOn ? new Date(app.createdOn).toLocaleDateString() : "N/A"}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleSelectApplication(app)}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                  </div>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {getVisiblePages().map((page) => (
                      <button
                        key={page}
                        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"} me-2`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationNew;