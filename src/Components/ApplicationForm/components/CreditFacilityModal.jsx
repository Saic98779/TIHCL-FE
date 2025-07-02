import React, { memo, useState, useEffect } from 'react';

const CreditFacilityModal = memo(({ 
    newCreditFacility, 
    errors, 
    onChange, 
    onSubmit, 
    onClose 
}) => {
    const [localErrors, setLocalErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    
    const loanTypes = [
        "Short-term Loans",
        "Medium-term Loans",
        "Long-term Loans"
    ];

    // Fixed validation
    useEffect(() => {
        const {
            bankName,
            natureOfLoan,
            limitSanctioned,
            outstandingAmount,
            overdueAmount,
            overdueSince
        } = newCreditFacility;
        
        // Check all required fields have non-empty values
        const hasValues = [
            bankName,
            natureOfLoan,
            limitSanctioned,
            outstandingAmount,
            overdueAmount,
            overdueSince
        ].every(value => value && value.toString().trim() !== '');
        
        // Check for actual error messages (non-empty strings)
        const hasErrors = 
            Object.values(errors).some(msg => msg && msg.trim() !== '') || 
            Object.values(localErrors).some(msg => msg && msg.trim() !== '');
        
        // Update form validity
        setIsFormValid(hasValues && !hasErrors);
    }, [newCreditFacility, errors, localErrors]);

    // Handle bank name changes with validation
       const handleBankNameChange = (value) => {
        onChange({...newCreditFacility, bankName: value});
        
        // Validate for numbers
        if (/\d/.test(value)) {
            setLocalErrors(prev => ({
                ...prev,
                bankName: 'Bank name cannot contain numbers'
            }));
        } else if (localErrors.bankName) {
            const newErrors = {...localErrors};
            delete newErrors.bankName;
            setLocalErrors(newErrors);
        }
    };


    // Handle amount changes with validation
    const handleNumberChange = (field, value) => {
        // Allow only numbers and single decimal point
        const sanitizedValue = value
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1');
        
        const updatedFacility = {
            ...newCreditFacility,
            [field]: sanitizedValue
        };
        
        onChange(updatedFacility);
        
        // Validate amounts relationship when either field changes
        if (field === 'outstandingAmount' || field === 'overdueAmount') {
            validateAmounts(updatedFacility);
        }
        
        // Clear previous error for this field
        if (localErrors[field]) {
            const newErrors = {...localErrors};
            delete newErrors[field];
            setLocalErrors(newErrors);
        }
    };

    // Validate overdue vs outstanding amounts
    const validateAmounts = (facility) => {
        const outstanding = parseFloat(facility.outstandingAmount) || 0;
        const overdue = parseFloat(facility.overdueAmount) || 0;
        
        if (overdue > outstanding) {
            setLocalErrors(prev => ({
                ...prev,
                overdueAmount: 'Overdue amount cannot be greater than outstanding amount'
            }));
        } else if (localErrors.overdueAmount) {
            const newErrors = {...localErrors};
            delete newErrors.overdueAmount;
            setLocalErrors(newErrors);
        }
    };

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
                                            className={`form-control ${errors.bankName || localErrors.bankName ? 'is-invalid' : ''}`}
                                            id="nameBank"
                                            placeholder="Bank Name"
                                            value={newCreditFacility.bankName}
                                            onChange={(e) => handleBankNameChange(e.target.value)}
                                            onBlur={(e) => {
                                                if (/\d/.test(e.target.value)) {
                                                    setLocalErrors(prev => ({
                                                        ...prev,
                                                        bankName: 'Bank name cannot contain numbers'
                                                    }));
                                                }
                                            }}
                                        />
                                        <label htmlFor="nameBank">Bank / Fi Name</label>
                                        {(errors.bankName || localErrors.bankName) && (
                                            <div className="invalid-feedback">
                                                {errors.bankName || localErrors.bankName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <select
                                            className={`form-select ${errors.natureOfLoan ? 'is-invalid' : ''}`}
                                            id="natureOfLoan"
                                            value={newCreditFacility.natureOfLoan}
                                            onChange={(e) => onChange({...newCreditFacility, natureOfLoan: e.target.value})}
                                        >
                                            <option value="">Select Nature of Loan</option>
                                            {loanTypes.map((type, index) => (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="natureOfLoan">Nature of Loan</label>
                                        {errors.natureOfLoan && 
                                            <div className="invalid-feedback">{errors.natureOfLoan}</div>}
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
                                            onChange={(e) => handleNumberChange('limitSanctioned', e.target.value)}
                                        />
                                        <label htmlFor="limit">Limit sanctioned (In Rs)</label>
                                        {errors.limitSanctioned && 
                                            <div className="invalid-feedback">{errors.limitSanctioned}</div>}
                                    </div>
                                </div>
                                
                                {/* Outstanding Amount */}
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.outstandingAmount || localErrors.outstandingAmount ? 'is-invalid' : ''}`}
                                            id="outstanding"
                                            placeholder="Outstanding Amount"
                                            value={newCreditFacility.outstandingAmount}
                                            onChange={(e) => handleNumberChange('outstandingAmount', e.target.value)}
                                        />
                                        <label htmlFor="outstanding">Outstanding Amount (In Rs)</label>
                                        {(errors.outstandingAmount || localErrors.outstandingAmount) && 
                                            <div className="invalid-feedback">
                                                {errors.outstandingAmount || localErrors.outstandingAmount}
                                            </div>
                                        }
                                    </div>
                                </div>
                                
                                {/* Overdue Amount */}
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.overdueAmount || localErrors.overdueAmount ? 'is-invalid' : ''}`}
                                            id="overdue"
                                            placeholder="Overdue Amount"
                                            value={newCreditFacility.overdueAmount}
                                            onChange={(e) => handleNumberChange('overdueAmount', e.target.value)}
                                        />
                                        <label htmlFor="overdue">Overdue Amount (In Rs)</label>
                                        {(errors.overdueAmount || localErrors.overdueAmount) && 
                                            <div className="invalid-feedback">
                                                {errors.overdueAmount || localErrors.overdueAmount}
                                            </div>
                                        }
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
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => onChange({...newCreditFacility, overdueSince: e.target.value})}
                                        />
                                        <label htmlFor="sinceOverdue">Overdue Since (Date)</label>
                                        {errors.overdueSince && 
                                            <div className="invalid-feedback">{errors.overdueSince}</div>}
                                    </div>
                                </div>
                                
                                <div className="col-12">
                                    <div className="d-grid gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={!isFormValid}
                                        >
                                            Add Credit Facility
                                        </button>
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