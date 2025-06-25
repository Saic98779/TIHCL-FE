import React, { useEffect, useState } from 'react';
import { submitPreliminaryAssessment } from '../../services/RegistrationService/RegistrationService';
import success from '../../assets/pending.gif'
const ManagerApproval1 = ({ formData, nextStep, prevStep }) => {
  const status = formData?.managerApproval1?.status || 'pending';
  const rejectionReason = formData?.managerApproval1?.rejectionReason || '';
  const [preliminaryData, setPreliminaryData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPreliminaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const applicationNo = formData.applicationNo;
      if (!applicationNo) {
        throw new Error("Application number is required");
      }

      const response = await submitPreliminaryAssessment(applicationNo);
      setPreliminaryData(response.data);
    } catch (err) {
      console.error("Error fetching preliminary data:", err);
      setError(err.message || "Failed to load preliminary assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    fetchPreliminaryData();
    setShowModal(true);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showModal]);

  return (
    <fieldset>
      <div className="card border rounded-2 shadow-none mb-3">
        <div className="card-header bg-theme text-white">
          <h6 className="mb-0">Manager 1</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-8 offset-lg-2 col-lg-6 offset-lg-3">
              {status === 'pending' && (
                <div className="d-flex align-items-center justify-content-center flex-column mb-3">
                  <img src={success} className="img-fluid" alt="pending" width="200" />
                  <h3 className="text-warning">Pending</h3>
                </div>
              )}
              {status === 'approved' && (
                <div className="d-flex align-items-center justify-content-center flex-column mb-3">
                  <img src="assets/img/success.gif" className="img-fluid" alt="success" width="200" />
                  <h5>Approved</h5>
                </div>
              )}
              {status === 'rejected' && (
                <div className="d-flex align-items-center justify-content-center flex-column mb-3">
                  <img src="assets/img/reject.gif" className="img-fluid" alt="reject" width="200" />
                  <h5>Rejected</h5>
                  {rejectionReason && <p className="mt-2">{rejectionReason}</p>}
                </div>
              )}

              
            </div>
          </div>
        </div>
      </div>

      {showModal && (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
       onClick={(e) => e.target.classList.contains('modal') && setShowModal(false)}>
    <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
      <div className="modal-content">

        <div className="modal-header bg-theme text-white">
          <h6 className="modal-title fw-bold">View Application</h6>
          <button type="button" className="btn-close text-white" onClick={() => setShowModal(false)}></button>
        </div>

        <div className="modal-body">
          <div className="row">
            {[
              ["Name Of Firm", preliminaryData.enterpriseName],
              ["Udyam Number", preliminaryData.udyamRegNumber],
              ["Size Of Unit", preliminaryData.enterpriseCategory],
              ["Nature Of Activity", preliminaryData.natureOfActivity],
            ].map(([label, value], i) => (
              <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                <label className="d-block fs-md fw-600 mb-1">{label}</label>
                <label className="d-block fs-md">{value}</label>
              </div>
            ))}
          </div>

          <h6 className="mt-3">Factory Location</h6>
          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <label className="d-block fs-md fw-600 mb-1">District</label>
              <label className="d-block fs-md">{preliminaryData.district}</label>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <label className="d-block fs-md fw-600 mb-1">Mandal</label>
              <label className="d-block fs-md">{preliminaryData.mandal}</label>
            </div>
            <div className="col-12 col-lg-6 mb-3">
              <label className="d-block fs-md fw-600 mb-1">Address</label>
              <label className="d-block fs-md">{preliminaryData.address}</label>
            </div>
            <div className="col-12 col-lg-6 mb-3">
              <label className="d-block fs-md fw-600 mb-1">Confirmation of Loans Credit Facilities</label>
              <label className="d-block fs-md">{preliminaryData.existingCredit ? 'Yes' : 'No'}</label>
            </div>
          </div>

          {preliminaryData.existingCredit && preliminaryData.creditFacilityDetails?.length > 0 && (
            <>
              <h6 className="fw-600 mt-3">Loans</h6>
              <div className="table-responsive">
                <table className="table table-striped table-borderless fs-md">
                  <thead className="bg-theme text-white">
                    <tr>
                      <th>S.No</th><th>Name Of Bank / Lender</th><th>Loan Amount</th>
                      <th>Since When</th><th>Approx interest paid till date</th><th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preliminaryData.creditFacilityDetails.map((loan, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{loan.bankName}</td>
                        <td>{loan.limitSanctioned}</td>
                        <td>{loan.overdueDate}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {[
            ["What are your problems?", preliminaryData.problemsFaced],
            ["What is the expected solutions?", preliminaryData.expectedSolution],
            ["Observations", preliminaryData.observations],
            ["Status Update", preliminaryData.status],
          ].map(([q, a], i) => (
            <div key={i} className="mb-3">
              <label className="d-block fs-md fw-600 mb-1">{q}</label>
              <label className="d-block fs-md">{a}</label>
            </div>
          ))}

          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <label className="d-block fs-md fw-600 mb-1">Type Of Product</label>
              <label className="d-block fs-md">{preliminaryData.typeOfProduct}</label>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-6 mb-3">
              <label className="d-block fs-md fw-600 mb-1">Where is the Product Used?</label>
              <label className="d-block fs-md">{preliminaryData.productUsage}</label>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <label className="d-block fs-md fw-600 mb-1">GST Number</label>
              <label className="d-block fs-md">{preliminaryData.gstNumber}</label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary">Approve</button>
          <button className="btn btn-danger">Reject</button>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

      <input
        type="button"
        name="previous"
        className="previous btn btn-secondary float-start"
        value="Previous"
        onClick={prevStep}
        disabled
      />
      <input
        type="button"
        name="next"
        className="next btn btn-primary float-end"
        value="Next"
        onClick={nextStep}
      />
    </fieldset>
  );
};

export default ManagerApproval1;
