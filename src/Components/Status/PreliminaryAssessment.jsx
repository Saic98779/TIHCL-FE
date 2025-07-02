import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { preliminaryAssessment } from '../../services/RegistrationService/RegistrationService';
import { submitPreliminaryAssessment } from '../../services/RegistrationService/RegistrationService';
import { getAllDistricts, getMandalsByDistrict } from '../../services/RegistrationService/RegistrationService';
import { validateField } from '../../utils/validation/formValidation';

const validateUdyamNumber = (udyamNumber) => {
    if (!udyamNumber || !udyamNumber.trim()) {
        return 'Udyam Number is required';
    }
    // Example format: UDYAM-TS-00-0000000 (adjust regex if needed)
    const udyamRegex = /^udyam-[a-z]{2}-[0-9]{2}-[0-9]{7}$/i;
    if (!udyamRegex.test(udyamNumber.trim())) {
        return 'Invalid format. Correct Format: UDYAM-XX-00-1234567 OR udyam-xx-12-1234567';
    }
    return '';
};

const PreliminaryAssessment = ({ formData, updateFormData, nextStep }) => {




    const location = useLocation();

    const [factoryModalTouched, setFactoryModalTouched] = useState({
        district: false,
        mandal: false,
        address: false
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [touchedFields, setTouchedFields] = useState({
        observations: false,
        statusUpdate: false,
        riskAssessment: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [btndisable, setBtnDisable] = useState(true);
    const [errors, setErrors] = useState({
        gstNumber: '',
        udyamNumber: '',
        stressScore: '',
        observations: '',
        statusUpdate: '',
        loans: '',
        sizeOfUnit: '',
        natureOfActivity: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const [localData, setLocalData] = useState({
        nameOfFirm: formData.nameOfFirm || '',
        udyamNumber: formData.udyamNumber || '',
        sizeOfUnit: formData.sizeOfUnit || '',
        natureOfActivity: formData.natureOfActivity || '',
        factoryLocation: {
            district: formData.factoryLocation?.district || '',
            mandal: formData.factoryLocation?.mandal || '',
            address: formData.factoryLocation?.address || ''
        },
        loansCreditFacilities: formData.loansCreditFacilities || 'No',
        loans: formData.loans || [],
        gstNumber: formData.gstNumber || '',
        productType: formData.productType || '',
        productUsage: formData.productUsage || '',
        problems: formData.problems || '',
        solutions: formData.solutions || '',
        stressScore: formData.stressScore || '0%',
        observations: formData.observations || '',
        statusUpdate: formData.statusUpdate || ''
    });

    const [confirmedFields, setConfirmedFields] = useState({
        nameOfFirm: false,
        udyamNumber: false,
        sizeOfUnit: false,
        natureOfActivity: false,
        factoryLocation: false,
        loansCreditFacilities: false
    });

    const [showNameFirmModal, setShowNameFirmModal] = useState(false);
    const [showUdyamNumberModal, setShowUdyamNumberModal] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [showNatureModal, setShowNatureModal] = useState(false);
    const [showFactoryLocationModal, setShowFactoryLocationModal] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [showLoanModal, setShowLoanModal] = useState(false);

    const [newLoan, setNewLoan] = useState({
        bankName: '',
        limitSanctioned: '',
        outstandingAmount: '',
        overdueAmount: '',
        overdueSince: ''
    });
    const [editingLoanIndex, setEditingLoanIndex] = useState(null);
    const [tempFieldValue, setTempFieldValue] = useState('');

    const [districts, setDistricts] = useState([]);
    const [mandals, setMandals] = useState([]);
    const [riskCategories, setRiskCategories] = useState(Array(10).fill(null));
    const [loanErrors, setLoanErrors] = useState({});


    const validateLoan = (loan) => {
        const errors = {};
        if (!loan.bankName || !loan.bankName.trim()) errors.bankName = "Bank/Fi Name is required";
        if (!loan.natureOfLoan || !loan.natureOfLoan.trim()) errors.natureOfLoan = "Nature of Loan is required";
        if (!loan.limitSanctioned || isNaN(loan.limitSanctioned) || Number(loan.limitSanctioned) < 0) errors.limitSanctioned = "Enter a valid Limit Sanctioned";
        if (!loan.outstandingAmount || isNaN(loan.outstandingAmount) || Number(loan.outstandingAmount) < 0) errors.outstandingAmount = "Enter a valid Outstanding Amount";
        if (!loan.overdueAmount || isNaN(loan.overdueAmount) || Number(loan.overdueAmount) < 0) errors.overdueAmount = "Enter a valid Overdue Amount";
        if (Number(loan.overdueAmount) > Number(loan.outstandingAmount)) errors.overdueAmount = "Overdue Amount cannot be greater than Outstanding Amount";
        if (!loan.overdueSince) errors.overdueSince = "Overdue Since is required";
        else if (new Date(loan.overdueSince) > new Date()) errors.overdueSince = "Future date not allowed";
        return errors;
    };

    // Fetch districts
    const fetchDistricts = async () => {
        try {
            const response = await getAllDistricts();
            setDistricts(response.data || []);
        } catch (error) {
            console.error("Error fetching districts:", error);
            setApiError("Failed to load districts");
        }
    };

    // Fetch mandals based on district
    const fetchMandals = async (districtName) => {
        try {
            const district = districts.find(d => d.districtName === districtName);
            if (district) {
                const response = await getMandalsByDistrict(district.districtId);
                setMandals(response || []);
            }
        } catch (error) {
            console.error("Error fetching mandals:", error);
            setApiError("Failed to load mandals");
        }
    };

    // Calculate stress score
    const calculateStressScore = () => {
        const unansweredQuestions = riskCategories.filter(cat => !cat).length;
        if (unansweredQuestions > 0) {
            if (touchedFields.riskAssessment || formSubmitted) {
                setErrors(prev => ({
                    ...prev,
                    stressScore: 'Please answer all risk assessment questions'
                }));
            }
            return;
        }

        let totalApplicableQuestions = 10;
        let totalScore = 0;

        riskCategories.forEach((category, index) => {
            if (category && category !== "5") {
                let scoreMap = {
                    "1": 2,   // Mild/Temporary/Non-significant/etc. (2)
                    "2": 5,   // Moderate/Frequently/Significant/etc. (5 or 6)
                    "3": 10,  // Abnormal/Permanently/Serious/etc. (10)
                    "4": 1    // Not Viable (1)
                };

                // Special cases for specific questions
                if (index === 1) { // Question 2
                    scoreMap["2"] = 6; // Frequently(6)
                } else if (index === 2) { // Question 3
                    scoreMap = {
                        "1": 4,   // Fair Chance to increase (4)
                        "2": 6,   // Moderate Chance to increase (6)
                        "3": 10,  // Bleak Chance(10)
                        "4": 1    // Not Viable (1)
                    };
                } else if (index === 3) { // Question 4
                    scoreMap = {
                        "1": 4,   // Temporary cash flow mismatches(4)
                        "2": 6,   // Cash Flow mismatches coupled with diversion of funds(6)
                        "3": 10,  // Mis-utilization of cash flows and major diversions(10)
                        "4": 1    // Not Viable (1)
                    };
                } else if (index === 4) { // Question 5
                    scoreMap = {
                        "1": 5,   // Diversion with definite source (5)
                        "2": 8,   // Diversion without identified source (8)
                        "3": 10,  // Permanent diversion(10)
                        "4": 1    // Not Viable (1)
                    };
                } else if (index === 5) { // Question 6
                    scoreMap = {
                        "1": 2,   // Temporary phenomena (2)
                        "2": 6,   // External factors (6)
                        "3": 10,  // Issues related to production (10)
                        "4": 1    // Not Viable (1)
                    };
                } else if (index === 6) { // Question 7
                    scoreMap = {
                        "1": 2,   // SMA 1/2/3 (2)
                        "2": 6,   // Soft NPA (6)
                        "3": 10,  // Hard NPA(10)
                        "4": 1    // Not Viable (1)
                    };
                }

                if (scoreMap[category]) {
                    totalScore += scoreMap[category];
                }
            } else if (category === "5") {
                totalApplicableQuestions -= 1;
            }
        });

        let percentage = '0%';
        if (totalApplicableQuestions > 0) {
            const calculatedPercentage = Math.round((totalScore / (totalApplicableQuestions * 10)) * 100);
            percentage = `${calculatedPercentage}%`;
        }

        setLocalData(prev => ({
            ...prev,
            stressScore: percentage
        }));

        // Clear stress score error if calculation succeeds
        setErrors(prev => ({
            ...prev,
            stressScore: ''
        }));
    };
    const riskCategoryLabels = [
    // Q1
    {
        "1": "Mild delay",
        "2": "Moderate Delay",
        "3": "Abnormal Delay",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q2
    {
        "1": "Temporarily",
        "2": "Frequently",
        "3": "Permanently",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q3
    {
        "1": "Fair Chance to increase",
        "2": "Moderate Chance to increase",
        "3": "Bleak Chance",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q4
    {
        "1": "Temporary cash flow mismatches",
        "2": "Cash Flow mismatches coupled with diversion of funds",
        "3": "Mis-utilization of cash flows and major diversions",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q5
    {
        "1": "Diversion with definite source of resources to rebuild working capital in a specific timeline",
        "2": "Diversion without identified source to rebuild the working capital",
        "3": "Permanent diversion",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q6
    {
        "1": "Temporary phenomena due to unforeseen Internal",
        "2": "External factors, with definite timeline for correction",
        "3": "Issues related to production, marketing, temporary diversion of funds, which require considerable time to correct",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q7
    {
        "1": "SMA 1/2/3",
        "2": "Soft NPA",
        "3": "Hard NPA",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q8
    {
        "1": "Non-significant",
        "2": "Significant",
        "3": "Serious",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q9
    {
        "1": "Non-significant",
        "2": "Significant",
        "3": "Serious",
        "4": "Not Viable",
        "5": "Not Applicable"
    },
    // Q10
    {
        "1": "Non-significant",
        "2": "Significant",
        "3": "Serious",
        "4": "Not Viable",
        "5": "Not Applicable"
    }
];

const transformRiskCategoriesForApi = (riskCategories) => {
    const riskQuestions = [
        "Delay in project implementation",
        "Production below projected level of capacity utilization",
        "Gradual decrease of sales",
        "Delay in payment of statutory dues",
        "Diversion of working capital for capital expenses",
        "Abnormal increase in creditors",
        "SMA 2 / NPA Status of the Account",
        "Unjustified rapid expansion without proper financial tie-up",
        "Leverage Position",
        "Liquidity Position"
    ];

    return riskCategories
        .map((category, index) => {
            if (!category || category === "5") return null;
            return {
                issue: riskQuestions[index] || `Risk Issue ${index + 1}`,
                riskCategorisation: riskCategoryLabels[index][category] || ""
            };
        })
        .filter(Boolean);
};

    const transformFormDataForApi = (localData) => {
        return {
            enterpriseName: localData.nameOfFirm,
            promoterName: localData.promoterName,
            constitution: localData.constitution,
            udyamRegNumber: localData.udyamNumber,
            contactNumber: localData.contactNumber,
            email: localData.email,
            industrialPark: localData.factoryLocation.industrialPark,
            state: localData.factoryLocation.state,
            district: localData.factoryLocation.district,
            mandal: localData.factoryLocation.mandal,
            address: localData.factoryLocation.address,
            enterpriseCategory: localData.sizeOfUnit,
            natureOfActivity: localData.natureOfActivity,
            sector: localData.sector,
            operationStatus: localData.operationStatus,
            operatingSatisfactorily: localData.operatingSatisfactorily,
            operatingDifficulties: localData.operatingDifficulties,
            reasonForNotOperating: localData.reasonForNotOperating,
            restartSupport: localData.restartSupport,
            restartIntent: localData.restartIntent,
            existingCredit: localData.loansCreditFacilities === 'Yes',
            creditFacilityDetails: localData.loans.map(loan => ({
                bankName: loan.bankName,
                 natureOfLoan: loan.natureOfLoan,
                limitSanctioned: parseFloat(loan.limitSanctioned) || 0,
                outstandingAmount: parseFloat(loan.outstandingAmount) || 0,
                overdueAmount: parseFloat(loan.overdueAmount) || 0,
                overdueDate: loan.overdueSince || ""
            })),
            requiredCreditLimit: parseFloat(localData.requiredCreditLimit) || 0,
            investmentSubsidy: localData.investmentSubsidy,
            totalAmountSanctioned: parseFloat(localData.totalAmountSanctioned) || 0,
            amountReleased: parseFloat(localData.amountReleased) || 0,
            amountToBeReleased: parseFloat(localData.amountToBeReleased) || 0,
            maintainingAccountBy: localData.maintainingAccountBy,
            gstNumber: localData.gstNumber,
            typeOfProduct: localData.productType,
            productUsage: localData.productUsage,
            problemsFaced: localData.problems,
            expectedSolution: localData.solutions,
            helpMsg: localData.helpMsg,
            riskCategories: transformRiskCategoriesForApi(riskCategories),
            riskCategoryScore: parseInt(localData.stressScore.replace('%', '')) || 0,
            observations: localData.observations,
            status: localData.statusUpdate,
            applicationStatus: "PRELIMINARY_ASSESSMENT"
        };
    };


    const handleRiskCategoryChange = (index, value) => {
        const newCategories = [...riskCategories];
        newCategories[index] = value;
        setRiskCategories(newCategories);
        setTouchedFields(prev => ({ ...prev, riskAssessment: true }));
    };

    const handleConfirmField = (fieldName) => {
        setConfirmedFields({
            ...confirmedFields,
            [fieldName]: true
        });
    };

    const handleEditLoan = (index) => {
        setNewLoan(localData.loans[index]);
        setEditingLoanIndex(index);
        setShowLoanModal(true);
    };

    const handleDeleteLoan = (index) => {
        const updatedLoans = [...localData.loans];
        updatedLoans.splice(index, 1);
        setLocalData({
            ...localData,
            loans: updatedLoans
        });
    };

    const updateLoan = () => {

        const errors = validateLoan(newLoan);
        setLoanErrors(errors);
        if (Object.keys(errors).length > 0) return;
        const updatedLoans = [...localData.loans];
        updatedLoans[editingLoanIndex] = newLoan;
        setLocalData({
            ...localData,
            loans: updatedLoans
        });
        setNewLoan({
            bankName: '',
            limitSanctioned: '',
            outstandingAmount: '',
            overdueAmount: '',
            overdueSince: ''
        });
        setEditingLoanIndex(null);
        setShowLoanModal(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalData({
            ...localData,
            [name]: type === 'radio' ? value : (type === 'checkbox' ? checked : value)
        });

        // Mark field as touched when changed
        if (name === 'observations' || name === 'statusUpdate') {
            setTouchedFields(prev => ({ ...prev, [name]: true }));
        }
    };
    const handleLoanChange = (e) => {
        const { name, value } = e.target;
        setNewLoan({
            ...newLoan,
            [name]: value
        });
    };

    const addLoan = () => {
        const errors = validateLoan(newLoan);
        setLoanErrors(errors);
        if (Object.keys(errors).length > 0) return;

        if (editingLoanIndex !== null) {
            updateLoan();
        } else {
            setLocalData({
                ...localData,
                loans: [...localData.loans, newLoan]
            });
            setNewLoan({
                bankName: '',
                limitSanctioned: '',
                outstandingAmount: '',
                overdueAmount: '',
                overdueSince: ''
            });
            setShowLoanModal(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        // Force all fields to be considered touched on submit
        setTouchedFields({
            observations: true,
            statusUpdate: true,
            riskAssessment: true
        });

        // Run validation checks
        const gstError = validateGST(localData.gstNumber, true);
        const observationsError = !localData.observations.trim() ? 'Observations are required' : '';
        const statusError = !localData.statusUpdate ? 'Please select a status' : '';
        const stressScoreError = localData.stressScore === '0%' ? 'Please complete the risk assessment' : '';
        const loansError = localData.loansCreditFacilities === 'Yes' && localData.loans.length === 0
            ? 'At least one loan must be added'
            : '';

        setErrors({
            gstNumber: gstError,
            observations: observationsError,
            statusUpdate: statusError,
            stressScore: stressScoreError,
            loans: loansError
        });
        // Check if form is valid
        if (gstError || observationsError || statusError || stressScoreError || loansError) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const applicationNo = location.state?.application?.applicationNo || formData.applicationNo;

            if (!applicationNo) {
                throw new Error("Application number is required");
            }

            // First update local form data
            updateFormData(localData);

            // Transform the data to match API structure
            const apiPayload = transformFormDataForApi(localData, riskCategories);
            console.log("API Payload:", apiPayload); // For debugging

            // Then submit to API with transformed data
            await submitPreliminaryAssessment(applicationNo, apiPayload);

            // Proceed to next step
            nextStep();

        } catch (error) {
            console.error("Submission error:", error);
            setSubmitError(error.message || 'Failed to submit assessment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateField = (fieldName) => {
        if (fieldName === 'nameOfFirm' && (!tempFieldValue || !tempFieldValue.trim())) {
            setErrors(prev => ({
                ...prev,
                nameOfFirm: 'Name Of Firm is required'
            }));
            return;
        } else if (fieldName === 'nameOfFirm') {
            setErrors(prev => ({
                ...prev,
                nameOfFirm: ''
            }));
        }

        setLocalData({
            ...localData,
            [fieldName]: tempFieldValue
        });
        setConfirmedFields({
            ...confirmedFields,
            [fieldName]: false
        });

        switch (fieldName) {
            case 'nameOfFirm':
                setShowNameFirmModal(false);
                break;
            case 'udyamNumber':
                setShowUdyamNumberModal(false);
                break;
            case 'sizeOfUnit':
                setShowSizeModal(false);
                break;
            case 'natureOfActivity':
                setShowNatureModal(false);
                break;
            case 'factoryLocation':
                setShowFactoryLocationModal(false);
                break;
            case 'loansCreditFacilities':
                setShowCreditModal(false);
                break;
            default:
                break;
        }

        setTempFieldValue('');
    };
    const validateFactoryLocation = (location) => {
        if (!location.district) return "District is required";
        if (!location.mandal) return "Mandal is required";
        if (!location.address) return "Address is required";
        return "";
    };
    const handleOpenModal = (fieldName) => {
        switch (fieldName) {
            case 'nameOfFirm':
                setTempFieldValue(localData.nameOfFirm);
                setShowNameFirmModal(true);
                break;
            case 'udyamNumber':
                setTempFieldValue(localData.udyamNumber);
                setShowUdyamNumberModal(true);
                break;
            case 'sizeOfUnit':
                setTempFieldValue(localData.sizeOfUnit);
                setShowSizeModal(true);
                break;
            case 'natureOfActivity':
                setTempFieldValue(localData.natureOfActivity);
                setShowNatureModal(true);
                break;
            case 'factoryLocation':
                setTempFieldValue({
                    district: localData.factoryLocation.district,
                    mandal: localData.factoryLocation.mandal,
                    address: localData.factoryLocation.address
                });
                setShowFactoryLocationModal(true);
                break;
            case 'loansCreditFacilities':
                setTempFieldValue(localData.loansCreditFacilities);
                setShowCreditModal(true);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const fetchPreliminaryAssessment = async () => {
            try {
                setIsLoading(true);
                setApiError(null);

                if (location.state?.application?.registrationUsageId) {
                    const response = await preliminaryAssessment(location.state.application.registrationUsageId);
                    const apiData = response?.data || response;

                    if (!apiData) {
                        throw new Error("No data received from API");
                    }

                    setLocalData(prev => ({
                        ...prev,
                        // Basic information
                        nameOfFirm: apiData.enterpriseName || prev.nameOfFirm,
                        promoterName: apiData.promoterName || prev.promoterName,
                        constitution: apiData.constitution || prev.constitution,
                        udyamNumber: apiData.udyamRegNumber || prev.udyamNumber,
                        contactNumber: apiData.contactNumber || prev.contactNumber,
                        email: apiData.email || prev.email,
                        sizeOfUnit: apiData.enterpriseCategory || prev.sizeOfUnit,
                        natureOfActivity: apiData.natureOfActivity || prev.natureOfActivity,
                        sector: apiData.sector || prev.sector,

                        // Location information
                        factoryLocation: {
                            industrialPark: apiData.industrialPark || prev.factoryLocation.industrialPark,
                            state: apiData.state || prev.factoryLocation.state,
                            district: apiData.district || prev.factoryLocation.district,
                            mandal: apiData.mandal || prev.factoryLocation.mandal,
                            address: apiData.address || prev.factoryLocation.address
                        },

                        // Operation status
                        operationStatus: apiData.operationStatus !== false,
                        operatingSatisfactorily: apiData.operatingSatisfactorily || prev.operatingSatisfactorily,
                        operatingDifficulties: apiData.operatingDifficulties || prev.operatingDifficulties,
                        issueDate: apiData.issueDate || prev.issueDate,
                        reasonForNotOperating: apiData.reasonForNotOperating || prev.reasonForNotOperating,
                        restartSupport: apiData.restartSupport || prev.restartSupport,
                        restartIntent: apiData.restartIntent !== false,

                        // Financial information
                        loansCreditFacilities: apiData.existingCredit ? 'Yes' : 'No',
                        loans: apiData.creditFacilityDetails || prev.loans,
                        requiredCreditLimit: apiData.requiredCreditLimit || prev.requiredCreditLimit,
                        investmentSubsidy: apiData.investmentSubsidy || prev.investmentSubsidy,
                        totalAmountSanctioned: apiData.totalAmountSanctioned || prev.totalAmountSanctioned,
                        amountReleased: apiData.amountReleased || prev.amountReleased,
                        amountToBeReleased: apiData.amountToBeReleased || prev.amountToBeReleased,
                        maintainingAccountBy: apiData.maintainingAccountBy || prev.maintainingAccountBy,

                        // Product information
                        gstNumber: apiData.gstNumber || prev.gstNumber,
                        productType: apiData.typeOfProduct || prev.productType,
                        productUsage: apiData.productUsage || prev.productUsage,
                        problems: apiData.problemsFaced || prev.problems,
                        solutions: apiData.expectedSolution || prev.solutions,

                        // Assessment fields
                        observations: apiData.observations || prev.observations,
                        helpMsg: apiData.helpMsg || prev.helpMsg
                    }));
                }
            } catch (error) {
                console.error("Error fetching preliminary assessment:", error);
                setApiError(error.message || "Failed to load application data");
                if (Object.keys(formData).length > 0) {
                    setLocalData(formData);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreliminaryAssessment();
    }, [location.state?.application?.registrationUsageId, formData]);



    //this is required for gst validation temporary disabled it need to enable it later

    // const validateGST = (gstNumber, checkSubmitted = true) => {
    //     if (!checkSubmitted || formSubmitted) {
    //         if (!gstNumber.trim()) {
    //             return 'GST Number is required';
    //         } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gstNumber)) {
    //             return 'Invalid GST Number format';
    //         }
    //     }
    //     return '';
    // };


    const validateGST = (gstNumber, checkSubmitted = true) => {
    // Only validate format if GST is not empty
    if (gstNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gstNumber)) {
        return 'Invalid GST Number format';
    }
    return '';
};
    const handleValidation = (e) => {
        const { name, value } = e.target;

        if (name === 'gstNumber') {
            const error = validateGST(value, formSubmitted);
            setErrors(prev => ({
                ...prev,
                gstNumber: error
            }));
        }
    };

    const isFormValid = () => {
        // Check confirmed fields
        const requiredConfirmedFields = [
            'nameOfFirm',
            'udyamNumber',
            'sizeOfUnit',
            'natureOfActivity',
            'factoryLocation',
            'loansCreditFacilities'
        ];

        const allConfirmed = requiredConfirmedFields.every(field => confirmedFields[field]);
        if (!allConfirmed) return false;

        // Validate Udyam Number
        const udyamError = validateUdyamNumber(localData.udyamNumber);
        if (udyamError) return false;



        const validateFields = () => {
            const newErrors = {};

            if (!localData.sizeOfUnit || !localData.sizeOfUnit.trim()) {
                newErrors.sizeOfUnit = 'Size of Unit is required';
            }
            if (!localData.natureOfActivity || !localData.natureOfActivity.trim()) {
                newErrors.natureOfActivity = 'Nature of Activity is required';
            }
            // ...other validations...

            setErrors(prev => ({ ...prev, ...newErrors }));
            return Object.keys(newErrors).length === 0;
        };



        // Validate Factory Location
        const locationError = validateFactoryLocation(localData.factoryLocation);
        if (locationError) return false;

        // Check other required fields  // this is required  temporary commented this 
        // const gstError = validateGST(localData.gstNumber, false);
        // if (gstError) return false;

        if (!localData.observations.trim()) return false;
        if (!localData.statusUpdate) return false;

        // Check stress score
        if (localData.stressScore === '0%') return false;

        if (localData.loansCreditFacilities === 'Yes' && localData.loans.length === 0) return false;
         const gstError = validateGST(localData.gstNumber, false);
    if (localData.gstNumber.trim() && gstError) return false;

        return true;
    };
    // Update button disabled state when form data changes
    useEffect(() => {
        setBtnDisable(!isFormValid());
    }, [localData, confirmedFields, riskCategories]);

    // Calculate stress score when risk categories change
    useEffect(() => {
        calculateStressScore();
    }, [riskCategories]);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            await fetchDistricts();
        };

        fetchData();
    }, [location.state?.application?.registrationUsageId]);

    return (
        <fieldset>
            {isLoading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2">Loading application data...</p>
                </div>
            )}

            {apiError && (
                <div className="alert alert-danger">{apiError}</div>
            )}

            {!isLoading && !apiError && (
                <>
                    <div className="card border rounded-2 shadow-none mb-3">
                        <div className="card-header bg-theme text-white">
                            <h6 className="mb-0">Preliminary Assessment</h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                            <label className="fs-md fw-600">Name Of Firm <span className='text-danger'>*</span></label>
                                        </div>
                                        <div className="col-12 col-sm-5 col-md-4 col-lg-6 col-xl-4">
                                            <label className="fs-md">{localData.nameOfFirm}</label>
                                            {confirmedFields.nameOfFirm && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-3 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                {confirmedFields.nameOfFirm ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success border-0 btn-sm"
                                                        disabled
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirmed
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success border-0 btn-sm"
                                                            onClick={() => handleConfirmField('nameOfFirm')}
                                                            disabled={!localData.nameOfFirm.trim()}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm border-0 ms-3"
                                                            onClick={() => handleOpenModal('nameOfFirm')}
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Udyam Number Field */}
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                            <label className="fs-md fw-600">Udyam Number <span className='text-danger'>*</span></label>
                                        </div>
                                        <div className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-4">
                                            <label className="fs-md">{localData.udyamNumber}</label>
                                            {confirmedFields.udyamNumber && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                            {/* {errors.udyamNumber && (
                                                <div className="text-danger small">{errors.udyamNumber}</div>
                                            )} */}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-5 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                {confirmedFields.udyamNumber ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success border-0 btn-sm"
                                                        disabled
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirmed
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success border-0 btn-sm"
                                                            onClick={() => {
                                                                const error = validateUdyamNumber(localData.udyamNumber);
                                                                if (error) {
                                                                    setErrors(prev => ({ ...prev, udyamNumber: error }));
                                                                } else {
                                                                    setErrors(prev => ({ ...prev, udyamNumber: '' }));
                                                                    handleConfirmField('udyamNumber');
                                                                }
                                                            }}
                                                            disabled={!localData.udyamNumber.trim()}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm border-0 ms-3"
                                                            onClick={() => handleOpenModal('udyamNumber')}
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Size of Unit Field */}
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                            <label className="fs-md fw-600">Size of Unit <span className='text-danger'>*</span></label>
                                        </div>
                                        <div className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-4">
                                            <label className="fs-md">{localData.sizeOfUnit}</label>
                                            {confirmedFields.sizeOfUnit && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-5 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                {confirmedFields.sizeOfUnit ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success border-0 btn-sm"
                                                        disabled
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirmed
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success border-0 btn-sm"
                                                            onClick={() => handleConfirmField('sizeOfUnit')}
                                                            disabled={!localData.sizeOfUnit.trim()}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm border-0 ms-3"
                                                            onClick={() => handleOpenModal('sizeOfUnit')}
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Nature of Activity Field */}
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                            <label className="fs-md fw-600">Nature of Activity <span className='text-danger'>*</span></label>
                                        </div>
                                        <div className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-4">
                                            <label className="fs-md">{localData.natureOfActivity}</label>
                                            {confirmedFields.natureOfActivity && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-5 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                {confirmedFields.natureOfActivity ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success border-0 btn-sm"
                                                        disabled
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirmed
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success border-0 btn-sm"
                                                            onClick={() => handleConfirmField('natureOfActivity')}
                                                            disabled={!localData.natureOfActivity.trim()}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm border-0 ms-3"
                                                            onClick={() => handleOpenModal('natureOfActivity')}
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Factory Location Field */}
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                            <label className="fs-md fw-600">Factory Location <span className='text-danger'>*</span></label>
                                            {confirmedFields.factoryLocation && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-4">
                                            <div className="fs-md d-flex justify-content-between">
                                                <div>
                                                    <strong>District</strong><br />
                                                    {localData.factoryLocation.district}
                                                </div>
                                                <div>
                                                    <strong>Mandal</strong><br />
                                                    {localData.factoryLocation.mandal}
                                                </div>
                                                <div>
                                                    <strong>Address</strong><br />
                                                    {localData.factoryLocation.address}
                                                </div>
                                            </div>

                                            {errors.factoryLocation && (
                                                <div className="text-danger small">{errors.factoryLocation}</div>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-5 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                {confirmedFields.factoryLocation ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success border-0 btn-sm"
                                                        disabled
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirmed
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success border-0 btn-sm"
                                                            onClick={() => {
                                                                const error = validateFactoryLocation(localData.factoryLocation);
                                                                if (error) {
                                                                    setErrors(prev => ({ ...prev, factoryLocation: error }));
                                                                } else {
                                                                    handleConfirmField('factoryLocation');
                                                                }
                                                            }}
                                                            disabled={
                                                                !localData.factoryLocation.district ||
                                                                !localData.factoryLocation.mandal ||
                                                                !localData.factoryLocation.address
                                                            }
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm border-0 ms-3"
                                                            onClick={() => handleOpenModal('factoryLocation')}
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Loans/Credit Facilities Field */}
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                            <label className="fs-md fw-600">Loans/Credit Facilities <span className='text-danger'>*</span></label>
                                        </div>
                                        <div className="col-12 col-sm-5 col-md-4 col-lg-4 col-xl-4">
                                            <label className="fs-md">{localData.loansCreditFacilities}</label>
                                            {confirmedFields.loansCreditFacilities && (
                                                <span className="text-success ms-2">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-5 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                {confirmedFields.loansCreditFacilities ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success border-0 btn-sm"
                                                        disabled
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirmed
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success border-0 btn-sm"
                                                            onClick={() => handleConfirmField('loansCreditFacilities')}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary btn-sm border-0 ms-3"
                                                            onClick={() => handleOpenModal('loansCreditFacilities')}
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Loans Table */}
                                <li className="list-group-item px-0">
                                    <div className="row">
                                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <label className="fs-md fw-600">Loans{localData.loansCreditFacilities === "Yes" && (
                                                <span className='text-danger'>*</span>
                                            )}</label>
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                            <div className="text-start text-sm-end text-xl-end">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm border-0 ms-3 ${localData.loans?.length > 0 || localData.loansCreditFacilities === 'Yes'
                                                        ? 'btn-outline-primary'
                                                        : 'btn-outline-secondary disabled'
                                                        }`}
                                                    onClick={() => setShowLoanModal(true)}
                                                    disabled={!(localData.loans?.length > 0 || localData.loansCreditFacilities === 'Yes')}
                                                >
                                                    <span className="bi bi-plus-lg"></span> Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive mt-3">
                                        <table className="table table-striped table-borderless fs-md">
                                            <thead className="bg-theme text-white">
                                                <tr>
                                                    <th className='bg-primary text-white fw-bold border text-center'>S.No</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Bank/Fis Name</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Nature of loan</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Limit sanctioned (In Rs)</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Outstanding Amount (In Rs)</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Overdue Amount (In Rs)</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Overdue Since (Date)</th>
                                                    <th className='bg-primary text-white fw-bold border text-center'>Action</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {localData.loans.map((loan, index) => (
                                                    <tr key={index}>
                                                        <td className='border text-center'>{index + 1}</td>
                                                        <td className='border text-center'>{loan.bankName}</td>
                                                        <td className='border text-center'>{loan.natureOfLoan}</td>
                                                        <td className='border text-center'>{loan.limitSanctioned}</td>
                                                        <td className='border text-center'>{loan.outstandingAmount}</td>
                                                        <td className='border text-center'>{loan.overdueAmount}</td>
                                                        <td className='border text-center'>{loan.overdueSince}</td>
                                                        <td className='border text-center' >
                                                            <div className="d-flex gap-2 text-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary border-0 text-center"
                                                                    onClick={() => handleEditLoan(index)}
                                                                >
                                                                    <span className="text-dark fw-bold">Edit</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger border-0 text-center"
                                                                    onClick={() => handleDeleteLoan(index)}
                                                                >
                                                                    <span className="text-dark fw-bold">Delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            </ul>

                            {/* Additional Form Fields */}
                            {/* GST Number Field with validation */}
                            <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                    <div className="mb-3">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                required
                                                className={`form-control ${errors.gstNumber ? 'is-invalid' : ''}`}
                                                id="gst"
                                                placeholder="GST"
                                                name="gstNumber"
                                                value={localData.gstNumber}
                                                onChange={handleChange}
                                                onBlur={handleValidation}
                                            />
                                            <label htmlFor="gst">GST Number <span className='text-danger'></span></label>
                                            {errors.gstNumber && (
                                                <div className="invalid-feedback">{errors.gstNumber}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                    <div className="mb-3">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="product"
                                                placeholder="Type Of Product"
                                                name="productType"
                                                value={localData.productType}
                                                onChange={handleChange}

                                            />
                                            <label htmlFor="product">Manufacturing Activity</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-8 col-lg-8 col-xl-8">
                                    <div className="mb-3">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="whereProduct"
                                                placeholder="Where is the Product Used"
                                                name="productUsage"
                                                value={localData.productUsage}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="whereProduct">Where is the Product Used?</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-3">
                                    <label className="fs-md fw-600 mb-1">What are the problems that are being faced by the unit?</label>
                                    <div>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Write here"
                                            name="problems"
                                            value={localData.problems}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="fs-md fw-600 mb-1">What are the expected solutions?</label>
                                    <div>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Write here"
                                            name="solutions"
                                            value={localData.solutions}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h6 className="fs-md fw-600 mb-1">Stress Score <span className='text-danger'>*</span></h6>
                                    {errors.stressScore && (touchedFields.riskAssessment || formSubmitted) && (
                                        <div className="alert alert-danger">{errors.stressScore}</div>
                                    )}
                                    <div className="accordion mb-2">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="risk-headingOne">
                                                <button
                                                    className="accordion-button collapsed fs-md fw-600 px-3 py-2"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#risk-collapseOne"
                                                    aria-expanded="false"
                                                    aria-controls="risk-collapseOne"
                                                >
                                                    Score Calculation
                                                </button>
                                            </h2>
                                            <div id="risk-collapseOne" className="accordion-collapse collapse" aria-labelledby="risk-headingOne">
                                                <div className="accordion-body p-2">
                                                    <div className="table-responsive">
                                                        <table className="table table-striped table-borderless mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>S.No</th>
                                                                    <th>Issues / Problems</th>
                                                                    <th>Probable Cause</th>
                                                                    <th>Impact</th>
                                                                    <th>Risk Categorisation</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="fs-md">
                                                                {/* Question 1 */}
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>Delay in project implementation</td>
                                                                    <td>Wrong assessment. Lack of involvement. Delay in supply of machineries. Lack of control.</td>
                                                                    <td>Cost over run / Time over run / diversion of funds ear maked for WC / termloan margins / Lack of WC funds for operation</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[0] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(0, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Mild delay(2)</option>
                                                                            <option value="2">Moderate Delay(5)</option>
                                                                            <option value="3">Abnormal Delay(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 2 */}
                                                                <tr>
                                                                    <td>2</td>
                                                                    <td>Production below projected level of capacity utilization</td>
                                                                    <td>Absence of expert operators. Lack of raw materials. Improper factory setup. Power/labour problems. Lack of demand.</td>
                                                                    <td>Lack of required WC funds to meet the operations / Low cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[1] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(1, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Temporarily(2)</option>
                                                                            <option value="2">Frequently(6)</option>
                                                                            <option value="3">Permanently(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 3 */}
                                                                <tr>
                                                                    <td>3</td>
                                                                    <td>Gradual decrease of sales</td>
                                                                    <td>Diversion of fund. Nonrealization of Book Debts. Lack of concentration on Marketing. Production bottleneck. Mismanagement. Poor quality. Increased competition.</td>
                                                                    <td>Low cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[2] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(2, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Fair Chance to increase (4)</option>
                                                                            <option value="2">Moderate Chance to increase (6)</option>
                                                                            <option value="3">Bleak Chance(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 4 */}
                                                                <tr>
                                                                    <td>4</td>
                                                                    <td>Delay in payment of statutory dues</td>
                                                                    <td>Casual in nature. Lack of sufficient cash-flow / cash flow mismatches.</td>
                                                                    <td>Haulting production</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[3] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(3, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Temporary cash flow mismatches(4)</option>
                                                                            <option value="2">Cash Flow mismatches coupled with diversion of funds(6)</option>
                                                                            <option value="3">Mis-utilization of cash flows and major diversions(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 5 */}
                                                                <tr>
                                                                    <td>5</td>
                                                                    <td>Diversion of working capital for capital expenses</td>
                                                                    <td>May be for urgent settlement. Inadequate internal accrual. Lack of planning. May be a deliberate act.</td>
                                                                    <td>Low capacity ulitization / declain in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[4] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(4, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Diversion with definite source of resources to rebuild working capital in a specific timeline(5)</option>
                                                                            <option value="2">Diversion without identified source to rebuild the working capital(8)</option>
                                                                            <option value="3">Permanent diversion(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 6 */}
                                                                <tr>
                                                                    <td>6</td>
                                                                    <td>Abnormal increase in creditors</td>
                                                                    <td>Suppliers trying to dump the product. Lack of production planning. Inadequate cash flow. Diversion of funds. Overtrading. Non realisation of Trade recivables within the contacted credit period. Decline in demand</td>
                                                                    <td>Low capacity ulitization / declain in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[5] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(5, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Temporary phenomena due to unforeseen Internal(2)</option>
                                                                            <option value="2">External factors, with definite timeline for correction(6)</option>
                                                                            <option value="3">Issues related to production, marketing, temporary diversion of funds, which require considerable time to correct (10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 7 */}
                                                                <tr>
                                                                    <td>7</td>
                                                                    <td>SMA 2 / NPA Status of the Account</td>
                                                                    <td>Stress, Incipient sickness or sickness of the Unit.</td>
                                                                    <td>Seaing of the unit / Iniate recovery procedure / Winding of the unit</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[6] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(6, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">SMA 1/2/3 (2)</option>
                                                                            <option value="2">Soft NPA (6)</option>
                                                                            <option value="3">Hard NPA(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 8 */}
                                                                <tr>
                                                                    <td>8</td>
                                                                    <td>Unjustified rapid expansion without proper financial tie-up</td>
                                                                    <td>To have better market share. Improper planning.</td>
                                                                    <td>Diversion of funds / Low capacity ulitization / declain in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[7] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(7, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Non-significant(2)</option>
                                                                            <option value="2">Significant(6)</option>
                                                                            <option value="3">Serious(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 9 */}
                                                                <tr>
                                                                    <td>9</td>
                                                                    <td>Leverage Position</td>
                                                                    <td></td>
                                                                    <td>Long term lqiudity issues / Low capacity ulitization / declain in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[8] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(8, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Non-significant(2)</option>
                                                                            <option value="2">Significant(6)</option>
                                                                            <option value="3">Serious(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Question 10 */}
                                                                <tr>
                                                                    <td>10</td>
                                                                    <td>Liquidity Position</td>
                                                                    <td></td>
                                                                    <td>Short term lqiudity issues/ Low capacity ulitization / declain in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/Fis / Account is out of order.</td>
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            value={riskCategories[9] || ""}
                                                                            onChange={(e) => handleRiskCategoryChange(9, e.target.value)}
                                                                        >
                                                                            <option value="">Select Categorisation</option>
                                                                            <option value="1">Non-significant(2)</option>
                                                                            <option value="2">Significant(6)</option>
                                                                            <option value="3">Serious(10)</option>
                                                                            <option value="4">Not Viable (1)</option>
                                                                            <option value="5">Not Applicable (0 & this question should be removed from calculation of score)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <p className="badge bg-dark rounded-pill fs-md mb-0">
                                            Total Score: <span>{localData.stressScore}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Observations Field */}
                                <div className="mb-3">
                                    <label className="fs-md fw-600 mb-1">Observations <span className='text-danger'>*</span></label>
                                    <textarea
                                        className={`form-control ${(touchedFields.observations || formSubmitted) && !localData.observations.trim()
                                            ? 'is-invalid'
                                            : ''
                                            }`}
                                        rows="3"
                                        placeholder="Write here"
                                        name="observations"
                                        value={localData.observations}
                                        onChange={handleChange}
                                        onBlur={() => setTouchedFields(prev => ({ ...prev, observations: true }))}
                                    ></textarea>
                                    {(touchedFields.observations || formSubmitted) && !localData.observations.trim() && (
                                        <div className="invalid-feedback">Observations are required</div>
                                    )}
                                </div>
                                {/* Status Update Field */}
                                <div className="mb-3">
                                    <label className="fs-md fw-600 mb-1">Status Update <span className='text-danger'>*</span></label>
                                    <div className="mb-2">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="statusUpdate"
                                                id="consider"
                                                value="consider"
                                                checked={localData.statusUpdate === 'consider'}
                                                onChange={handleChange}
                                                onBlur={() => setTouchedFields(prev => ({ ...prev, statusUpdate: true }))}
                                            />
                                            <label className="form-check-label fs-md" htmlFor="consider">
                                                Application can be considered
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="statusUpdate"
                                                id="notconsider"
                                                value="notconsider"
                                                checked={localData.statusUpdate === 'notconsider'}
                                                onChange={handleChange}
                                                onBlur={() => setTouchedFields(prev => ({ ...prev, statusUpdate: true }))}
                                            />
                                            <label className="form-check-label fs-md" htmlFor="notconsider">
                                                Application cannot be considered
                                            </label>
                                        </div>
                                    </div>
                                    {(touchedFields.statusUpdate || formSubmitted) && !localData.statusUpdate && (
                                        <div className="text-danger">Please select a status</div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <input
                        type="button"
                        name="next"
                        className="next btn btn-primary float-end"
                        value="Submit for Manager Approval"
                        onClick={handleSubmit}
                        disabled={btndisable || isSubmitting|| !localData.statusUpdate}
                    />

                    {/* Modals */}
                    {showNameFirmModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">Update Name Of Firm</h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => setShowNameFirmModal(false)}
                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.nameOfFirm ? 'is-invalid' : ''}`}
                                                            id="Firm"
                                                            placeholder=""
                                                            value={tempFieldValue}
                                                            onChange={(e) => {
                                                                setTempFieldValue(e.target.value);
                                                                if (e.target.value.trim()) {
                                                                    setErrors(prev => ({ ...prev, nameOfFirm: '' }));
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                if (!tempFieldValue.trim()) {
                                                                    setErrors(prev => ({ ...prev, nameOfFirm: 'Name Of Firm is required' }));
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor="Firm">Name of Firm</label>
                                                        {errors.nameOfFirm && (
                                                            <div className="invalid-feedback">{errors.nameOfFirm}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowNameFirmModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    if (!tempFieldValue.trim()) {
                                                        setErrors(prev => ({ ...prev, nameOfFirm: 'Name Of Firm is required' }));
                                                        return;
                                                    }
                                                    setErrors(prev => ({ ...prev, nameOfFirm: '' }));
                                                    handleUpdateField('nameOfFirm');
                                                }}
                                                disabled={!tempFieldValue.trim()}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showUdyamNumberModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">Update Udyam Number</h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => setShowUdyamNumberModal(false)}
                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.udyamNumber ? 'is-invalid' : ''}`}
                                                            id="udyam"
                                                            placeholder=""
                                                            value={tempFieldValue}
                                                            onChange={e => {
                                                                setTempFieldValue(e.target.value);
                                                                const error = validateUdyamNumber(e.target.value);
                                                                setErrors(prev => ({ ...prev, udyamNumber: error }));
                                                            }}
                                                        />
                                                        <label htmlFor="udyam">Udyam Number</label>
                                                        {errors.udyamNumber && (
                                                            <div className="invalid-feedback">{errors.udyamNumber}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowUdyamNumberModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    handleUpdateField('udyamNumber');
                                                }}
                                                disabled={!!errors.udyamNumber || !tempFieldValue}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {showSizeModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">Update Size of Unit</h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => setShowSizeModal(false)}
                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="size" className="form-label">Size of Unit</label>
                                                        <select
                                                            className={`form-select ${errors.sizeOfUnit ? 'is-invalid' : ''}`}
                                                            id="size"
                                                            value={tempFieldValue}
                                                            onChange={(e) => setTempFieldValue(e.target.value)}
                                                            onBlur={() => {
                                                                if (!tempFieldValue) {
                                                                    setErrors(prev => ({ ...prev, sizeOfUnit: 'Size of Unit is required' }));
                                                                } else {
                                                                    setErrors(prev => ({ ...prev, sizeOfUnit: '' }));
                                                                }
                                                            }}
                                                        >
                                                            <option value="">Select Size</option>
                                                            <option value="Micro">Micro</option>
                                                            <option value="Small">Small</option>
                                                            <option value="Medium">Medium</option>
                                                        </select>
                                                        {errors.sizeOfUnit && <div className="invalid-feedback">{errors.sizeOfUnit}</div>}

                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowSizeModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    if (!tempFieldValue) {
                                                        setErrors(prev => ({ ...prev, sizeOfUnit: 'sizeOfUnit is required' }));
                                                        return;
                                                    }
                                                    setErrors(prev => ({ ...prev, sizeOfUnit: '' }));
                                                    handleUpdateField('sizeOfUnit');
                                                }}
                                                disabled={!tempFieldValue}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showNatureModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">Update Nature of Activity</h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => setShowNatureModal(false)}
                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="nature" className="form-label">Nature of Activity</label>
                                                        <select
                                                            className={`form-select ${errors.natureOfActivity ? 'is-invalid' : ''}`}
                                                            id="nature"
                                                            value={tempFieldValue}
                                                            onChange={(e) => setTempFieldValue(e.target.value)}
                                                            onBlur={() => {
                                                                if (!tempFieldValue) {
                                                                    setErrors(prev => ({ ...prev, natureOfActivity: 'Nature of Activity is required' }));
                                                                } else {
                                                                    setErrors(prev => ({ ...prev, natureOfActivity: '' }));
                                                                }
                                                            }}
                                                        >
                                                            <option value="">Select Nature</option>
                                                            <option value="manufacturing">Manufacturing</option>
                                                            <option value="service">Service</option>
                                                            <option value="trading">Trading</option>
                                                        </select>
                                                        {errors.natureOfActivity && <div className="invalid-feedback">{errors.natureOfActivity}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowNatureModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    if (!tempFieldValue) {
                                                        setErrors(prev => ({ ...prev, natureOfActivity: 'Nature of Activity is required' }));
                                                        return;
                                                    }
                                                    setErrors(prev => ({ ...prev, natureOfActivity: '' }));
                                                    handleUpdateField('natureOfActivity');
                                                }}
                                                disabled={!tempFieldValue}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showFactoryLocationModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">Update Factory Location</h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => setShowFactoryLocationModal(false)}

                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="district" className="form-label">District <span className="text-danger">*</span></label>
                                                        <select
                                                            className={`form-select ${!tempFieldValue.district && factoryModalTouched.district ? 'is-invalid' : ''}`}
                                                            id="district"
                                                            value={tempFieldValue.district}
                                                            onChange={e => {
                                                                const selectedDistrict = e.target.value;
                                                                setTempFieldValue({
                                                                    ...tempFieldValue,
                                                                    district: selectedDistrict,
                                                                    mandal: ''
                                                                });
                                                                fetchMandals(selectedDistrict);
                                                            }}
                                                            onBlur={() => setFactoryModalTouched(prev => ({ ...prev, district: true }))}
                                                        >
                                                            <option value="">Select District</option>
                                                            {districts.map((district) => (
                                                                <option key={district.districtId} value={district.districtName}>
                                                                    {district.districtName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {!tempFieldValue.district && factoryModalTouched.district && (
                                                            <div className="invalid-feedback">District is required</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="mandal" className="form-label">Mandal <span className="text-danger">*</span></label>
                                                        <select
                                                            className={`form-select ${!tempFieldValue.mandal && factoryModalTouched.mandal ? 'is-invalid' : ''}`}
                                                            id="mandal"
                                                            value={tempFieldValue.mandal}
                                                            onChange={e => setTempFieldValue({
                                                                ...tempFieldValue,
                                                                mandal: e.target.value
                                                            })}
                                                            onBlur={() => setFactoryModalTouched(prev => ({ ...prev, mandal: true }))}
                                                            disabled={!tempFieldValue.district || mandals.length === 0}
                                                        >
                                                            <option value="">Select Mandal</option>
                                                            {mandals.map((mandal) => (
                                                                <option key={mandal.mandalId} value={mandal.mandalName}>
                                                                    {mandal.mandalName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {!tempFieldValue.mandal && factoryModalTouched.mandal && (
                                                            <div className="invalid-feedback">Mandal is required</div>
                                                        )}

                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="address" className="form-label">Address <span className="text-danger">*</span></label>
                                                        <textarea
                                                            className={`form-control ${!tempFieldValue.address && factoryModalTouched.address ? 'is-invalid' : ''}`}
                                                            id="address"
                                                            placeholder=""
                                                            value={tempFieldValue.address}
                                                            onChange={e => setTempFieldValue({
                                                                ...tempFieldValue,
                                                                address: e.target.value
                                                            })}
                                                            onBlur={() => setFactoryModalTouched(prev => ({ ...prev, address: true }))}
                                                        ></textarea>
                                                        {!tempFieldValue.address && factoryModalTouched.address && (
                                                            <div className="invalid-feedback">Address is required</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowFactoryLocationModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    if (!tempFieldValue.district || !tempFieldValue.mandal || !tempFieldValue.address) {
                                                        setFormSubmitted(true);
                                                    } else {
                                                        handleUpdateField('factoryLocation');
                                                    }
                                                }}
                                                disabled={!tempFieldValue.district || !tempFieldValue.mandal || !tempFieldValue.address}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    )}

                    {showCreditModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">Update Loans/Credit Facilities</h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => setShowCreditModal(false)}
                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="loansCreditFacilities"
                                                            id="loansYes"
                                                            value="Yes"
                                                            checked={tempFieldValue === 'Yes'}
                                                            onChange={() => setTempFieldValue('Yes')}
                                                        />
                                                        <label className="form-check-label" htmlFor="loansYes">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="loansCreditFacilities"
                                                            id="loansNo"
                                                            value="No"
                                                            checked={tempFieldValue === 'No'}
                                                            onChange={() => setTempFieldValue('No')}
                                                        />
                                                        <label className="form-check-label" htmlFor="loansNo">
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => setShowCreditModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => handleUpdateField('loansCreditFacilities')}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showLoanModal && (
                        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                                <div className="modal-content border">
                                    <div className="modal-header py-2 bg-primary">
                                        <h6 className="modal-title text-white">
                                            {editingLoanIndex !== null ? 'Edit Loan Details' : 'Add Loan Details'}
                                        </h6>
                                        <button
                                            type="button"
                                            className="btn-close text-white fs-4 p-0"
                                            onClick={() => {
                                                setShowLoanModal(false);
                                                setEditingLoanIndex(null);
                                                setNewLoan({
                                                    bankName: '',
                                                    limitSanctioned: '',
                                                    outstandingAmount: '',
                                                    overdueAmount: '',
                                                    overdueSince: ''
                                                });
                                            }}
                                        >
                                            <span className="bi bi-x"></span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className={`form-control ${loanErrors.bankName ? 'is-invalid' : ''}`}
                                                            id="bankName"
                                                            placeholder=""
                                                            name="bankName"
                                                            value={newLoan.bankName}
                                                            onChange={handleLoanChange}
                                                            onBlur={e => {
                                                                setLoanErrors(prev => ({
                                                                    ...prev,
                                                                    bankName: validateLoan({ ...newLoan, bankName: e.target.value }).bankName
                                                                }));
                                                            }}
                                                        />
                                                        <label htmlFor="bankName">Bank/Fi Name</label>
                                                        {loanErrors.bankName && <div className="invalid-feedback">{loanErrors.bankName}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form-floating mb-3">
                                                        <select
                                                            className={`form-select ${loanErrors.natureOfLoan ? 'is-invalid' : ''}`}
                                                            id="natureOfLoan"
                                                            name="natureOfLoan"
                                                            value={newLoan.natureOfLoan || ""}
                                                            onChange={handleLoanChange}
                                                            onBlur={e => {
                                                                setLoanErrors(prev => ({
                                                                    ...prev,
                                                                    natureOfLoan: validateLoan({ ...newLoan, natureOfLoan: e.target.value }).natureOfLoan
                                                                }));
                                                            }}
                                                        >
                                                            <option value="">Select Nature of Loan</option>
                                                            <option value="Short-term Loans">Short-term Loans</option>
                                                            <option value="Medium-term Loans">Medium-term Loans</option>
                                                            <option value="Long-term Loans">Long-term Loans</option>
                                                        </select>
                                                        <label htmlFor="natureOfLoan">Nature of Loan</label>
                                                        {loanErrors.natureOfLoan && <div className="invalid-feedback">{loanErrors.natureOfLoan}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={`form-control ${loanErrors.limitSanctioned ? 'is-invalid' : ''}`}
                                                            id="limitSanctioned"
                                                            placeholder=""
                                                            name="limitSanctioned"
                                                            value={newLoan.limitSanctioned}
                                                            onChange={handleLoanChange}
                                                            onBlur={e => {
                                                                setLoanErrors(prev => ({
                                                                    ...prev,
                                                                    limitSanctioned: validateLoan({ ...newLoan, limitSanctioned: e.target.value }).limitSanctioned
                                                                }));
                                                            }}
                                                        />
                                                        <label htmlFor="limitSanctioned">Limit Sanctioned (In Rs)</label>
                                                        {loanErrors.limitSanctioned && <div className="invalid-feedback">{loanErrors.limitSanctioned}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={`form-control ${loanErrors.outstandingAmount ? 'is-invalid' : ''}`}
                                                            id="outstandingAmount"
                                                            placeholder=""
                                                            name="outstandingAmount"
                                                            value={newLoan.outstandingAmount}
                                                            onChange={handleLoanChange}
                                                            onBlur={e => {
                                                                setLoanErrors(prev => ({
                                                                    ...prev,
                                                                    outstandingAmount: validateLoan({ ...newLoan, outstandingAmount: e.target.value }).outstandingAmount,
                                                                    overdueAmount: validateLoan({ ...newLoan, outstandingAmount: e.target.value, overdueAmount: newLoan.overdueAmount }).overdueAmount // To revalidate overdueAmount if outstanding changes
                                                                }));
                                                            }}
                                                        />
                                                        <label htmlFor="outstandingAmount">Outstanding Amount (In Rs)</label>
                                                        {loanErrors.outstandingAmount && <div className="invalid-feedback">{loanErrors.outstandingAmount}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className={`form-control ${loanErrors.overdueAmount ? 'is-invalid' : ''}`}
                                                            id="overdueAmount"
                                                            placeholder=""
                                                            name="overdueAmount"
                                                            value={newLoan.overdueAmount}
                                                            onChange={handleLoanChange}
                                                            onBlur={e => {
                                                                setLoanErrors(prev => ({
                                                                    ...prev,
                                                                    overdueAmount: validateLoan({ ...newLoan, overdueAmount: e.target.value }).overdueAmount
                                                                }));
                                                            }}
                                                        />
                                                        <label htmlFor="overdueAmount">Overdue Amount (In Rs)</label>
                                                        {loanErrors.overdueAmount && <div className="invalid-feedback">{loanErrors.overdueAmount}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="date"
                                                            className={`form-control ${loanErrors.overdueSince ? 'is-invalid' : ''}`}
                                                            id="overdueSince"
                                                            placeholder=""
                                                            name="overdueSince"
                                                            value={newLoan.overdueSince}
                                                            onChange={handleLoanChange}
                                                            max={new Date().toISOString().split('T')[0]}
                                                            onBlur={e => {
                                                                setLoanErrors(prev => ({
                                                                    ...prev,
                                                                    overdueSince: validateLoan({ ...newLoan, overdueSince: e.target.value }).overdueSince
                                                                }));
                                                            }}
                                                        />
                                                        <label htmlFor="overdueSince">Overdue Since (Date)</label>
                                                        {loanErrors.overdueSince && <div className="invalid-feedback">{loanErrors.overdueSince}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-2"
                                                onClick={() => {
                                                    setShowLoanModal(false);
                                                    setEditingLoanIndex(null);
                                                    setNewLoan({
                                                        bankName: '',
                                                        limitSanctioned: '',
                                                        outstandingAmount: '',
                                                        overdueAmount: '',
                                                        overdueSince: ''
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={addLoan}
                                            >
                                                {editingLoanIndex !== null ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </fieldset>
    );
};

export default PreliminaryAssessment;