// formTransform.js
export const transformFormDataForApi = (formData) => {
  return {
    enterpriseName: formData.nameEnterprise,
    promoterName: formData.namePromoter,
    constitution: formData.constitution,
    productionDate: formData.dateProduction,
    udyamRegNumber: formData.udyamRegistration,
    contactNumber: formData.primaryContactNumber, // From localStorage
    alternateContactNumber: formData.contactDetails, // Optional alternative number
    state: formData.state,
    industrialPark: formData.industrialPark,
    district: formData.district,
    mandal: formData.mandal,
    address: formData.address,
    email: formData.email,
    enterpriseCategory: formData.enterpriseCategory,
    natureOfActivity: formData.natureActivity,
    sector: formData.sector,
    operationStatus: formData.operationalStatus === 'yes',
    operatingSatisfactorily: formData.operatingSatisfactorily,
    operatingDifficulties: formData.operatingDifficulties,
    reasonForNotOperating: formData.notOperatingReasons,
    restartIntent: formData.restartIntention === 'yes',
    restartSupport: formData.restartSupport,
    existingCredit: formData.creditFacilities.length > 0,
    creditFacilityDetails: formData.creditFacilities,
    requiredCreditLimit: formData.creditRequirements,
    investmentSubsidy: formData.investmentSubsidy === 'yes',
    totalAmountSanctioned: formData.subsidyAmountSanctioned,
    amountReleased: formData.subsidyAmountReleased,
    amountToBeReleased: formData.subsidyAmountToBeReleased,
    maintainingAccountBy: formData.accountsMaintenance,
    helpMsg: formData.comments
  };
};