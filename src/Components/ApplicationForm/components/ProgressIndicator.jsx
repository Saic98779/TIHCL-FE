import React, { memo } from 'react';

const ProgressIndicator = memo(({ currentStep, progressPercentage }) => {
    return (
        <div className="px-4 mt-3">
            <div className="progress px-1" style={{ height: '3px' }}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
            <div className="step-container d-flex justify-content-between">
                <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>
                    <span className="bi bi-pencil"></span>
                </div>
                <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>
                    <span className="bi bi-file-earmark-text"></span>
                </div>
                <div className={`step-circle ${currentStep >= 3 ? 'active' : ''}`}>
                    <span className="bi bi-eye"></span>
                </div>
            </div>
            <div className="step-container step-label d-lg-flex justify-content-between d-none d-sm-flex">
                <div className="fs-md fw-600">Registration</div>
                <div className="fs-md fw-600">Application</div>
                <div className="fs-md fw-600">Status</div>
            </div>
        </div>
    );
});

export default ProgressIndicator;