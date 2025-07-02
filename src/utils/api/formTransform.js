export const transformFormDataForApi = (formData, riskCategories) => {
    // Transform risk categories
    const transformRiskCategories = () => {
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

        return (riskCategories || [])
            .map((category, index) => {
                if (!category || category === "5") return null;
                
                let riskCategoryText;
                switch(category) {
                    case "1": riskCategoryText = "Low"; break;
                    case "2": riskCategoryText = "Moderate"; break;
                    case "3": riskCategoryText = "High"; break;
                    case "4": riskCategoryText = "Critical"; break;
                    default: riskCategoryText = "Unknown";
                }
                
                return {
                    issue: riskQuestions[index] || `Risk Issue ${index + 1}`,
                    riskCategorisation: riskCategoryText
                };
            })
            .filter(Boolean);
    };

    // Transform loans data
    const transformLoans = () => {
        if (formData.loansCreditFacilities === 'No') return [];
        
        return (formData.loans || [])
            .filter(loan => loan.bankName && loan.bankName.trim() !== "")
            .map(loan => ({
                bankName: loan.bankName || "",
                limitSanctioned: parseFloat(loan.limitSanctioned) || 0.0,
                outstandingAmount: parseFloat(loan.outstandingAmount) || 0.0,
                overdueAmount: parseFloat(loan.overdueAmount) || 0.0,
                overdueDate: loan.overdueSince || ""
            }));
    };

    // Calculate risk score (assuming formData.stressScore is like "55%")
    const calculateRiskScore = () => {
        if (!formData.stressScore) return 0.0;
        const score = parseFloat(formData.stressScore.replace('%', ''));
        return isNaN(score) ? 0.0 : score;
    };

    // Determine status text (note the exact spelling from API)
    const getStatusText = () => {
        return formData.statusUpdate === 'consider' 
            ? 'application can be consider' 
            : 'appication can not be cosider';
    };

    return {
        executive: "sai", // Replace with dynamic value if available
        enterpriseName: formData.nameOfFirm || "",
        udyamRegNumber: formData.udyamNumber || "",
        district: formData.factoryLocation?.district || "",
        mandal: formData.factoryLocation?.mandal || "",
        address: formData.factoryLocation?.address || "",
        enterpriseCategory: formData.sizeOfUnit || "",
        natureOfActivity: formData.natureOfActivity || "",
        existingCredit: formData.loansCreditFacilities === 'Yes',
        creditFacilityDetails: transformLoans(),
        gstNumber: formData.gstNumber || "",
        typeOfProduct: formData.productType || "",
        productUsage: formData.productUsage || "",
        problemsFaced: formData.problems || "",
        expectedSolution: formData.solutions || "",
        riskCategories: transformRiskCategories(),
        riskCategoryScore: calculateRiskScore(),
        observations: formData.observations || "",
        status: getStatusText(),
        applicationStatus: "PRELIMINARY_ASSESSMENT"
    };
};




export const transformRegistrationData = (formData, districts, mandals) => {
  // Find district and mandal names from IDs
  const districtObj = districts.find(d => d.districtId == formData.district); // Use loose equality
  const mandalObj = mandals.find(m => m.mandalId == formData.mandal); // Use loose equality
  
  // Calculate financial amounts
  const totalAmountSanctioned = parseInt(formData.subsidyAmountSanctioned) || 0;
  const amountReleased = parseInt(formData.subsidyAmountReleased) || 0;
  const amountToBeReleased = Math.max(0, totalAmountSanctioned - amountReleased);
  const requiredCreditLimit = parseInt(formData.creditRequirements) || 0;

  // Contact numbers
  const contactNumber = parseInt(localStorage.getItem('primaryContactNumber')) || 0;
  const altContactNumber = formData.contactDetails ? parseInt(formData.contactDetails) : undefined;

  // Handle operatingDifficulties as array
  let operatingDifficultiesArray = [];
  if (formData.operatingDifficulties) {
    operatingDifficultiesArray = Array.isArray(formData.operatingDifficulties) 
      ? formData.operatingDifficulties 
      : formData.operatingDifficulties.split(', ');
  }

  return {
    enterpriseName: formData.nameEnterprise || '',
    promoterName: formData.namePromoter || '',
    constitution: formData.constitution || '',
    productionDate: formData.dateProduction || '',
    udyamRegNumber: formData.udyamRegistration || '',
    contactNumber: contactNumber,
    ...(altContactNumber && { altContactNumber }),
    industrialPark: formData.industrialPark || '',
    state: formData.state || 'Telangana',
    district: districtObj?.districtName || formData.district || '',
    mandal: mandalObj?.mandalName || formData.mandal || '',
    email: formData.email || '',
    address: formData.address || '',
    enterpriseCategory: formData.enterpriseCategory || '',
    natureOfActivity: formData.natureActivity || '',
    sector: formData.sector || '',
    operationStatus: formData.operationalStatus === 'operationalYes',
    operatingSatisfactorily: formData.operationalStatus === 'operationalYes' 
      ? formData.operatingSatisfactorily === 'yes' 
      : null,
    operatingDifficulties: operatingDifficultiesArray, // Send as array
    issueDate: formData.operationalStatus === 'operationalNo' ? formData.notOperatingSince : null,
    reasonForNotOperating: formData.notOperatingReasons || '',
    restartSupport: formData.restartSupport || '',
    restartIntent: formData.restartIntention === 'restartYes',
    existingCredit: formData.hasCreditFacilities === 'yes',
    creditFacilityDetails: formData.creditFacilities?.map(facility => ({
      bankName: facility.bankName || '',
      limitSanctioned: parseInt(facility.limitSanctioned) || 0,
      outstandingAmount: parseInt(facility.outstandingAmount) || 0,
      overdueAmount: parseInt(facility.overdueAmount) || 0,
      overdueDate: facility.overdueSince || '',
      natureOfLoan: facility.natureOfLoan || '' // Add this line
    })) || [],
    unitStatus: formData.creditStatus || '',
    requiredCreditLimit: requiredCreditLimit,
    investmentSubsidy: formData.investmentSubsidy === 'yes',
    totalAmountSanctioned: totalAmountSanctioned,
    amountReleased: amountReleased,
    amountToBeReleased: amountToBeReleased,
    maintainingAccountBy: formData.accountsMaintenance || '',
    helpMsg: formData.comments || '',
    status: "Assessment Completed"
  };
};