// import React, { useState } from 'react';
// import PreliminaryAssessment from '../Components/Status/PreliminaryAssessment';
//  import ManagerApproval1 from '../Components/Status/ManagerApproval1';
// import UnitVisit from '../Components/Status/UnitVisit';
// import DiagnosticReport from '../Components/Status/DiagnosticReport';
// import Header from "../Components/ExecutiveHeader/Header";

// // import ManagerApproval2 from './ManagerApproval2';
// // import DICConcernLetter from './DICConcernLetter';
// // import RampChecklist from './RampChecklist';
// // import PrimaryLenderNOC from './PrimaryLenderNOC';
// // import SanctionedDetails from './SanctionedDetails';
// // import ManagerApproval3 from './ManagerApproval3';
// // import DisbursementDetails from './DisbursementDetails';

// const FormWizard = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//   // Basic information
//   nameOfFirm: '',
//   promoterName: '',
//   constitution: '',
//   udyamNumber: '',
//   contactNumber: '',
//   email: '',
//   sizeOfUnit: '',
//   natureOfActivity: '',
//   sector: '',
  
//   // Location information
//   factoryLocation: {
//     industrialPark: '',
//     state: '',
//     district: '',
//     mandal: '',
//     address: ''
//   },
  
//   // Operation status
//   operationStatus: true,
//   operatingSatisfactorily: '',
//   operatingDifficulties: '',
//   issueDate: '',
//   reasonForNotOperating: '',
//   restartSupport: '',
//   restartIntent: true,
  
//   // Financial information
//   loansCreditFacilities: 'No',
//   loans: [],
//   requiredCreditLimit: 0,
//   investmentSubsidy: false,
//   totalAmountSanctioned: 0,
//   amountReleased: 0,
//   amountToBeReleased: 0,
//   maintainingAccountBy: '',
  
//   // Product information
//   gstNumber: '',
//   productType: '',
//   productUsage: '',
//   problems: '',
//   solutions: '',
  
//   // Assessment fields
//   stressScore: '0',
//   observations: '',
//   statusUpdate: ''
// });
  
//   const nextStep = () => setCurrentStep(currentStep + 1);
//   const prevStep = () => setCurrentStep(currentStep - 1);
  
//   const updateFormData = (newData) => {
//     setFormData({...formData, ...newData});
//   };

//   const renderStep = () => {
//     switch(currentStep) {
//       case 1: return <PreliminaryAssessment formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
//       case 2: return <ManagerApproval1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 3: return <UnitVisit formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 4: return <DiagnosticReport formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 5: return <ManagerApproval2 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 6: return <DICConcernLetter formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 7: return <RampChecklist formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 8: return <PrimaryLenderNOC formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 9: return <SanctionedDetails formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 10: return <ManagerApproval3 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
//       case 11: return <DisbursementDetails formData={formData} updateFormData={updateFormData} prevStep={prevStep} />;
//       default: return <PreliminaryAssessment formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
//     }
//   };

//   return (
//   <>
//    <Header className="mb-1"/>
//   <div className="container-fluid">
//       <section className="pt-0">
//         <div className="container-fluid">
//           <div className="card mb-3">
//             <div className="card-header bg-theme text-white">
//               <h6 className="mb-0">Status</h6>
//             </div>
//             <div className="card-body">   
//               <div>
//                 <ul id="progressbar" className="ps-0">
//                   <li className={currentStep >= 1 ? "active" : ""} style={{textAlign:"center"}}>Preliminary Assessment</li>
//                   <li className={currentStep >= 2 ? "active" : ""} style={{textAlign:"center"}}>Manager Approval 1</li>
//                   <li className={currentStep >= 3 ? "active" : ""} style={{textAlign:"center"}}>Unit Visit</li>
//                   <li className={currentStep >= 4 ? "active" : ""} style={{textAlign:"center"}}>Diagnostic Report</li>
//                   <li className={currentStep >= 5 ? "active" : ""} style={{textAlign:"center"}}>Manager Approval 2</li>
//                   <li className={currentStep >= 6 ? "active" : ""} style={{textAlign:"center"}}>DIC Concern Letter</li>
//                   <li className={currentStep >= 7 ? "active" : ""} style={{textAlign:"center"}}>Ramp Checklist & Credit Apprasial Upload</li>
//                   <li className={currentStep >= 8 ? "active" : ""} style={{textAlign:"center"}}>Primary Lender NOC</li>
//                   <li className={currentStep >= 9 ? "active" : ""} style={{textAlign:"center"}}>Sanctioned Details & Upload Of Sanctioned Letter</li>
//                   <li className={currentStep >= 10 ? "active" : ""} style={{textAlign:"center"}}>Manager Approval 3</li>
//                   <li className={currentStep >= 11 ? "active" : ""} style={{textAlign:"center"}}>Disbursement Details</li>
//                 </ul>
                
