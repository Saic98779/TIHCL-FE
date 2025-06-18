import React, { memo } from 'react';

const CreditFacilityModal = memo(({ 
    newCreditFacility, 
    errors, 
    onChange, 
    onSubmit, 
    onClose 
}) => {
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header py-2 bg-theme text-white">
                        <h6 className="modal-title">Add Credit Facilities</h6>
                        <button type="button" className="btn-close text-white fs-4 p-0" onClick={onClose}>
                            <span className="bi bi-x"></span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.bankName ? 'is-invalid' : ''}`}
                                            id="nameBank"
                                            placeholder="Bank Name"
                                            value={newCreditFacility.bankName}
                                            onChange={(e) => onChange({...newCreditFacility, bankName: e.target.value})}
                                        />
                                        <label htmlFor="nameBank">Bank / Fis Name</label>
                                        {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.limitSanctioned ? 'is-invalid' : ''}`}
                                            id="limit"
                                            placeholder="Limit Sanctioned"
                                            value={newCreditFacility.limitSanctioned}
                                            onChange={(e) => onChange({...newCreditFacility, limitSanctioned: e.target.value})}
                                        />
                                        <label htmlFor="limit">Limit sanctioned (In Rs)</label>
                                        {errors.limitSanctioned && <div className="invalid-feedback">{errors.limitSanctioned}</div>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.outstandingAmount ? 'is-invalid' : ''}`}
                                            id="outstanding"
                                            placeholder="Outstanding Amount"
                                            value={newCreditFacility.outstandingAmount}
                                            onChange={(e) => onChange({...newCreditFacility, outstandingAmount: e.target.value})}
                                        />
                                        <label htmlFor="outstanding">Outstanding Amount (In Rs)</label>
                                        {errors.outstandingAmount && <div className="invalid-feedback">{errors.outstandingAmount}</div>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.overdueAmount ? 'is-invalid' : ''}`}
                                            id="overdue"
                                            placeholder="Overdue Amount"
                                            value={newCreditFacility.overdueAmount}
                                            onChange={(e) => onChange({...newCreditFacility, overdueAmount: e.target.value})}
                                        />
                                        <label htmlFor="overdue">Overdue Amount (In Rs)</label>
                                        {errors.overdueAmount && <div className="invalid-feedback">{errors.overdueAmount}</div>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="date"
                                            className={`form-control ${errors.overdueSince ? 'is-invalid' : ''}`}
                                            id="sinceOverdue"
                                            placeholder="Overdue Since"
                                            value={newCreditFacility.overdueSince}
                                            onChange={(e) => onChange({...newCreditFacility, overdueSince: e.target.value})}
                                        />
                                        <label htmlFor="sinceOverdue">Overdue Since (Date)</label>
                                        {errors.overdueSince && <div className="invalid-feedback">{errors.overdueSince}</div>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">Add Credit Facility</button>
                                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CreditFacilityModal;