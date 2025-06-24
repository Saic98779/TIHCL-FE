import React, { useState } from 'react';
import PreliminaryAssessment from '../Components/Status/PreliminaryAssessment';
 import ManagerApproval1 from '../Components/Status/ManagerApproval1';
import UnitVisit from '../Components/Status/UnitVisit';
 import DiagnosticReport from '../Components/Status/DiagnosticReport';
 import Header from '../Components/Status/StatusHeader';
// import ManagerApproval2 from './ManagerApproval2';
// import DICConcernLetter from './DICConcernLetter';
// import RampChecklist from './RampChecklist';
// import PrimaryLenderNOC from './PrimaryLenderNOC';
// import SanctionedDetails from './SanctionedDetails';
// import ManagerApproval3 from './ManagerApproval3';
// import DisbursementDetails from './DisbursementDetails';

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
  // Basic information
  nameOfFirm: '',
  promoterName: '',
  constitution: '',
  udyamNumber: '',
  contactNumber: '',
  email: '',
  sizeOfUnit: '',
  natureOfActivity: '',
  sector: '',
  
  // Location information
  factoryLocation: {
    industrialPark: '',
    state: '',
    district: '',
    mandal: '',
    address: ''
  },
  
  // Operation status
  operationStatus: true,
  operatingSatisfactorily: '',
  operatingDifficulties: '',
  issueDate: '',
  reasonForNotOperating: '',
  restartSupport: '',
  restartIntent: true,
  
  // Financial information
  loansCreditFacilities: 'No',
  loans: [],
  requiredCreditLimit: 0,
  investmentSubsidy: false,
  totalAmountSanctioned: 0,
  amountReleased: 0,
  amountToBeReleased: 0,
  maintainingAccountBy: '',
  
  // Product information
  gstNumber: '',
  productType: '',
  productUsage: '',
  problems: '',
  solutions: '',
  
  // Assessment fields
  stressScore: '0',
  observations: '',
  statusUpdate: ''
});
  
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  
  const updateFormData = (newData) => {
    setFormData({...formData, ...newData});
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <PreliminaryAssessment formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2: return <ManagerApproval1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3: return <UnitVisit formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4: return <DiagnosticReport formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5: return <ManagerApproval2 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6: return <DICConcernLetter formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 7: return <RampChecklist formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 8: return <PrimaryLenderNOC formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 9: return <SanctionedDetails formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 10: return <ManagerApproval3 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 11: return <DisbursementDetails formData={formData} updateFormData={updateFormData} prevStep={prevStep} />;
      default: return <PreliminaryAssessment formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  return (
  <>
   <Header / >
  <div className="container-fluid pt-80">
      <section className="pt-3">
        <div className="container-fluid">
          <div className="card mb-3">
            <div className="card-header bg-theme text-white">
              <h6 className="mb-0">Status</h6>
            </div>
            <div className="card-body">   
              <div>
                <ul id="progressbar" className="ps-0">
                  <li className={currentStep >= 1 ? "active" : ""} style={{textAlign:"center"}}>Preliminary Assessment</li>
                  <li className={currentStep >= 2 ? "active" : ""} style={{textAlign:"center"}}>Manager Approval 1</li>
                  <li className={currentStep >= 3 ? "active" : ""} style={{textAlign:"center"}}>Unit Visit</li>
                  <li className={currentStep >= 4 ? "active" : ""} style={{textAlign:"center"}}>Diagnostic Report</li>
                  <li className={currentStep >= 5 ? "active" : ""} style={{textAlign:"center"}}>Manager Approval 2</li>
                  <li className={currentStep >= 6 ? "active" : ""} style={{textAlign:"center"}}>DIC Concern Letter</li>
                  <li className={currentStep >= 7 ? "active" : ""} style={{textAlign:"center"}}>Ramp Checklist & Credit Apprasial Upload</li>
                  <li className={currentStep >= 8 ? "active" : ""} style={{textAlign:"center"}}>Primary Lender NOC</li>
                  <li className={currentStep >= 9 ? "active" : ""} style={{textAlign:"center"}}>Sanctioned Details & Upload Of Sanctioned Letter</li>
                  <li className={currentStep >= 10 ? "active" : ""} style={{textAlign:"center"}}>Manager Approval 3</li>
                  <li className={currentStep >= 11 ? "active" : ""} style={{textAlign:"center"}}>Disbursement Details</li>
                </ul>
                
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>
    
  );
};

export default FormWizard;