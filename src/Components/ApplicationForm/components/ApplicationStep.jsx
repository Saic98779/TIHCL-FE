import React, { memo } from 'react';

const ApplicationStep = memo(({
    formData,
    errors,
    onChange,
    onRadioChange,
    onBlur,
    onPrev,
    onSubmit,
    onAddCredit,
    onEditCredit,      // <-- add this
    onDeleteCredit,    // <-- add this
    isSubmitting,
    submitError
}) => {

    const operatingDifficultiesArray =
        Array.isArray(formData.operatingDifficulties)
            ? formData.operatingDifficulties
            : (formData.operatingDifficulties
                ? formData.operatingDifficulties.split(', ')
                : []);
    return (
        <div className="step step-2">
            <div className="card mb-3">
                <div className="card-header bg-theme text-white">
                    <h6 className="mb-0">Application</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        {/* Enterprise Category */}
                        <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                            <div className="mb-3">
                                <label className="form-label fs-md fw-600 mb-1">Enterprise category? <span className='text-danger text-end'>*</span></label>
                                {errors.enterpriseCategory && (
                                    <div className="text-danger small">{errors.enterpriseCategory}</div>
                                )}
                                <div className="d-flex flex-wrap gap-2">
                                    {['Micro', 'Small', 'Medium', 'Large'].map((category) => (
                                        <div className="form-check" key={category}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="enterpriseCategory"
                                                id={`enterpriseCategory-${category}`}
                                                value={category}
                                                checked={formData.enterpriseCategory === category}
                                                onChange={onRadioChange}
                                                onBlur={onBlur}
                                            />
                                            <label className="form-check-label fs-md" htmlFor={`enterpriseCategory-${category}`}>
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Nature of Activity */}
                        <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                            <div className="mb-3">
                                <label className="form-label fs-md fw-600 mb-1">Nature of activity? <span className='text-danger text-end'>*</span> </label>
                                {errors.natureActivity && (
                                    <div className="text-danger small">{errors.natureActivity}</div>
                                )}
                                <div className="d-flex flex-wrap gap-2">
                                    {['Manufacturing', 'Services', 'Trading'].map((activity) => (
                                        <div className="form-check" key={activity}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="natureActivity"
                                                id={`natureActivity-${activity}`}
                                                value={activity}
                                                checked={formData.natureActivity === activity}
                                                onChange={onRadioChange}
                                                onBlur={onBlur}
                                            />
                                            <label className="form-check-label fs-md" htmlFor={`natureActivity-${activity}`}>
                                                {activity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sector */}
                        <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${errors.sector ? 'is-invalid' : ''}`}
                                    id="sector"
                                    name="sector"
                                    value={formData.sector}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                >
                                    <option value="">Select Sector</option>
                                    <option value="Group">Group</option>
                                    <option value="Division">Division</option>
                                </select>
                                <label htmlFor="sector">Sector <span className='text-danger text-end fw-bold'>*</span></label>
                                {errors.sector && (
                                    <div className="invalid-feedback">{errors.sector}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Operational Status */}
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-3">
                                <label className="form-label fs-md fw-600 mb-1">Operational Status of the unit <span className='text-danger text-end'>*</span></label>
                                {errors.operationalStatus && (
                                    <div className="text-danger small">{errors.operationalStatus}</div>
                                )}
                                <div className="d-flex flex-wrap gap-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="operationalStatus"
                                            id="operationalStatus-yes"
                                            value="operationalYes"
                                            checked={formData.operationalStatus === 'operationalYes'}
                                            onChange={onRadioChange}
                                            onBlur={onBlur}
                                        />
                                        <label className="form-check-label fs-md" htmlFor="operationalStatus-yes">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="operationalStatus"
                                            id="operationalStatus-no"
                                            value="operationalNo"
                                            checked={formData.operationalStatus === 'operationalNo'}
                                            onChange={onRadioChange}
                                            onBlur={onBlur}
                                        />
                                        <label className="form-check-label fs-md" htmlFor="operationalStatus-no">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.operationalStatus === 'operationalYes' && (
                                <div className="row mb-3">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-md fw-600 mb-1">Operating Satisfactorily? <span className='text-danger'>*</span></label>
                                            {errors.operatingSatisfactorily && (
                                                <div className="text-danger small">{errors.operatingSatisfactorily}</div>
                                            )}
                                            <div className="d-flex flex-wrap gap-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="operatingSatisfactorily"
                                                        id="operatingSatisfactorily-yes"
                                                        value="yes"
                                                        checked={formData.operatingSatisfactorily === 'yes'}
                                                        onChange={onRadioChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <label className="form-check-label fs-md" htmlFor="operatingSatisfactorily-yes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="operatingSatisfactorily"
                                                        id="operatingSatisfactorily-no"
                                                        value="no"
                                                        checked={formData.operatingSatisfactorily === 'no'}
                                                        onChange={onRadioChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <label className="form-check-label fs-md" htmlFor="operatingSatisfactorily-no">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkbox Dropdown for Operating Difficulties */}
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                        <div className="form-group">
                                            <label className="form-label fw-600">
                                                Operating with difficulties
                                                {formData.operatingSatisfactorily === 'no' && <span className='text-danger'>*</span>}
                                            </label>

                                            <div className="dropdown">
                                                <button
                                                    className={`form-control text-start dropdown-toggle ${formData.operatingSatisfactorily === 'no' &&
                                                        operatingDifficultiesArray.length === 0 ? 'is-invalid' : ''
                                                        }`}
                                                    type="button"
                                                    id="operatingDifficultiesDropdown"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                    style={{
                                                        minHeight: '58px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}
                                                    disabled={formData.operatingSatisfactorily === 'yes'}
                                                >
                                                    {operatingDifficultiesArray.length > 0
                                                        ? operatingDifficultiesArray.join(', ')
                                                        : 'Select difficulties'}
                                                </button>

                                                <ul className="dropdown-menu p-3" aria-labelledby="operatingDifficultiesDropdown" style={{ width: '100%' }}>
                                                    {['Financial', 'Supply Chain', 'Labor', 'Market Demand', 'Regulatory', 'Other'].map((difficulty) => (
                                                        <li key={difficulty} className="mb-2">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`difficulty-${difficulty}`}
                                                                    checked={operatingDifficultiesArray.includes(difficulty)}
                                                                    onChange={(e) => {
                                                                        let updatedDifficulties;
                                                                        if (e.target.checked) {
                                                                            updatedDifficulties = [...operatingDifficultiesArray, difficulty];
                                                                        } else {
                                                                            updatedDifficulties = operatingDifficultiesArray.filter(d => d !== difficulty);
                                                                        }
                                                                        onChange({
                                                                            target: {
                                                                                name: 'operatingDifficulties',
                                                                                value: updatedDifficulties
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                                <label className="form-check-label" htmlFor={`difficulty-${difficulty}`}>
                                                                    {difficulty}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {formData.operatingSatisfactorily === 'no' && errors.operatingDifficulties && (
                                                <div className="invalid-feedback d-block">{errors.operatingDifficulties}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.operationalStatus === 'operationalNo' && (
                                <div className="row mb-3">
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="date"
                                                className={`form-control ${errors.notOperatingSince ? 'is-invalid' : ''}`}
                                                id="notOperatingSince"
                                                name="notOperatingSince"
                                                value={formData.notOperatingSince}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            <label htmlFor="notOperatingSince">Since when? <span className='text-danger'>*</span></label>
                                            {errors.notOperatingSince && (
                                                <div className="invalid-feedback">{errors.notOperatingSince}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <textarea
                                                className={`form-control ${errors.notOperatingReasons ? 'is-invalid' : ''}`}
                                                id="notOperatingReasons"
                                                name="notOperatingReasons"
                                                placeholder="Reasons for not operating"
                                                value={formData.notOperatingReasons}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                rows="3"
                                            />
                                            <label htmlFor="notOperatingReasons">Reasons for not operating <span className='text-danger'>*</span></label>
                                            {errors.notOperatingReasons && (
                                                <div className="invalid-feedback">{errors.notOperatingReasons}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-md fw-600 mb-1">Whether intention to restart <span className='text-danger'>*</span></label>
                                            {errors.restartIntention && (
                                                <div className="text-danger small">{errors.restartIntention}</div>
                                            )}
                                            <div className="d-flex flex-wrap gap-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="restartIntention"
                                                        id="restartIntention-yes"
                                                        value="restartYes"
                                                        checked={formData.restartIntention === 'restartYes'}
                                                        onChange={onRadioChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <label className="form-check-label fs-md" htmlFor="restartIntention-yes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="restartIntention"
                                                        id="restartIntention-no"
                                                        value="restartNo"
                                                        checked={formData.restartIntention === 'restartNo'}
                                                        onChange={onRadioChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <label className="form-check-label fs-md" htmlFor="restartIntention-no">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className={`form-control ${formData.restartIntention === 'restartYes' && errors.restartSupport ? 'is-invalid' : ''}`}
                                                id="restartSupport"
                                                name="restartSupport"
                                                placeholder="What support do you need to restart?"
                                                value={formData.restartSupport}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            />
                                            <label htmlFor="restartSupport">
                                                What support do you need to restart?
                                                {formData.restartIntention === 'restartYes' && <span className='text-danger'>*</span>}
                                            </label>
                                            {formData.restartIntention === 'restartYes' && errors.restartSupport && (
                                                <div className="invalid-feedback">{errors.restartSupport}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Credit Facilities */}
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-3">
                                <label className="form-label fs-md fw-600 mb-1">Existing Credit facilities with BANK/NBFC/FI? <span className='text-danger'>*</span></label>
                                {errors.hasCreditFacilities && (
                                    <div className="text-danger small">{errors.hasCreditFacilities}</div>
                                )}
                                <div className="d-flex flex-wrap gap-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="hasCreditFacilities"
                                            id="hasCreditFacilities-yes"
                                            value="yes"
                                            checked={formData.hasCreditFacilities === 'yes'}
                                            onChange={onRadioChange}
                                            onBlur={onBlur}
                                        />
                                        <label className="form-check-label fs-md" htmlFor="hasCreditFacilities-yes">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="hasCreditFacilities"
                                            id="hasCreditFacilities-no"
                                            value="no"
                                            checked={formData.hasCreditFacilities === 'no'}
                                            onChange={onRadioChange}
                                            onBlur={onBlur}
                                        />
                                        <label className="form-check-label fs-md" htmlFor="hasCreditFacilities-no">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.hasCreditFacilities === 'yes' && (
                                <div className="border rounded-3 p-3 mb-3">
                                    <div className="text-end mb-2">
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={onAddCredit}
                                        >
                                            <span className="bi bi-plus-lg"></span> Add Credit Facility
                                        </button>
                                    </div>
                                    {formData.creditFacilities.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-bordered fs-md">
                                                <thead className="bg-theme text-white">
                                                    <tr>
                                                        <th className='bg-primary text-white fw-bold'>S.No</th>
                                                        <th className='bg-primary text-white fw-bold'>Bank/FIs Name</th>
                                                        <th className='bg-primary text-white fw-bold'>Limit sanctioned (In Rs)</th>
                                                        <th className='bg-primary text-white fw-bold'>Outstanding Amount (In Rs)</th>
                                                        <th className='bg-primary text-white fw-bold'>Overdue Amount (In Rs)</th>
                                                        <th className='bg-primary text-white fw-bold'>Overdue Since (Date)</th>
                                                        <th className='bg-primary text-white fw-bold'>Nature of Loan</th>
                                                        <th className='bg-primary text-white fw-bold'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.creditFacilities.map((facility, index) => (
                                                        <tr key={`credit-facility-${index}`}>
                                                            <td className='text-center'>{index + 1}</td>
                                                            <td className='text-center'>{facility.bankName}</td>
                                                            <td className='text-center'>{facility.limitSanctioned}</td>
                                                            <td className='text-center'>{facility.outstandingAmount}</td>
                                                            <td className='text-center'>{facility.overdueAmount}</td>
                                                            <td className='text-center'>{facility.overdueSince || 'N/A'}</td>
                                                            <td className='text-center'>{facility.natureOfLoan || 'N/A'}</td>
                                                            <td className='text-center'>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-warning btn-sm me-2"
                                                                    onClick={() => onEditCredit(index)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => onDeleteCredit(index)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="alert alert-info">
                                            No credit facilities added yet.
                                        </div>
                                    )}

                                    <div className="mt-3">
                                        <label className="form-label fs-md fw-600 mb-1">Status of the credit <span className='text-danger'>*</span></label>
                                        {errors.creditStatus && (
                                            <div className="text-danger small">{errors.creditStatus}</div>
                                        )}
                                        <div className="d-flex flex-wrap gap-2">
                                            {['Standard', 'SMA', 'NPA'].map((status) => (
                                                <div className="form-check" key={`credit-status-${status}`}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="creditStatus"
                                                        id={`creditStatus-${status}`}
                                                        value={status}
                                                        checked={formData.creditStatus === status}
                                                        onChange={onRadioChange}
                                                        onBlur={onBlur}
                                                    />
                                                    <label className="form-check-label fs-md" htmlFor={`creditStatus-${status}`}>
                                                        {status}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formData.hasCreditFacilities === 'no' && (
                                <div className="row mb-3">
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.creditRequirements ? 'is-invalid' : ''}`}
                                                id="creditRequirements"
                                                name="creditRequirements"
                                                placeholder="Any requirement for credit limits?"
                                                value={formData.creditRequirements}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            />
                                            <label htmlFor="creditRequirements">Any requirement for credit limits?</label>
                                            {errors.creditRequirements && (
                                                <div className="invalid-feedback">{errors.creditRequirements}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Investment Subsidy */}
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-3">
                                <label className="form-label fs-md fw-600 mb-1">Any Sanctioned subsidiary / Incentive by the state Government <span className='text-danger'>*</span></label>
                                {errors.investmentSubsidy && (
                                    <div className="text-danger small">{errors.investmentSubsidy}</div>
                                )}
                                <div className="d-flex flex-wrap gap-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="investmentSubsidy"
                                            id="investmentSubsidy-yes"
                                            value="yes"
                                            checked={formData.investmentSubsidy === 'yes'}
                                            onChange={onRadioChange}
                                            onBlur={onBlur}
                                        />
                                        <label className="form-check-label fs-md" htmlFor="investmentSubsidy-yes">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="investmentSubsidy"
                                            id="investmentSubsidy-no"
                                            value="no"
                                            checked={formData.investmentSubsidy === 'no'}
                                            onChange={onRadioChange}
                                            onBlur={onBlur}
                                        />
                                        <label className="form-check-label fs-md" htmlFor="investmentSubsidy-no">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.investmentSubsidy === 'yes' && (
                                <div className="row mb-3">
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.subsidyAmountSanctioned ? 'is-invalid' : ''}`}
                                                id="subsidyAmountSanctioned"
                                                name="subsidyAmountSanctioned"
                                                placeholder="Total Amount Sanctioned"
                                                value={formData.subsidyAmountSanctioned}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            />
                                            <label htmlFor="subsidyAmountSanctioned">Total Amount Sanctioned</label>
                                            {errors.subsidyAmountSanctioned && (
                                                <div className="invalid-feedback">{errors.subsidyAmountSanctioned}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.subsidyAmountReleased ? 'is-invalid' : ''}`}
                                                id="subsidyAmountReleased"
                                                name="subsidyAmountReleased"
                                                placeholder="Amount Released"
                                                value={formData.subsidyAmountReleased}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            />
                                            <label htmlFor="subsidyAmountReleased">Amount Released</label>
                                            {errors.subsidyAmountReleased && (
                                                <div className="invalid-feedback">{errors.subsidyAmountReleased}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.subsidyAmountToBeReleased ? 'is-invalid' : ''}`}
                                                id="subsidyAmountToBeReleased"
                                                name="subsidyAmountToBeReleased"
                                                placeholder="Amount to be Released"
                                                value={formData.subsidyAmountToBeReleased}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                            />
                                            <label htmlFor="subsidyAmountToBeReleased">Amount to be Released</label>
                                            {errors.subsidyAmountToBeReleased && (
                                                <div className="invalid-feedback">{errors.subsidyAmountToBeReleased}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Accounts Maintenance */}
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-3">
                                <label className="form-label fs-md fw-600 mb-1">How do you maintain your books of accounts? <span className='text-danger'>*</span></label>
                                {errors.accountsMaintenance && (
                                    <div className="text-danger small">{errors.accountsMaintenance}</div>
                                )}
                                <div className="d-flex flex-wrap gap-2">
                                    {['Manual', 'Software'].map((method) => (
                                        <div className="form-check" key={`accounts-${method}`}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="accountsMaintenance"
                                                id={`accountsMaintenance-${method}`}
                                                value={method}
                                                checked={formData.accountsMaintenance === method}
                                                onChange={onRadioChange}
                                                onBlur={onBlur}
                                            />
                                            <label className="form-check-label fs-md" htmlFor={`accountsMaintenance-${method}`}>
                                                {method === 'Software' ? 'Any software application' : method}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-3">
                                <label htmlFor="comments" className="form-label fs-md fw-600 mb-1">How can we help you?</label>
                                <textarea
                                    className={`form-control ${errors.comments ? 'is-invalid' : ''}`}
                                    id="comments"
                                    name="comments"
                                    rows="3"
                                    placeholder="Write here"
                                    value={formData.comments}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                                {errors.comments && (
                                    <div className="invalid-feedback">{errors.comments}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="d-flex align-items-center justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onPrev}
                        >
                            <span className="bi bi-arrow-left me-2"></span> Previous
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onSubmit}
                            disabled={
                                ![
                                    'enterpriseCategory', 'natureActivity', 'sector', 'operationalStatus',
                                    'accountsMaintenance', 'hasCreditFacilities', 'investmentSubsidy', 'creditStatus'
                                ].every(field => formData[field]?.toString().trim() && !errors[field])
                                ||
                                (
                                    formData.investmentSubsidy === 'yes' && (
                                        !formData.subsidyAmountSanctioned?.toString().trim() || errors.subsidyAmountSanctioned ||
                                        !formData.subsidyAmountReleased?.toString().trim() || errors.subsidyAmountReleased ||
                                        !formData.subsidyAmountToBeReleased?.toString().trim() || errors.subsidyAmountToBeReleased
                                    )
                                )
                                ||
                                (formData.operationalStatus === 'operationalYes' &&
                                    (!formData.operatingSatisfactorily || errors.operatingSatisfactorily ||
                                        (formData.operatingSatisfactorily === 'no' &&
                                            (!formData.operatingDifficulties || formData.operatingDifficulties.length === 0 || errors.operatingDifficulties))))
                                ||
                                (formData.operationalStatus === 'operationalNo' &&
                                    (!formData.notOperatingSince || errors.notOperatingSince ||
                                        !formData.notOperatingReasons || errors.notOperatingReasons ||
                                        !formData.restartIntention || errors.restartIntention ||
                                        (formData.restartIntention === 'restartYes' &&
                                            (!formData.restartSupport || errors.restartSupport)))
                                )
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit
                                    <span className="bi bi-send ms-2"></span>
                                </>
                            )}
                        </button>
                    </div>

                    {submitError && (
                        <div className="alert alert-danger mt-3">
                            <strong>Error:</strong> {submitError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ApplicationStep;