//                 {renderStep()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   </>
    
//   );
// };

// export default FormWizard;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import PreliminaryAssessment from '../Components/Status/PreliminaryAssessment';
import ManagerApproval1 from '../Components/Status/ManagerApproval1';
import UnitVisit from '../Components/Status/UnitVisit';
import DiagnosticReport from '../Components/Status/DiagnosticReport';
import Header from "../Components/ExecutiveHeader/Header";

// Import remaining steps as needed
// import ManagerApproval2 from './ManagerApproval2';
// import DICConcernLetter from './DICConcernLetter';
// import RampChecklist from './RampChecklist';
// import PrimaryLenderNOC from './PrimaryLenderNOC';
// import SanctionedDetails from './SanctionedDetails';
// import ManagerApproval3 from './ManagerApproval3';
// import DisbursementDetails from './DisbursementDetails';

const statusToStepMap = {
  "preliminary_assessment": 1,
  "manager_approval_1": 2,
  "unit_visit": 3,
  "diagnostic_report": 4,
  "manager_approval_2": 5,
  "dic_concern_letter": 6,
  "ramp_checklist": 7,
  "primary_lender_noc": 8,
  "sanctioned_details": 9,
  "manager_approval_3": 10,
  "disbursement_details": 11,
};

const FormWizard = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const statusParam = queryParams.get("Status");

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (statusParam) {
      const step = statusToStepMap[statusParam.toLowerCase()];
      if (step) setCurrentStep(step+1);
    }
  }, [statusParam]);

  const [formData, setFormData] = useState({
    nameOfFirm: '', promoterName: '', constitution: '', udyamNumber: '', contactNumber: '', email: '', sizeOfUnit: '', natureOfActivity: '', sector: '',
    factoryLocation: { industrialPark: '', state: '', district: '', mandal: '', address: '' },
    operationStatus: true, operatingSatisfactorily: '', operatingDifficulties: '', issueDate: '', reasonForNotOperating: '', restartSupport: '', restartIntent: true,
    loansCreditFacilities: 'No', loans: [], requiredCreditLimit: 0, investmentSubsidy: false,
    totalAmountSanctioned: 0, amountReleased: 0, amountToBeReleased: 0, maintainingAccountBy: '',
    gstNumber: '', productType: '', productUsage: '', problems: '', solutions: '',
    stressScore: '0', observations: '', statusUpdate: ''
  });

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const updateFormData = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PreliminaryAssessment formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2: return <ManagerApproval1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3: return <UnitVisit formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4: return <DiagnosticReport formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      // Continue other steps similarly...
      default: return <PreliminaryAssessment formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  return (
    <>
      <Header className="mb-1" />
      <div className="container-fluid">
        <section className="pt-0">
          <div className="container-fluid">
            <div className="card mb-3">
              <div className="card-header bg-theme text-white">
                <h6 className="mb-0">Status</h6>
              </div>
              <div className="card-body">
                <div>
                  <ul id="progressbar" className="ps-0">
                    <li className={currentStep >= 1 ? "active" : ""} style={{ textAlign: "center" }}>Preliminary Assessment</li>
                    <li className={currentStep >= 2 ? "active" : ""} style={{ textAlign: "center" }}>Manager Approval 1</li>
                    <li className={currentStep >= 3 ? "active" : ""} style={{ textAlign: "center" }}>Unit Visit</li>
                    <li className={currentStep >= 4 ? "active" : ""} style={{ textAlign: "center" }}>Diagnostic Report</li>
                    <li className={currentStep >= 5 ? "active" : ""} style={{ textAlign: "center" }}>Manager Approval 2</li>
                    <li className={currentStep >= 6 ? "active" : ""} style={{ textAlign: "center" }}>DIC Concern Letter</li>
                    <li className={currentStep >= 7 ? "active" : ""} style={{ textAlign: "center" }}>Ramp Checklist & Credit Appraisal</li>
                    <li className={currentStep >= 8 ? "active" : ""} style={{ textAlign: "center" }}>Primary Lender NOC</li>
                    <li className={currentStep >= 9 ? "active" : ""} style={{ textAlign: "center" }}>Sanctioned Details</li>
                    <li className={currentStep >= 10 ? "active" : ""} style={{ textAlign: "center" }}>Manager Approval 3</li>
                    <li className={currentStep >= 11 ? "active" : ""} style={{ textAlign: "center" }}>Disbursement Details</li>
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
