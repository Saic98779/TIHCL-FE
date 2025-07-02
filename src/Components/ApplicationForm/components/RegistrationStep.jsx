import React, { memo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationStep = memo(({
    formData,
    errors,
    onChange,
    onBlur,
    onNext,
    districts = [],
    mandals = [],
    isLoadingDistricts,
    isLoadingMandals }) => {
    const navigate = useNavigate()
    // State for dropdown visibility and nested menus
    const [showParkDropdown, setShowParkDropdown] = useState(false);
    const [activePark, setActivePark] = useState(null);
    const dropdownRef = useRef(null);

    // Park options data with nested structure - only Industrial Park 1 remains
    const parkOptions = [
        {
            name: "Industrial Park 1",
            options: [
                { id: "option1", name: "Option 1" },
                { id: "option2", name: "Option 2" },
                { id: "option3", name: "Option 3" }
            ]
        }
    ];
    const handleParkBlur = () => {
        onBlur({
            target: {
                name: 'industrialPark',
                value: formData.industrialPark

            }
        });
    };
    // Store selected option ID
    const selectedOption = formData.industrialParkOptions || '';

    // Modify the onChange handler to store names instead of IDs
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        onChange({
            target: {
                name: 'district',
                value: districtId
            }
        });
    };

    const handleMandalChange = (e) => {
        const mandalId = e.target.value;
        onChange({
            target: {
                name: 'mandal',
                value: mandalId
            }
        });
    };

    const [showStateWarning, setShowStateWarning] = useState(false);
    const handleStateChange = (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'Other') {
            onChange({ target: { name: 'district', value: '' } });
            onChange({ target: { name: 'mandal', value: '' } });
            setShowStateWarning(true);
        } else {
            setShowStateWarning(false);
        }

        onChange({ target: { name: 'state', value: selectedValue } });
    };

    // Handle park option selection (single value)
    const handleParkOptionSelect = (optionId, optionName) => {
        // Set industrialPark to "Industrial Park 1"
        onChange({
            target: {
                name: 'industrialPark',
                value: `Industrial Park 1: ${optionName}`
            }
        });

        // Set the selected option
        onChange({
            target: {
                name: 'industrialParkOptions',
                value: optionId
            }
        });

        // Close the dropdown
        setShowParkDropdown(false);
    };

    // Toggle park dropdown
    const toggleParkDropdown = (e) => {
        e.preventDefault();
        setShowParkDropdown(!showParkDropdown);
        setActivePark(null); // Reset active park when toggling
    };

    // Handle park selection (top-level)
    const handleParkSelect = (parkName) => {
        onChange({
            target: {
                name: 'industrialPark',
                value: parkName
            }
        });

        // Clear options when selecting "Other"
        if (parkName === "Other") {
            onChange({
                target: {
                    name: 'industrialParkOptions',
                    value: ''
                }
            });
        }

        setShowParkDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowParkDropdown(false);
                setActivePark(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Find the current selected IDs for the dropdowns
    const selectedDistrictId = formData.district || '';
    const selectedMandalId = formData.mandal || '';

    // Get display text for 
    // park field
    const getIndustrialParkDisplayText = () => {
        if (formData.industrialPark === "Industrial Park 1") {
            if (selectedOption) {
                const selected = parkOptions[0].options.find(opt => opt.id === selectedOption);
                return `Industrial Park 1: ${selected?.name || ''}`;
            }
            return "Industrial Park 1: Select Option";
        }
        return formData.industrialPark || "Select Industrial Park";
    };


    const handleNavigateLogin = () => {
        navigate('/')
    }
    return (
        <div className="step step-1">
            <div className="card">
                <div className="card-header bg-theme text-white">
                    <h6 className="mb-0">Registration</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.nameEnterprise ? 'is-invalid' : ''}`}
                                    id="nameEnterprise"
                                    name="nameEnterprise"
                                    placeholder="Name of the enterprise"
                                    value={formData.nameEnterprise}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                                <label htmlFor="nameEnterprise" className='text-dark'>Name of the Enterprise <span className='text-danger text-end'>*</span></label>
                                {errors.nameEnterprise &&
                                    <div className="invalid-feedback">{errors.nameEnterprise}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.namePromoter ? 'is-invalid' : ''}`}
                                    id="namePromoter"
                                    name="namePromoter"
                                    placeholder="Name of the Promoter"
                                    value={formData.namePromoter}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={
                                        !formData.nameEnterprise?.trim() || !!errors.nameEnterprise
                                    }
                                />
                                <label htmlFor="namePromoter" className="text-dark">
                                    Name of the Promoter <span className="text-danger text-end">*</span>
                                </label>
                                {errors.namePromoter && (
                                    <div className="invalid-feedback">{errors.namePromoter}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${errors.constitution ? 'is-invalid' : ''}`}
                                    id="constitution"
                                    name="constitution"
                                    value={formData.constitution}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={
                                        !formData.namePromoter?.trim() || !!errors.namePromoter
                                    }
                                >
                                    <option value="">Select Constitution</option>
                                    <option value="sole property">Sole property</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="LLP">LLP</option>
                                    <option value="Limited Company">Limited Company</option>
                                </select>
                                <label htmlFor="constitution" className='text-dark'>Constitution <span className='text-danger text-end'>*</span> </label>
                                {errors.constitution &&
                                    <div className="invalid-feedback">{errors.constitution}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="date"
                                    className={`form-control ${errors.dateProduction ? 'is-invalid' : ''}`}
                                    id="dateProduction"
                                    name="dateProduction"
                                    value={formData.dateProduction}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]}
                                    disabled={
                                        !formData.constitution?.trim() || !!errors.constitution
                                    }
                                />
                                <label htmlFor="dateProduction" className='text-dark'>Date of Commencement Production <span className='text-danger text-end'>*</span> </label>
                                {errors.dateProduction &&
                                    <div className="invalid-feedback">{errors.dateProduction}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.udyamRegistration ? 'is-invalid' : ''}`}
                                    id="udyamRegistration"
                                    name="udyamRegistration"
                                    placeholder="Udyam Registration Number"
                                    value={formData.udyamRegistration}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={
                                        !formData.dateProduction?.trim() || !!errors.dateProduction
                                    }
                                />
                                <label htmlFor="udyamRegistration" className='text-dark'>Udyam Registration Number <span className='text-danger text-end'>*</span> </label>
                                {errors.udyamRegistration &&
                                    <div className="invalid-feedback">{errors.udyamRegistration}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.contactDetails ? 'is-invalid' : ''}`}
                                    id="contactDetails"
                                    name="contactDetails"
                                    placeholder="Alternative Contact Details"
                                    value={formData.contactDetails}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={
                                        !formData.udyamRegistration?.trim() || !!errors.udyamRegistration
                                    }
                                />
                                <label htmlFor="contactDetails" className='text-dark'>Alternative Contact Details</label>
                                {errors.contactDetails &&
                                    <div className="invalid-feedback">{errors.contactDetails}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={
                                        !formData.udyamRegistration?.trim() || !!errors.udyamRegistration
                                    }
                                />
                                <label htmlFor="email" className='text-dark'>Email Id</label>
                                {errors.email &&
                                    <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <div className="position-relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        className={`form-select text-start ${errors.industrialPark ? 'is-invalid' : ''}`}
                                        onClick={toggleParkDropdown}
                                        onBlur={handleParkBlur}
                                        disabled={!formData.udyamRegistration?.trim() || !!errors.udyamRegistration}
                                    >
                                        {getIndustrialParkDisplayText()} <span className='text-danger'>*</span>
                                        <span className="float-end">{showParkDropdown ? '▲' : '▼'}</span>
                                    </button>
                                    {errors.industrialPark && (
                                        <div className="invalid-feedback" style={{ display: 'block' }}>
                                            {errors.industrialPark}
                                        </div>
                                    )}

                                    {/* Custom dropdown menu - appearance remains exactly the same */}
                                    {showParkDropdown && (
                                        <div className="card border-0 shadow-lg" style={{
                                            position: 'absolute',
                                            zIndex: 1000,
                                            width: '154px',
                                            top: '100%',
                                            left: 0,
                                            marginTop: '5px'
                                        }}>
                                            <div className="card-body p-0">
                                                <div className="list-group list-group-flush">
                                                    {parkOptions.map((park, index) => (
                                                        <div
                                                            key={index}
                                                            className={`list-group-item list-group-item-action ${activePark === park.name ? 'bg-light' : ''}`}
                                                            onMouseEnter={() => setActivePark(park.name)}
                                                            style={{ cursor: 'pointer', position: 'relative' }}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span>{park.name}</span>
                                                                <span>›</span>
                                                            </div>

                                                            {/* Submenu - only change is adding mousedown instead of click */}
                                                            {activePark === park.name && (
                                                                <div
                                                                    className="card border-0 shadow"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        left: '100%',
                                                                        top: 0,
                                                                        width: '140px',
                                                                        zIndex: 1001
                                                                    }}
                                                                >
                                                                    <div className="card-body p-0">
                                                                        <div className="list-group list-group-flush">
                                                                            {park.options.map((option, optIndex) => (
                                                                                <div
                                                                                    key={optIndex}
                                                                                    className={`list-group-item list-group-item-action ${selectedOption === option.id ? 'active' : ''}`}
                                                                                    onMouseDown={(e) => {  // Changed to onMouseDown
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        handleParkOptionSelect(option.id, option.name);
                                                                                    }}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                >
                                                                                    {option.name}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Other option - changed to onMouseDown */}
                                                    <div
                                                        className="list-group-item list-group-item-action"
                                                        onMouseDown={(e) => {  // Changed to onMouseDown
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleParkSelect("Other");
                                                        }}
                                                    >
                                                        Other
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${errors.state ? 'is-invalid' : ''}`}
                                    id="state"
                                    name="state"
                                    value={formData.state || "Telangana"}
                                    onChange={handleStateChange}
                                    onBlur={onBlur}
                                    disabled={
                                        !formData.industrialPark?.trim() || !!errors.industrialPark
                                    }
                                >
                                    <option value="Telangana">Telangana</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label htmlFor="state">State <span className='text-danger text-end'>*</span> </label>
                                {errors.state &&
                                    <div className="invalid-feedback">{errors.state}</div>}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                                    id="district"
                                    name={"district"}
                                    value={selectedDistrictId}
                                    onChange={handleDistrictChange}
                                    onBlur={onBlur}
                                    required
                                    disabled={isLoadingDistricts || !formData.industrialPark?.trim() || !!errors.state || formData.state === "Other"}
                                >
                                    <option value="">Select District</option>
                                    {districts.map(district => (
                                        <option key={district.districtId} value={district.districtId}>
                                            {district.districtName}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="district">District <span className='text-danger text-end'>*</span> </label>
                                {errors.district && (
                                    <div className="invalid-feedback">{errors.district}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${errors.mandal ? 'is-invalid' : ''}`}
                                    id="mandal"
                                    name="mandal"
                                    value={selectedMandalId}
                                    onChange={handleMandalChange}
                                    onBlur={onBlur}
                                    required
                                    disabled={!formData.district || isLoadingMandals || formData.state === "Other"}
                                >
                                    <option value="">Select Mandal</option>
                                    {mandals.map(mandal => (
                                        <option key={mandal.mandalId} value={mandal.mandalId}>
                                            {mandal.mandalName}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="mandal">Mandal <span className='text-danger text-end'>*</span> </label>
                                {errors.mandal && (
                                    <div className="invalid-feedback">{errors.mandal}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    disabled={
                                        formData.state === 'Other'
                                            ? false
                                            : isLoadingDistricts || !formData.mandal?.trim() || !!errors.mandal
                                    } />
                                <label htmlFor="address" className='text-dark'>Address <span className='text-danger text-end'>*</span> </label>
                                {errors.address &&
                                    <div className="invalid-feedback">{errors.address}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="text-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onNext}
                            disabled={
                                [
                                    'nameEnterprise', 'namePromoter', 'constitution',
                                    'dateProduction', 'udyamRegistration',
                                    'industrialPark', 'address',
                                    ...(formData.state !== 'Other' ? ['district', 'mandal'] : []),
                                    ...(formData.industrialPark === 'Industrial Park 1' && !formData.industrialParkOptions ? ['industrialParkOptions'] : [])
                                ].some(field => !formData[field]?.trim() || errors[field])
                            }
                        >
                            Next
                            <span className="bi bi-arrow-right ms-2"></span>
                        </button>
                    </div>
                </div>
            </div>
            {showStateWarning && (
                <div
                    className="modal fade show"
                    style={{
                        display: 'block',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1050
                    }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{
                            maxWidth: '400px',
                            margin: 'auto',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            position: 'relative'
                        }}
                    >
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: "#0082f1" }}>
                                <h5 className="modal-title">Notice</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowStateWarning(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Currently, only Telangana units can be done.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary" style={{ backgroundColor: "#0082f1" }}
                                    onClick={() => handleNavigateLogin()}
                                // setShowStateWarning(false)
                                >
                                    ok
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
});

export default RegistrationStep;