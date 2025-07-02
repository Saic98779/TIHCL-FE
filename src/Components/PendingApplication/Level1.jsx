import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import { managerLevelOne } from '../../services/RegistrationService/RegistrationService';
import { updateApplicationStatusByManagerOneApprove } from '../../services/RegistrationService/RegistrationService';
import { updateApplicationStatusByManagerOneReject } from '../../services/RegistrationService/RegistrationService';

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
 const [showStressScore, setShowStressScore] = useState(false); 
  const pageSizeOptions = [4, 10, 25, 50, 75];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await managerLevelOne(currentPage - 1, pageSize);

        setDisplayedApplications(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalElements || 0);

      } catch (error) {
        console.error('Error fetching applications:', error);
        setDisplayedApplications([]);
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

  const handleApprove = async () => {
    setShowApproveModal(true);
  };

  const handleConfirmApprove = async () => {
    const status = "MANAGER_APPROVAL_1";
    const response = await updateApplicationStatusByManagerOneApprove(selectedApplication.applicationNo, status, null);
    console.log("", response);

    setShowApproveModal(false);
    setShowModal(false);
    setShowSuccessModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = async() => {
     const status = "REJECTED_MANAGER_APPROVAL_1";
    const response = await updateApplicationStatusByManagerOneReject(selectedApplication.applicationNo, status, rejectRemarks);
    console.log("", response);
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
  <label htmlFor="pageSize" className="me-2 mb-0 text-white small">Items:</label>
  <div className="position-relative" style={{ minWidth: "65px" }}>
    <select
      id="pageSize"
      className="form-select form-select-sm px-2 py-1"
      value={pageSize}
      onChange={handlePageSizeChange}
      style={{
        fontSize: "0.875rem",
        height: "28px",
        appearance: "none",
        paddingRight: "25px" // Space for arrow
      }}
    >
      {pageSizeOptions.map(size => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
    <div 
      className="position-absolute end-0 top-50 translate-middle-y me-2"
      style={{ pointerEvents: "none" }}
    >
      <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
        <path d="M0 0.5L5 5.5L10 0.5H0Z" />
      </svg>
    </div>
  </div>
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
                          <td>{app.executive}</td>
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
          {/* Basic Information Section */}
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Basic Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3"><label className="fw-600">Name Of Firm</label><div>{selectedApplication?.enterpriseName || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Promoter Name</label><div>{selectedApplication?.promoterName || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Constitution</label><div>{selectedApplication?.constitution || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Production Date</label><div>{selectedApplication?.productionDate || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Udyam Number</label><div>{selectedApplication?.udyamRegNumber || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Enterprise Category</label><div>{selectedApplication?.enterpriseCategory || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Nature Of Activity</label><div>{selectedApplication?.natureOfActivity || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Sector</label><div>{selectedApplication?.sector || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Type Of Product</label><div>{selectedApplication?.typeOfProduct || 'N/A'}</div></div>
                <div className="col-md-3 mb-3"><label className="fw-600">Product Usage</label><div>{selectedApplication?.productUsage || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Industrial Park</label><div>{selectedApplication?.industrialPark || 'N/A'}</div></div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Contact Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                
                <div className="col-md-4 mb-3"><label className="fw-600">Contact Number</label><div>{selectedApplication?.contactNumber || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Alternate Contact Number</label><div>{selectedApplication?.altContactNumber || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Email</label><div>{selectedApplication?.email || 'N/A'}</div></div>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Address Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                
                <div className="col-md-4 mb-3"><label className="fw-600">State</label><div>{selectedApplication?.state || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">District</label><div>{selectedApplication?.district || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Mandal</label><div>{selectedApplication?.mandal || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Address</label><div>{selectedApplication?.address || 'N/A'}</div></div>
                
              </div>
            </div>
          </div>

          {/* Operational Information Section */}
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Operational Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3"><label className="fw-600">Operation Status</label><div>{selectedApplication?.operationStatus ? 'Yes' : 'No'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Operating Satisfactorily</label><div>{selectedApplication?.operatingSatisfactorily ? 'Yes' : 'No'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Operating Difficulties</label><div>{selectedApplication?.operatingDifficulties?.join(', ') || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Issue Date</label><div>{selectedApplication?.issueDate || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Reason For Not Operating</label><div>{selectedApplication?.reasonForNotOperating || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Restart Support</label><div>{selectedApplication?.restartSupport || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Restart Intent</label><div>{selectedApplication?.restartIntent ? 'Yes' : 'No'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Unit Status</label><div>{selectedApplication?.unitStatus || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Problems Faced</label><div>{selectedApplication?.problemsFaced || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Expected Solution</label><div>{selectedApplication?.expectedSolution || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Observations</label><div>{selectedApplication?.observations || 'N/A'}</div></div>
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Financial Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3"><label className="fw-600">Existing Credit</label><div>{selectedApplication?.existingCredit ? 'Yes' : 'No'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Required Credit Limit</label><div>{selectedApplication?.requiredCreditLimit || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Investment Subsidy</label><div>{selectedApplication?.investmentSubsidy ? 'Yes' : 'No'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Total Amount Sanctioned</label><div>{selectedApplication?.totalAmountSanctioned || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Amount Released</label><div>{selectedApplication?.amountReleased || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Amount To Be Released</label><div>{selectedApplication?.amountToBeReleased || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Maintaining Account By</label><div>{selectedApplication?.maintainingAccountBy || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">GST Number</label><div>{selectedApplication?.gstNumber || 'N/A'}</div></div>
              </div>
            </div>
          </div>

          {/* Application Details Section */}
          <div className="card mb-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Application Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3"><label className="fw-600">Application No</label><div>{selectedApplication?.applicationNo || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Status</label><div>{selectedApplication?.status || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Date Of Submission</label><div>{selectedApplication?.dateOfSubmission || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Application Status</label><div>{selectedApplication?.applicationStatus || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Executive</label><div>{selectedApplication?.executive || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Executive Feedback Date</label><div>{selectedApplication?.executiveFeedbackDate || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Reason For Rejection</label><div>{selectedApplication?.reasonForRejection || 'N/A'}</div></div>
                <div className="col-md-4 mb-3"><label className="fw-600">Help Message</label><div>{selectedApplication?.helpMsg || 'N/A'}</div></div>
              </div>
            </div>
          </div>


          {/* Loans Table */}
          {Array.isArray(selectedApplication?.creditFacilityDetails) && selectedApplication.creditFacilityDetails.length > 0 && (
            <div className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0">Loan Details</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name Of Bank / Lender</th>
                        <th>Limit Sanctioned</th>
                        <th>Outstanding Amount</th>
                        <th>Overdue Amount</th>
                        <th>Overdue Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedApplication.creditFacilityDetails.map((loan, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{loan.bankName || 'N/A'}</td>
                          <td>{loan.limitSanctioned ?? 'N/A'}</td>
                          <td>{loan.outstandingAmount ?? 'N/A'}</td>
                          <td>{loan.overdueAmount ?? 'N/A'}</td>
                          <td>{loan.overdueDate || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stress Score Section - Collapsible */}
          <div className="card mb-3">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Stress Score</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#stressScoreCollapse"
                aria-expanded="false"
                aria-controls="stressScoreCollapse"
                onClick={() => {
                  // This is just to force re-render for icon, not needed if using Bootstrap collapse events
                  setShowStressScore(prev => !prev);
                }}
              >
                <i className={showStressScore ? "bi bi-chevron-up" : "bi bi-chevron-down"}></i>
              </button>
            </div>
            <div className="collapse" id="stressScoreCollapse">
              <div className="card-body">
                {selectedApplication?.stressScore?.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Issue</th>
                            <th>Risk Categorisation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedApplication.stressScore.map((score, index) => (
                            <tr key={index}>
                              <td>{score.issue || 'N/A'}</td>
                              <td>{score.riskCategorisation || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 fw-bold">
                      Risk Category Score Total: {selectedApplication?.riskCategoryScore || 'N/A'}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <div className="alert alert-info mb-0">
                      No stress score data available. Risk Category Score: {selectedApplication?.riskCategoryScore || 'N/A'}
                    </div>
                  </div>
                )}
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