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
            : 'appication can notbe cosider';
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




export const transformRegistrationData = (formData) => {
  return {
    enterpriseName: formData.nameEnterprise,
    promoterName: formData.namePromoter,
    constitution: formData.constitution,
    commencementDate: formData.dateProduction,
    udyamNumber: formData.udyamRegistration,
    contactNumber: formData.contactDetails,
    email: formData.email,
    state: formData.state,
    district: formData.district, // Now directly using the name
    mandal: formData.mandal,     // Now directly using the name
    address: formData.address,
    industrialPark: formData.industrialPark,
    applicationStatus: "APPLICATION_SUBMITTED"
  };
};