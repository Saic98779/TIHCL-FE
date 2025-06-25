import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Components
import RegistrationStep from './components/RegistrationStep';
import ApplicationStep from './components/ApplicationStep';
import StatusStep from './components/StatusStep';
import CreditFacilityModal from './components/CreditFacilityModal';
import ProgressIndicator from './components/ProgressIndicator';

import { validateField, validateStep } from '../../utils/validation/formValidation';
import { transformRegistrationData } from '../../utils/api/formTransform';
import { saveRegistration } from '../../services/RegistrationService/RegistrationService';
import { getAllDistricts, getMandalsByDistrict } from '../../services/RegistrationService/RegistrationService'
import '../../styles/ApplicationForm.css';
import { useLocation } from 'react-router-dom';

import logo from '../../assets/tihcl-logo.png';

const ApplicationForm = () => {
    const location = useLocation();
    
    const [currentStep, setCurrentStep] = useState(location.state?.initialStep || 1);
    //const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nameEnterprise: '',
        namePromoter: '',
        constitution: '',
        dateProduction: '',
        udyamRegistration: '',
        contactDetails: '',
        state: '',
        industrialPark: '',
        district: '',
        mandal: '',
        address: '',
        email: '',
        enterpriseCategory: '',
        natureActivity: '',
        sector: '',
        operationalStatus: '',
        operatingSatisfactorily: '',
        operatingDifficulties: '',
        notOperatingSince: '',
        notOperatingReasons: '',
        restartIntention: '',
        restartSupport: '',
        hasCreditFacilities: '', // Added this field to track the credit facilities question
        creditFacilities: [],
        creditStatus: '',
        creditRequirements: '',
        investmentSubsidy: '',
        subsidyAmountSanctioned: '',
        subsidyAmountReleased: '',
        subsidyAmountToBeReleased: '',
        accountsMaintenance: '',
        comments: ''
    });
    const [districts, setDistricts] = useState([]);
    
    const [mandals, setMandals] = useState([]);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [isLoadingMandals, setIsLoadingMandals] = useState(false);

    useEffect(() => {
        const fetchDistricts = async () => {
            setIsLoadingDistricts(true);
            try {
                const response = await getAllDistricts();
                console.log("API response structure:", response);

                // Access the nested data array
                const districtsData = response.data || []; // Changed from response to response.data
                console.log("Districts array:", districtsData);

                setDistricts(districtsData);
            } catch (error) {
                console.error('Failed to fetch districts:', error);
                setDistricts([]); // Fallback to empty array
            } finally {
                setIsLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, []);



    // / Fetch mandals when district changes
    useEffect(() => {
        if (formData.district) {
            const fetchMandals = async () => {
                setIsLoadingMandals(true);
                try {
                    const response = await getMandalsByDistrict(formData.district);
                    console.log("Processed mandals data:", response);
                    setMandals(response); // response is already the array from the service
                } catch (error) {
                    console.error('Failed to fetch mandals:', error);
                    setMandals([]); // Fallback to empty array
                } finally {
                    setIsLoadingMandals(false);
                }
            };

            fetchMandals();
        } else {
            setMandals([]);
        }
    }, [formData.district]);


    const [errors, setErrors] = useState({});
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [newCreditFacility, setNewCreditFacility] = useState({
        bankName: '',
        limitSanctioned: '',
        outstandingAmount: '',
        overdueAmount: '',
        overdueSince: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    //const [registrationId, setRegistrationId] = useState('');
    //const [submissionDate, setSubmissionDate] = useState('');
    const [registrationId, setRegistrationId] = useState(location.state?.registrationId || '');
    const [submissionDate, setSubmissionDate] = useState(location.state?.submissionDate || '');
    const [ApplicationStatus, setApplicationStatus] = useState(location.state?.ApplicationStatus || '');
    useEffect(() => {
        const addGoogleTranslateScript = () => {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        };

        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                    includedLanguages: 'en,te',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
            }
        };

        addGoogleTranslateScript();

        return () => {
            const script = document.querySelector('script[src*="translate.google.com"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;

        // If district is changing, reset mandal
        if (name === 'district') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                mandal: '' // Reset mandal when district changes
            }));
        } else {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    [name]: value
                };

                // Calculate amount to be released when either subsidy field changes
                if (name === 'subsidyAmountSanctioned' || name === 'subsidyAmountReleased') {
                    const sanctioned = parseFloat(newData.subsidyAmountSanctioned) || 0;
                    const released = parseFloat(newData.subsidyAmountReleased) || 0;
                    newData.subsidyAmountToBeReleased = (sanctioned - released)
                }

                return newData;
            });
        }

        if (errors[name]) {
            const error = validateField(name, value, formData);
            setErrors(prev => ({
                ...prev,
                [name]: error || undefined
            }));
        }
    }, [errors, formData]);

    const handleRadioChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'operationalStatus') {
            setErrors(prev => ({
                ...prev,
                notOperatingSince: undefined,
                notOperatingReasons: undefined,
                restartIntention: undefined,
                restartSupport: undefined
            }));
        }

        if (name === 'creditStatus') {
            setErrors(prev => ({
                ...prev,
                creditRequirements: undefined
            }));
        }

        if (name === 'investmentSubsidy') {
            setErrors(prev => ({
                ...prev,
                subsidyAmountSanctioned: undefined,
                subsidyAmountReleased: undefined,
                subsidyAmountToBeReleased: undefined
            }));
        }
    }, []);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        const error = validateField(name, value, formData);
        setErrors(prev => ({
            ...prev,
            [name]: error || undefined
        }));
    }, [formData]);

    const nextStep = useCallback(() => {
        if (validateStep(currentStep, formData, setErrors)) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, formData]);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => prev > 1 ? prev - 1 : prev);
    }, []);

  const handleSubmit = useCallback(async () => {
  if (!validateStep(2, formData, setErrors)) return;

  setIsSubmitting(true);
  setSubmitError(null);

  try {
    const primaryContact = localStorage.getItem('primaryContactNumber');
    const alternativeContact = formData.contactDetails || '';

    const apiData = transformRegistrationData(
      {
        ...formData,
        primaryContactNumber: primaryContact,
        contactDetails: alternativeContact
      }, 
      districts, 
      mandals
    );

    console.log("Submitting data:", apiData); // For debugging
    
    const response = await saveRegistration(apiData);
    console.log("Response:", response.data);
    
    localStorage.setItem("applicationNo", response.data.applicationNo);
    setApplicationStatus(response.data?.applicationStatus || 'APPLICATION_SUBMITTED');
    setRegistrationId(response?.registrationId || `TH${Math.floor(100000 + Math.random() * 900000)}`);
    setSubmissionDate(new Date().toLocaleDateString('en-GB'));
    setCurrentStep(3);

    localStorage.removeItem('primaryContactNumber');
    localStorage.removeItem('userPhone');
  } catch (error) {
    console.error('Submission failed:', error);
    setSubmitError(error.message || 'Failed to submit application. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
}, [formData, districts, mandals]);
    const handleCreditFacilitySubmit = useCallback((e) => {
        e.preventDefault();

        const creditErrors = {};
        let isValid = true;

        if (!newCreditFacility.bankName.trim()) {
            creditErrors.bankName = 'Bank name is required';
            isValid = false;
        }

        if (!newCreditFacility.limitSanctioned || isNaN(newCreditFacility.limitSanctioned)) {
            creditErrors.limitSanctioned = 'Valid amount is required';
            isValid = false;
        }

        if (!newCreditFacility.outstandingAmount || isNaN(newCreditFacility.outstandingAmount)) {
            creditErrors.outstandingAmount = 'Valid amount is required';
            isValid = false;
        }

        if (!newCreditFacility.overdueAmount || isNaN(newCreditFacility.overdueAmount)) {
            creditErrors.overdueAmount = 'Valid amount is required';
            isValid = false;
        }

        if (parseInt(newCreditFacility.overdueAmount) > 0 && !newCreditFacility.overdueSince) {
            creditErrors.overdueSince = 'Date is required when overdue amount > 0';
            isValid = false;
        }

        if (!isValid) {
            setErrors(prev => ({ ...prev, ...creditErrors }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            creditFacilities: [...prev.creditFacilities, {
                bankName: newCreditFacility.bankName,
                limitSanctioned: newCreditFacility.limitSanctioned,
                outstandingAmount: newCreditFacility.outstandingAmount,
                overdueAmount: newCreditFacility.overdueAmount,
                overdueSince: newCreditFacility.overdueSince
            }]
        }));

        setNewCreditFacility({
            bankName: '',
            limitSanctioned: '',
            outstandingAmount: '',
            overdueAmount: '',
            overdueSince: ''
        });

        setShowCreditModal(false);
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.bankName;
            delete newErrors.limitSanctioned;
            delete newErrors.outstandingAmount;
            delete newErrors.overdueAmount;
            delete newErrors.overdueSince;
            return newErrors;
        });
    }, [newCreditFacility]);

    const progressPercentage = useMemo(() => ((currentStep - 1) / 2) * 100, [currentStep]);

    return (
        <div className="application-form">
            <header>
                <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img src={logo} alt="" className="img-fluid" />
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <div className="d-none d-sm-none d-md-none d-lg-block me-5">
                                <p className="fs-md mb-0">
                                    <span className="bi bi-geo-alt"></span> Location: Hyderabad, India |
                                    <span className="bi bi-envelope"></span> Mail: compliance@tihcl.com |
                                    <span className="bi bi-telephone"></span> Contact: 040-232363990
                                </p>
                            </div>
                            <div>
                                <div id="google_translate_element"></div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="pt-80">
                <section className="pt-3">
                    <div className="container-fluid">
                        <div className="card mb-3 border shodow">
                            <div className="card-header bg-theme text-white">
                                <h6 className="mb-0">Application Status</h6>
                            </div>
                            <div className="card-body">
                                <ProgressIndicator currentStep={currentStep} progressPercentage={progressPercentage} />

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <form id="multi-step-form" onSubmit={(e) => e.preventDefault()}>
                                            {currentStep === 1 && (
                                                <RegistrationStep
                                                    formData={formData}
                                                    errors={errors}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    onNext={nextStep}
                                                    districts={districts}
                                                    mandals={mandals}
                                                    isLoadingMandals={isLoadingMandals}
                                                    isLoadingDistricts={isLoadingDistricts}
                                                />
                                            )}

                                            {currentStep === 2 && (
                                                <ApplicationStep
                                                    formData={formData}
                                                    errors={errors}
                                                    onChange={handleInputChange}
                                                    onRadioChange={handleRadioChange}
                                                    onBlur={handleBlur}
                                                    onPrev={prevStep}
                                                    onSubmit={handleSubmit}
                                                    onAddCredit={() => setShowCreditModal(true)}
                                                    isSubmitting={isSubmitting}
                                                    submitError={submitError}
                                                />
                                            )}

                                            {currentStep === 3 && (
                                                <StatusStep
                                                    registrationId={registrationId}
                                                    submissionDate={submissionDate}
                                                    ApplicationStatus={ApplicationStatus}
                                                />
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {showCreditModal && (
                <CreditFacilityModal
                    newCreditFacility={newCreditFacility}
                    errors={errors}
                    onChange={setNewCreditFacility}
                    onSubmit={handleCreditFacilitySubmit}
                    onClose={() => setShowCreditModal(false)}
                />
            )}
        </div>
    );
};

export default ApplicationForm;