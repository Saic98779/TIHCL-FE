import React, { memo } from 'react';
import SuccessStatuImg from '../../../assets/success.png'
const StatusStep = memo(({ registrationId, submissionDate }) => {
    return (
        <div className="step step-3">
            <div className="card mb-3">
                <div className="card-header bg-theme text-white">
                    <h6 className="mb-0">Status</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                            <div className="text-center mb-5">
                                <img src={SuccessStatuImg} alt="status successfully" className="img-fluid w-75" />
                            </div>
                            <div className="card border-0 bg-light p-3 rounded-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <p className="fw-600 fs-md mb-0">Application No.</p>
                                    </div>
                                    <div>
                                        <p className="fs-md fw-600 mb-0">{registrationId}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <p className="fw-600 fs-md mb-0">Date Of Submission</p>
                                    </div>
                                    <div>
                                        <p className="fs-md mb-0">{submissionDate}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="fw-600 fs-md mb-0">Application Status</p>
                                    </div>
                                    <div>
                                        <p className="fs-md text-warning mb-0">Pending Review</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <p className="text-muted">Your application has been submitted successfully.</p>
                                <p className="text-muted">We will review your information and contact you soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default StatusStep;