import React, { memo, useEffect, useState } from 'react';
import SuccessStatuImg from '../../../assets/success.png'
import { useLocation } from 'react-router-dom';

const StatusStep = memo(({ registrationId, submissionDate, ApplicationStatus }) => {
    const applicationNo = localStorage.getItem('applicationNo');
    const location = useLocation();

    // Toast state
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        setShowToast(true);
        const timer = setTimeout(() => setShowToast(false), 10000); // Hide after 5s
        return () => clearTimeout(timer);
    }, []);

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
                                <img src={SuccessStatuImg} alt="status successfully" className="img-fluid w-50" />
                            </div>
                            <div className="card border-0 bg-light p-3 rounded-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <p className="fw-600 fs-md mb-0">Application No.</p>
                                    </div>
                                    <div>
                                        <p className="fs-md fw-600 mb-0">{registrationId ? registrationId : applicationNo}</p>
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
                                        <p className="fs-md text-warning mb-0">{ApplicationStatus}</p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="mt-3 text-center">
                                <p className="text-muted">Your application has been submitted successfully.</p>
                                <p className="text-muted">We will review your information and contact you soon.</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Toast Popup */}
            {showToast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '32px',
                        right: '32px',
                        zIndex: 9999,
                        minWidth: '320px',
                        background: '#fff',
                        border: '1px solid #0082f1',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        padding: '16px 24px',
                        color: '#0082f1',
                        fontWeight: 500,
                        fontSize: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '4px'
                    }}
                >
                    <span style={{ fontWeight: 600 }}>Your application has been submitted successfully.</span>
                    <span style={{ color: '#333', fontWeight: 400 }}>We will review your information and contact you soon.</span>
                </div>
            )}
        </div>
    );
});

export default StatusStep;