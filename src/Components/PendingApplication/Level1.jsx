import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import { managerLevelOne } from '../../services/RegistrationService/RegistrationService';

function Level1() {
  const [allApplications, setAllApplications] = useState([]);
  const [displayedApplications, setDisplayedApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pageSizeOptions = [4, 10, 25, 50, 75];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await managerLevelOne(currentPage, pageSize);
        console.log("API Response:", response);

        if (response.content && Array.isArray(response.content)) {
          setAllApplications(response.content);
          setTotalPages(response.totalPages || 1);
          setTotalItems(response.totalElements || response.content.length);

          if (response.content.length > pageSize) {
            const startIdx = (currentPage - 1) * pageSize;
            const endIdx = startIdx + pageSize;
            setDisplayedApplications(response.content.slice(startIdx, endIdx));
          } else {
            setDisplayedApplications(response.content);
          }
        } else {
          console.log('Unexpected response format', response);
          setAllApplications([]);
          setDisplayedApplications([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setAllApplications([]);
        setDisplayedApplications([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleConfirmApprove = () => {
    // API call to approve the application
    console.log('Approving application:', selectedApplication);
    setShowApproveModal(false);
    setShowModal(false);
    setShowSuccessModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    // API call to reject the application with remarks
    console.log('Rejecting application:', selectedApplication, 'with remarks:', rejectRemarks);
    setShowRejectModal(false);
    setShowModal(false);
    setRejectRemarks('');
    setShowSuccessModal(true);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);

    if (allApplications.length > 0) {
      const startIdx = 0;
      const endIdx = newSize;
      setDisplayedApplications(allApplications.slice(startIdx, endIdx));
      setTotalPages(Math.ceil(allApplications.length / newSize));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      if (allApplications.length > 0) {
        const startIdx = (page - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        setDisplayedApplications(allApplications.slice(startIdx, endIdx));
      }
    }
  };

  const getDisplayRange = () => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    return { startItem, endItem };
  };

  const { startItem, endItem } = getDisplayRange();

  return (
    <section className="pt-3">
      <div className="container-fluid">
        <div className="card">
          <div className="card-header bg-theme text-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Pending Approvals - Level 1</h6>
            <div className="d-flex align-items-center">
              <label htmlFor="pageSize" className="me-2 mb-0 text-white">Items per page:</label>
              <select
                id="pageSize"
                className="form-select form-select-sm w-auto px-4"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Loading applications...</p>
              </div>
            ) : displayedApplications.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox fs-1 text-muted"></i>
                <p className="mt-2">No applications found</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover w-100 fs-md mt-0">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>View</th>
                        <th>Date Application</th>
                        <th>Executive Name</th>
                        <th>Executive Feedback Date</th>
                        <th>Company Name</th>
                        <th>Promoter Name</th>
                        <th>Mobile No.</th>
                        <th>Industry</th>
                        <th>Sector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedApplications.map((app, index) => (
                        <tr key={app.registrationId}>
                          <td>{startItem + index}</td>
                          <td>
                            <button
                              className="btn btn-link p-0"
                              onClick={() => handleViewApplication(app)}
                            >
                              <span className="bi bi-eye"></span>
                            </button>
                          </td>
                          <td>{app.dateOfSubmission || 'N/A'}</td>
                          <td>Sufyan</td>
                          <td>13-05-2025</td>
                          <td>{app.enterpriseName || 'N/A'}</td>
                          <td>{app.promoterName || 'N/A'}</td>
                          <td>{app.contactNumber || 'N/A'}</td>
                          <td>{app.natureOfActivity || 'N/A'}</td>
                          <td>{app.sector || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {startItem} to {endItem} of {totalItems} entries
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

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

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

      {/* View Application Modal */}
      {/* View Application Modal */}
<Modal show={showModal} onHide={handleCloseModal} size="xl" scrollable centered>
  <Modal.Header className="bg-theme text-white">
    <Modal.Title className="fw-bold">View Application</Modal.Title>
    <button 
      type="button" 
      className="btn-close text-white" 
      onClick={handleCloseModal}
      aria-label="Close"
    >
      <span className="bi bi-x-lg"></span>
    </button>
  </Modal.Header>
  <Modal.Body>
    <div className="row">
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">Name Of Firm</label>
          <label className="d-block fs-md">{selectedApplication?.enterpriseName || 'N/A'}</label>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">Udyam Number</label>
          <label className="d-block fs-md">{selectedApplication?.udyamNumber || 'N/A'}</label>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">Size Of Unit</label>
          <label className="d-block fs-md">{selectedApplication?.unitSize || 'N/A'}</label>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">Nature Of Activity</label>
          <label className="d-block fs-md">{selectedApplication?.natureOfActivity || 'N/A'}</label>
        </div>
      </div>
    </div>
    
    <div>
      <h6 className="fw-600 mb-2">Factory Location</h6>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="mb-3">
            <label className="d-block fs-md fw-600 mb-1">District</label>
            <label className="d-block fs-md">{selectedApplication?.district || 'N/A'}</label>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="mb-3">
            <label className="d-block fs-md fw-600 mb-1">Mandal</label>
            <label className="d-block fs-md">{selectedApplication?.mandal || 'N/A'}</label>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-6">
          <div className="mb-3">
            <label className="d-block fs-md fw-600 mb-1">Address</label>
            <label className="d-block fs-md">
              {selectedApplication?.address || 'N/A'}
            </label>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-6">
          <div className="mb-3">
            <label className="d-block fs-md fw-600 mb-1">Confirmation of Loans Credit Facilities</label>
            <label className="d-block fs-md">{selectedApplication?.hasLoans ? 'Yes' : 'No'}</label>
          </div>
        </div>
      </div>
    </div>
    
    {selectedApplication?.hasLoans && selectedApplication?.loans?.length > 0 && (
      <div className="mb-3">
        <h6 className="fw-600 mb-2">Loans</h6>
        <div className="table-responsive">
          <table className="table table-striped table-borderless fs-md">
            <thead className="bg-theme text-white">
              <tr>
                <th>S.No</th>
                <th>Name Of Bank / Lender</th>
                <th>Loan Amount</th>
                <th>Since When</th>
                <th>Approx interest paid till date</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {selectedApplication.loans.map((loan, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{loan.bankName || 'N/A'}</td>
                  <td>{loan.amount || 'N/A'}</td>
                  <td>{loan.sinceDate || 'N/A'}</td>
                  <td>{loan.interestPaid || 'N/A'}</td>
                  <td>{loan.remarks || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>                    
      </div>
    )}
    
    <div className="mb-3">
      <label className="d-block fs-md fw-600 mb-1">What are your problems?</label>
      <label className="d-block fs-md">
        {selectedApplication?.problems || 'N/A'}
      </label>
    </div>
    <div className="mb-3">
      <label className="d-block fs-md fw-600 mb-1">What is the expected solutions?</label>
      <label className="d-block fs-md">
        {selectedApplication?.expectedSolutions || 'N/A'}
      </label>
    </div>
    <div className="mb-3">
      <label className="d-block fs-md fw-600 mb-1">Observations</label>
      <label className="d-block fs-md">
        {selectedApplication?.observations || 'N/A'}
      </label>
    </div>
    <div className="mb-3">
      <label className="d-block fs-md fw-600 mb-1">Status Update</label>
      <label className="d-block fs-md">
        {selectedApplication?.statusUpdate || 'N/A'}
      </label>
    </div>
    
    <div className="row">
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">Type Of Product</label>
          <label className="d-block fs-md">{selectedApplication?.productType || 'N/A'}</label>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-6">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">Where is the Product Used?</label>
          <label className="d-block fs-md">
            {selectedApplication?.productUsage || 'N/A'}
          </label>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="mb-3">
          <label className="d-block fs-md fw-600 mb-1">GST Number</label>
          <label className="d-block fs-md">{selectedApplication?.gstNumber || 'N/A'}</label>
        </div>
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={handleApprove}>Approve</Button>
    <Button variant="danger" onClick={handleReject}>Reject</Button>
  </Modal.Footer>
</Modal>

      {/* Approve Confirmation Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton className="bg-theme text-white py-2 ">
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className='border'>
          <p className="text-center">Are you sure you want to approve the application? Once approved it can't be revoked!</p>
          <div className="text-center">
            <Button variant="primary" onClick={handleConfirmApprove} className="me-2">
              Yes
            </Button>
            <Button variant="danger" onClick={() => setShowApproveModal(false)}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton className="bg-theme text-white py-2">
          <Modal.Title>Remarks</Modal.Title>
        </Modal.Header>
        <Modal.Body className='border'>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="fs-md fw-600 mb-1">Remarks</label>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Write here"
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
              />
            </div>
          </div>
          <div className="text-end">
            <Button variant="primary" onClick={handleConfirmReject}>
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-theme text-white py-2">
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">Operation completed successfully</p>
          <div className="text-center">
            <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
}

export default Level1;