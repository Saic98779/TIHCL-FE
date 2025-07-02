import React, { useState } from 'react';

const UnitVisit = ({ formData, updateFormData, nextStep, prevStep }) => {
  console.log("formData", formData)
  const [visitData, setVisitData] = useState({
    visitedBy: formData.visitedBy || '',
    visitDate: formData.visitDate || '',
    visitTime: formData.visitTime || '',
    personMetName: formData.personMetName || '',
    personMetDesignation: formData.personMetDesignation || '',
    landDetails: formData.landDetails || '',
    factoryAddress: formData.factoryAddress || '',
    registerAddress: formData.registerAddress || '',
    sameAsFactory: formData.sameAsFactory || false,
    machinery: formData.machinery || [{
      type: '',
      purpose: '',
      count: '',
      cost: '',
      condition: '',
      value: ''
    }],
    upgradationRequired: formData.upgradationRequired || false,
    machineryAligned: formData.machineryAligned || false,
    companyNameBoard: formData.companyNameBoard || '',
    bankNameBoard: formData.bankNameBoard || '',
    officeStaff: formData.officeStaff || '',
    factoryWorkers: formData.factoryWorkers || '',
    temporaryWorkers: formData.temporaryWorkers || '',
    attendanceRegister: formData.attendanceRegister || '',
    inconsistencies: formData.inconsistencies || '',
    productsSold: formData.productsSold || '',
    productionSeasonal: formData.productionSeasonal || '',
    shifts: formData.shifts || '',
    stocksStored: formData.stocksStored || '',
    storageCapacity: formData.storageCapacity || '',
    stocksRegister: formData.stocksRegister || '',
    stocksUpToDate: formData.stocksUpToDate || '',
    stockValue: formData.stockValue || '',
    rawMaterial: formData.rawMaterial || '',
    workInProgress: formData.workInProgress || '',
    finishedGoods: formData.finishedGoods || '',
    maxProduction: formData.maxProduction || '',
    minProduction: formData.minProduction || '',
    currentProduction: formData.currentProduction || '',
    costPerUnit: formData.costPerUnit || '',
    sellingPrice: formData.sellingPrice || '',
    profitMargin: formData.profitMargin || '',
    recentConsumption: formData.recentConsumption || '',
    maxConsumption: formData.maxConsumption || ''
  });
   console.log(visitData)
  const [showMachineryModal, setShowMachineryModal] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    type: '',
    purpose: '',
    count: '',
    cost: '',
    condition: '',
    value: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVisitData({
      ...visitData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMachineryChange = (e) => {
    const { name, value } = e.target;
    setNewMachinery({
      ...newMachinery,
      [name]: value
    });
  };

  const addMachinery = () => {
    setVisitData({
      ...visitData,
      machinery: [...visitData.machinery, newMachinery]
    });
    setNewMachinery({
      type: '',
      purpose: '',
      count: '',
      cost: '',
      condition: '',
      value: ''
    });
    setShowMachineryModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(visitData);
    nextStep();
  };

  return (
    <fieldset>
      <div className="card border rounded-2 shadow-none mb-3">
        <div className="card-header bg-theme text-white">
          <h6 className="mb-0">Unit Visit</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="visitedInput" placeholder=""
                  name="visitedBy" value={visitData.visitedBy} onChange={handleChange} />
                <label htmlFor="visitedInput">Visited by</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3">
                <input type="date" className="form-control" id="visitDate" placeholder=""
                  name="visitDate" value={visitData.visitDate} onChange={handleChange} />
                <label htmlFor="visitDate">Visit Date</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3">
                <input type="time" className="form-control" id="visitTime" placeholder=""
                  name="visitTime" value={visitData.visitTime} onChange={handleChange} />
                <label htmlFor="visitTime">Visit Time</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="personMetName" placeholder=""
                  name="personMetName" value={visitData.personMetName} onChange={handleChange} />
                <label htmlFor="personMetName">Name of the person met</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="personMetDesignation" placeholder=""
                  name="personMetDesignation" value={visitData.personMetDesignation} onChange={handleChange} />
                <label htmlFor="personMetDesignation">Designation</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3">
                <select className="form-select" id="floatingSelect" aria-label="Floating label select example"
                  name="landDetails" value={visitData.landDetails} onChange={handleChange}>
                  <option value="">Select Land Details</option>
                  <option value="Owned">Owned</option>
                  <option value="Leased">Leased</option>
                  <option value="Other">Other</option>
                </select>
                <label htmlFor="floatingSelect">Land Details</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3 mb-lg-0">
                <input type="text" className="form-control" id="factoryAddress" placeholder=""
                  name="factoryAddress" value={visitData.factoryAddress} onChange={handleChange} />
                <label htmlFor="factoryAddress">Factory Address</label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-check mt-4">
                <input className="form-check-input" type="checkbox" id="flexCheckDefault"
                  name="sameAsFactory" checked={visitData.sameAsFactory} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="flexCheckDefault">
                  Same as factory address
                </label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3">
              <div className="form-floating mb-3 mb-lg-0">
                <input type="text" className="form-control" id="registerAddress" placeholder=""
                  name="registerAddress" value={visitData.registerAddress} onChange={handleChange} />
                <label htmlFor="registerAddress">Register Address</label>
              </div>
            </div>
          </div>

          <hr />

          {/* Machinery Section Header and Table */}
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-600">Factory Shed & Building Details</h6>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowMachineryModal(true)}>
                <span className="bi bi-plus-lg"></span> Add
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered fs-md">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Types of machine</th>
                    <th>Purpose</th>
                    <th>No. of machines</th>
                    <th>Cost of machine purchased</th>
                    <th>Current condition</th>
                    <th>Value of machinery</th>
                  </tr>
                </thead>
                <tbody>
                  {visitData.machinery.map((machine, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{machine.type}</td>
                      <td>{machine.purpose}</td>
                      <td>{machine.count}</td>
                      <td>{machine.cost}</td>
                      <td>{machine.condition}</td>
                      <td>{machine.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="upgradation"
                    name="upgradationRequired" checked={visitData.upgradationRequired} onChange={handleChange} />
                  <label className="form-check-label fs-md" htmlFor="upgradation">
                    Is upgradation required?
                  </label>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="aligned"
                    name="machineryAligned" checked={visitData.machineryAligned} onChange={handleChange} />
                  <label className="form-check-label fs-md" htmlFor="aligned">
                    Is machinery properly aligned?
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* Company & Bank Name Board Section */}
          <div className="row mb-3">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="fw-600 fs-md">Company Name Board</h6>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="companyNameBoard" id="boardYes" value="yes"
                  checked={visitData.companyNameBoard === 'yes'} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="boardYes">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="companyNameBoard" id="boardNo" value="no"
                  checked={visitData.companyNameBoard === 'no'} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="boardNo">No</label>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="fw-600 fs-md">Financed Bank Name Board</h6>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="bankNameBoard" id="bankYes" value="yes"
                  checked={visitData.bankNameBoard === 'yes'} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="bankYes">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="bankNameBoard" id="bankNo" value="no"
                  checked={visitData.bankNameBoard === 'no'} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="bankNo">No</label>
              </div>
            </div>
          </div>
          <hr />

          <div>
            <h6 className="fs-md">Staff at the time of Visit</h6>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="officeStaff" placeholder=""
                    name="officeStaff" value={visitData.officeStaff} onChange={handleChange} />
                  <label htmlFor="officeStaff">Office Staff</label>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="factoryWorkers" placeholder=""
                    name="factoryWorkers" value={visitData.factoryWorkers} onChange={handleChange} />
                  <label htmlFor="factoryWorkers">Factory Workers</label>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="temporaryWorkers" placeholder=""
                    name="temporaryWorkers" value={visitData.temporaryWorkers} onChange={handleChange} />
                  <label htmlFor="temporaryWorkers">Temporary Workers</label>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <label className="d-block fw-600 fs-md">Employees Attendance Register</label>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="attendanceRegister" id="registerYes" value="yes"
                  checked={visitData.attendanceRegister === 'yes'} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="registerYes">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="attendanceRegister" id="registerNo" value="no"
                  checked={visitData.attendanceRegister === 'no'} onChange={handleChange} />
                <label className="form-check-label fs-md" htmlFor="registerNo">No</label>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="inconsistencies" placeholder=""
                  name="inconsistencies" value={visitData.inconsistencies} onChange={handleChange} />
                <label htmlFor="inconsistencies">Inconsistencies in staff count</label>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="productsSold" placeholder=""
                  name="productsSold" value={visitData.productsSold} onChange={handleChange} />
                <label htmlFor="productsSold">Products Manufactured & Sold</label>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="productionSeasonal" placeholder=""
                  name="productionSeasonal" value={visitData.productionSeasonal} onChange={handleChange} />
                <label htmlFor="productionSeasonal">Production cycle (seasonal/year-round)</label>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="shifts" placeholder=""
                  name="shifts" value={visitData.shifts} onChange={handleChange} />
                <label htmlFor="shifts">Number of Shifts</label>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
            <h6 className="fw-600 fs-md">Are stocks stored properly?</h6>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="stocksStored" id="stocksYes" value="yes"
                checked={visitData.stocksStored === 'yes'} onChange={handleChange} />
              <label className="form-check-label fs-md" htmlFor="stocksYes">Yes</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="stocksStored" id="stocksNo" value="no"
                checked={visitData.stocksStored === 'no'} onChange={handleChange} />
              <label className="form-check-label fs-md" htmlFor="stocksNo">No</label>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
            <h6 className="fw-600 fs-md">Does unit have adequate storage capacity?</h6>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="storageCapacity" id="capacityYes" value="yes"
                checked={visitData.storageCapacity === 'yes'} onChange={handleChange} />
              <label className="form-check-label fs-md" htmlFor="capacityYes">Yes</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="storageCapacity" id="capacityNo" value="no"
                checked={visitData.storageCapacity === 'no'} onChange={handleChange} />
              <label className="form-check-label fs-md" htmlFor="capacityNo">No</label>
            </div>
          </div>

          <hr />

          <div>
            <label className="fs-md fw-600">Stocks Record</label>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="stocksRegister" placeholder=""
                    name="stocksRegister" value={visitData.stocksRegister} onChange={handleChange} />
                  <label htmlFor="stocksRegister">Is stock register maintained?</label>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="stocksUpToDate" placeholder=""
                    name="stocksUpToDate" value={visitData.stocksUpToDate} onChange={handleChange} />
                  <label htmlFor="stocksUpToDate">Is it up to date?</label>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="stockValue" placeholder=""
                    name="stockValue" value={visitData.stockValue} onChange={handleChange} />
                  <label htmlFor="stockValue">Stock Value (Rs)</label>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="rawMaterial" placeholder=""
                    name="rawMaterial" value={visitData.rawMaterial} onChange={handleChange} />
                  <label htmlFor="rawMaterial">Raw Material</label>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="workInProgress" placeholder=""
                    name="workInProgress" value={visitData.workInProgress} onChange={handleChange} />
                  <label htmlFor="workInProgress">Work in Progress</label>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="finishedGoods" placeholder=""
                    name="finishedGoods" value={visitData.finishedGoods} onChange={handleChange} />
                  <label htmlFor="finishedGoods">Finished Goods</label>
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="maxProduction" placeholder=""
                  name="maxProduction" value={visitData.maxProduction} onChange={handleChange} />
                <label htmlFor="maxProduction">Maximum production in units</label>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="minProduction" placeholder=""
                  name="minProduction" value={visitData.minProduction} onChange={handleChange} />
                <label htmlFor="minProduction">Minimum production in units</label>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="currentProduction" placeholder=""
                  name="currentProduction" value={visitData.currentProduction} onChange={handleChange} />
                <label htmlFor="currentProduction">Current production in units</label>
              </div>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="costPerUnit" placeholder=""
                  name="costPerUnit" value={visitData.costPerUnit} onChange={handleChange} />
                <label htmlFor="costPerUnit">Cost per unit</label>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="sellingPrice" placeholder=""
                  name="sellingPrice" value={visitData.sellingPrice} onChange={handleChange} />
                <label htmlFor="sellingPrice">Selling price per unit</label>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="profitMargin" placeholder=""
                  name="profitMargin" value={visitData.profitMargin} onChange={handleChange} />
                <label htmlFor="profitMargin">Profit margin (%)</label>
              </div>
            </div>
          </div>

          <hr />

          <h6 className="fs-md fw-600">Electricity Bill</h6>
          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="recentConsumption" placeholder=""
                  name="recentConsumption" value={visitData.recentConsumption} onChange={handleChange} />
                <label htmlFor="recentConsumption">Recent Consumption</label>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="maxConsumption" placeholder=""
                  name="maxConsumption" value={visitData.maxConsumption} onChange={handleChange} />
                <label htmlFor="maxConsumption">Maximum Consumption</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input type="button" name="previous" className="previous btn btn-secondary float-start" value="Previous" onClick={prevStep} />
      <input type="button" name="next" className="next btn btn-primary float-end" value="Next" onClick={handleSubmit} />

      {/* Machinery Modal */}
      {showMachineryModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header py-2 bg-theme text-white">
                <h6 className="modal-title">Add Machinery</h6>
                <button type="button" className="btn-close text-white fs-4 p-0" onClick={() => setShowMachineryModal(false)}>
                  <span className="bi bi-x"></span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    {['type', 'purpose', 'count', 'cost', 'condition', 'value'].map((field, i) => (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6" key={i}>
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control" id={field} placeholder=""
                            name={field} value={newMachinery[field]} onChange={handleMachineryChange} />
                          <label htmlFor={field}>
                            {field === 'type' ? 'Types of machine' :
                              field === 'count' ? 'No. of machines' :
                              field === 'cost' ? 'Cost of machine purchased' :
                              field === 'condition' ? 'Current condition' :
                              field === 'value' ? 'Value of machinery' :
                              'Purpose'}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
                <div className="text-end">
                  <button type="button" className="btn btn-primary" onClick={addMachinery}>Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
};

export default UnitVisit;
