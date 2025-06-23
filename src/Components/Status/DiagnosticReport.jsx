import React, { useState } from 'react';

const DiagnosticReport = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const [reportData, setReportData] = useState({
        name: formData.name || '',
        contactNo: formData.contactNo || '',
        gstNumber: formData.gstNumber || '',
        productManufactured: formData.productManufactured || '',
        demandForProduct: formData.demandForProduct || '',
        shareHolders: formData.shareHolders || [
            { name: 'Holder Name 1', mobile: '9876543210', shares: '10' },
            { name: 'Holder Name 2', mobile: '9876543210', shares: '35' }
        ],
        topBuyers: formData.topBuyers || [
            { name: 'Harshavardhan', qty: '20', amount: '50000', remarks: '-' },
            { name: 'Harshavardhan', qty: '20', amount: '50000', remarks: '-' }
        ],
        topSuppliers: formData.topSuppliers || [
            { name: 'Ravi', qty: '20', amount: '50000', remarks: '-' },
            { name: 'Harshavardhan', qty: '20', amount: '50000', remarks: '-' }
        ],
        receivables: formData.receivables || [
            { from: 'Harshavardhan', date: '23-05-2025', amount: '50000' },
            { from: 'Harshavardhan', date: '23-05-2025', amount: '50000' }
        ],
        payables: formData.payables || [
            { to: 'Ravi', date: '23-05-2025', amount: '180000' },
            { to: 'Ravi', date: '23-05-2025', amount: '180000' }
        ],
        skilledEmployees: formData.skilledEmployees || '',
        unskilledEmployees: formData.unskilledEmployees || '',
        femaleEmployees: formData.femaleEmployees || '',
        installedCapacity: formData.installedCapacity || '',
        utilization: formData.utilization || '',
        observation: formData.observation || '',
        operationalStatus: formData.operationalStatus || '',
        orderBook: formData.orderBook || [
            { date: '23-05-2025', customer: 'Avinash', value: '180000', deliveryDate: '24-05-2025' }
        ],
        unsecuredLoans: formData.unsecuredLoans || 'no',
        loanSources: formData.loanSources || [
            { source: 'ICICI Bank', amount: '200000', since: '28-04-2024', remarks: '-' }
        ],
        loanRequired: formData.loanRequired || '',
        securityForLoan: formData.securityForLoan || '',
        pendingSubsidyType: formData.pendingSubsidyType || '',
        subsidyAmount: formData.subsidyAmount || '',
        securityDescription: formData.securityDescription || '',
        statutoryDues: formData.statutoryDues || 'no',
        statutoryDetails: formData.statutoryDetails || '',
        stressReasons: formData.stressReasons || '',
        balanceSheetData: formData.balanceSheetData || [
            { parameter: 'Total Receipts', y2022: '10', y2023: '90', y2024: '77', y2024Prov: '49' },
            { parameter: 'Total Payments', y2022: '8', y2023: '85', y2024: '70', y2024Prov: '45' }
        ],
        diagnosticObservations: formData.diagnosticObservations || '',
        diagnosticStatus: formData.diagnosticStatus || ''
    });

    const [showShareholderModal, setShowShareholderModal] = useState(false);
    const [newShareholder, setNewShareholder] = useState({
        name: '',
        mobile: '',
        shares: ''
    });

    const [showBuyerModal, setShowBuyerModal] = useState(false);
    const [newBuyer, setNewBuyer] = useState({
        name: '',
        qty: '',
        amount: '',
        remarks: ''
    });

    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        qty: '',
        amount: '',
        remarks: ''
    });

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
        date: '',
        customer: '',
        value: '',
        deliveryDate: ''
    });

    const [showReceivableModal, setShowReceivableModal] = useState(false);
    const [newReceivable, setNewReceivable] = useState({
        from: '',
        date: '',
        amount: ''
    });

    const [showPayableModal, setShowPayableModal] = useState(false);
    const [newPayable, setNewPayable] = useState({
        to: '',
        date: '',
        amount: ''
    });

    const [showLoanModal, setShowLoanModal] = useState(false);
    const [newLoan, setNewLoan] = useState({
        source: '',
        amount: '',
        since: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setReportData({
            ...reportData,
            [name]: type === 'radio' ? value : (type === 'checkbox' ? checked : value)
        });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const addShareholder = () => {
        setReportData({
            ...reportData,
            shareHolders: [...reportData.shareHolders, newShareholder]
        });
        setNewShareholder({ name: '', mobile: '', shares: '' });
        setShowShareholderModal(false);
    };

    const addBuyer = () => {
        setReportData({
            ...reportData,
            topBuyers: [...reportData.topBuyers, newBuyer]
        });
        setNewBuyer({ name: '', qty: '', amount: '', remarks: '' });
        setShowBuyerModal(false);
    };

    const addSupplier = () => {
        setReportData({
            ...reportData,
            topSuppliers: [...reportData.topSuppliers, newSupplier]
        });
        setNewSupplier({ name: '', qty: '', amount: '', remarks: '' });
        setShowSupplierModal(false);
    };

    const addOrder = () => {
        setReportData({
            ...reportData,
            orderBook: [...reportData.orderBook, newOrder]
        });
        setNewOrder({ date: '', customer: '', value: '', deliveryDate: '' });
        setShowOrderModal(false);
    };

    const addReceivable = () => {
        setReportData({
            ...reportData,
            receivables: [...reportData.receivables, newReceivable]
        });
        setNewReceivable({ from: '', date: '', amount: '' });
        setShowReceivableModal(false);
    };

    const addPayable = () => {
        setReportData({
            ...reportData,
            payables: [...reportData.payables, newPayable]
        });
        setNewPayable({ to: '', date: '', amount: '' });
        setShowPayableModal(false);
    };

    const addLoan = () => {
        setReportData({
            ...reportData,
            loanSources: [...reportData.loanSources, newLoan]
        });
        setNewLoan({ source: '', amount: '', since: '', remarks: '' });
        setShowLoanModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateFormData(reportData);
        nextStep();
    };

    return (
        <fieldset>
            <div className="card border rounded-2 shadow-none mb-3">
                <div className="card-header bg-theme text-white">
                    <h6 className="mb-0">Diagnostic Report</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'basic' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('basic')}>Basic Details</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'buyer' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('buyer')}>Top 5 Buyers</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'payable' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('payable')}>Receivables / Payables</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'operational' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('operational')}>Operational Status</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'salesissue' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('salesissue')}>Reasons for Stress</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'balancesheet' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('balancesheet')}>Balance Sheet</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className={`nav-link rounded-0 py-1 fs-md ${activeTab === 'statusupdate' ? 'active' : ''}`}
                                        onClick={() => handleTabChange('statusupdate')}>Status Update</button>
                                </li>
                            </ul>
                            <div className="tab-content mt-2">
                                {activeTab === 'basic' && (
                                    <div className="tab-pane fade show active" id="basic" role="tabpanel">
                                        <div className="p-2">
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="nameInput" placeholder=""
                                                            name="name" value={reportData.name} onChange={handleChange} />
                                                        <label htmlFor="nameInput">Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="contactInput" placeholder=""
                                                            name="contactNo" value={reportData.contactNo} onChange={handleChange} />
                                                        <label htmlFor="contactInput">Contact No.</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="gstInput" placeholder=""
                                                            name="gstNumber" value={reportData.gstNumber} onChange={handleChange} />
                                                        <label htmlFor="gstInput">GST Number</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="productInput" placeholder=""
                                                            name="productManufactured" value={reportData.productManufactured} onChange={handleChange} />
                                                        <label htmlFor="productInput">Product Manufactured</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="demandInput" placeholder=""
                                                            name="demandForProduct" value={reportData.demandForProduct} onChange={handleChange} />
                                                        <label htmlFor="demandInput">Demand For The Product</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border p-2 rounded-3">
                                                <div className="row align-items-center">
                                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                        <label className="fs-md fw-bold mb-1">Shareholding Pattern</label>
                                                    </div>
                                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                        <div className="text-start text-sm-end text-xl-end">
                                                            <button type="button" className="btn btn-outline-primary btn-sm border-0 ms-3" onClick={() => setShowShareholderModal(true)}>
                                                                <span className="bi bi-plus-lg"></span> Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="table-responsive mt-3">
                                                    <table className="table table-striped table-borderless fs-md">
                                                        <thead className="bg-theme text-white">
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Share Holder Name</th>
                                                                <th>Mobile No</th>
                                                                <th>No of Shares / % of Shares</th>
                                                                <th className="text-center">Edit / Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportData.shareHolders.map((holder, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{holder.name}</td>
                                                                    <td>{holder.mobile}</td>
                                                                    <td>{holder.shares}</td>
                                                                    <td className="text-center">
                                                                        <button type="button" className="btn btn-default text-primary btn-sm">
                                                                            <span className="bi bi-pencil"></span>
                                                                        </button>
                                                                        <button type="button" className="btn btn-default text-danger btn-sm">
                                                                            <span className="bi bi-trash"></span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td></td>
                                                                <td></td>
                                                                <td>Total</td>
                                                                <td>{reportData.shareHolders.reduce((sum, holder) => sum + parseInt(holder.shares || 0), 0)}</td>
                                                                <td></td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'buyer' && (
                                    <div className="tab-pane fade show active" id="buyer" role="tabpanel">
                                        <div className="p-2">
                                            <div className="border p-2 rounded-3 mb-3">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <label className="fs-md fw-bold mb-1">Top 5 Buyers</label>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <button type="button" className="btn btn-outline-primary btn-sm border-0" onClick={() => setShowBuyerModal(true)}>
                                                            <span className="bi bi-plus-lg"></span> Add
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="table-responsive mt-3">
                                                    <table className="table table-striped table-borderless fs-md">
                                                        <thead className="bg-theme text-white">
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Buyer Name</th>
                                                                <th>Qty</th>
                                                                <th>Amount</th>
                                                                <th>Remarks</th>
                                                                <th className="text-center">Edit / Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportData.topBuyers.map((buyer, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{buyer.name}</td>
                                                                    <td>{buyer.qty}</td>
                                                                    <td>{buyer.amount}</td>
                                                                    <td>{buyer.remarks}</td>
                                                                    <td className="text-center">
                                                                        <button type="button" className="btn btn-default text-primary btn-sm">
                                                                            <span className="bi bi-pencil"></span>
                                                                        </button>
                                                                        <button type="button" className="btn btn-default text-danger btn-sm">
                                                                            <span className="bi bi-trash"></span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="border p-2 rounded-3">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <label className="fs-md fw-bold mb-1">Top 5 Suppliers</label>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <button type="button" className="btn btn-outline-primary btn-sm border-0" onClick={() => setShowSupplierModal(true)}>
                                                            <span className="bi bi-plus-lg"></span> Add
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="table-responsive mt-3">
                                                    <table className="table table-striped table-borderless fs-md">
                                                        <thead className="bg-theme text-white">
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Supplier Name</th>
                                                                <th>Qty</th>
                                                                <th>Amount</th>
                                                                <th>Remarks</th>
                                                                <th className="text-center">Edit / Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportData.topSuppliers.map((supplier, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{supplier.name}</td>
                                                                    <td>{supplier.qty}</td>
                                                                    <td>{supplier.amount}</td>
                                                                    <td>{supplier.remarks}</td>
                                                                    <td className="text-center">
                                                                        <button type="button" className="btn btn-default text-primary btn-sm">
                                                                            <span className="bi bi-pencil"></span>
                                                                        </button>
                                                                        <button type="button" className="btn btn-default text-danger btn-sm">
                                                                            <span className="bi bi-trash"></span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'payable' && (
                                    <div className="tab-pane fade show active" id="payable" role="tabpanel">
                                        <div className="p-2">
                                            <div className="border p-2 rounded-3 mb-3">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <label className="fs-md fw-bold mb-1">Receivables</label>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <button type="button" className="btn btn-outline-primary btn-sm border-0" onClick={() => setShowReceivableModal(true)}>
                                                            <span className="bi bi-plus-lg"></span> Add
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="table-responsive mt-3">
                                                    <table className="table table-striped table-borderless fs-md">
                                                        <thead className="bg-theme text-white">
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>From</th>
                                                                <th>Date</th>
                                                                <th>Amount</th>
                                                                <th className="text-center">Edit / Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportData.receivables.map((receivable, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{receivable.from}</td>
                                                                    <td>{receivable.date}</td>
                                                                    <td>{receivable.amount}</td>
                                                                    <td className="text-center">
                                                                        <button type="button" className="btn btn-default text-primary btn-sm">
                                                                            <span className="bi bi-pencil"></span>
                                                                        </button>
                                                                        <button type="button" className="btn btn-default text-danger btn-sm">
                                                                            <span className="bi bi-trash"></span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="border p-2 rounded-3">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <label className="fs-md fw-bold mb-1">Payables</label>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <button type="button" className="btn btn-outline-primary btn-sm border-0" onClick={() => setShowPayableModal(true)}>
                                                            <span className="bi bi-plus-lg"></span> Add
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="table-responsive mt-3">
                                                    <table className="table table-striped table-borderless fs-md">
                                                        <thead className="bg-theme text-white">
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>To</th>
                                                                <th>Date</th>
                                                                <th>Amount</th>
                                                                <th className="text-center">Edit / Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportData.payables.map((payable, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{payable.to}</td>
                                                                    <td>{payable.date}</td>
                                                                    <td>{payable.amount}</td>
                                                                    <td className="text-center">
                                                                        <button type="button" className="btn btn-default text-primary btn-sm">
                                                                            <span className="bi bi-pencil"></span>
                                                                        </button>
                                                                        <button type="button" className="btn btn-default text-danger btn-sm">
                                                                            <span className="bi bi-trash"></span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'operational' && (
                                    <div className="tab-pane fade show active" id="operational" role="tabpanel">
                                        <div className="p-2">
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="skilledInput" placeholder=""
                                                            name="skilledEmployees" value={reportData.skilledEmployees} onChange={handleChange} />
                                                        <label htmlFor="skilledInput">Skilled Employees</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="unskilledInput" placeholder=""
                                                            name="unskilledEmployees" value={reportData.unskilledEmployees} onChange={handleChange} />
                                                        <label htmlFor="unskilledInput">Unskilled Employees</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="femaleInput" placeholder=""
                                                            name="femaleEmployees" value={reportData.femaleEmployees} onChange={handleChange} />
                                                        <label htmlFor="femaleInput">Female Employees</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="capacityInput" placeholder=""
                                                            name="installedCapacity" value={reportData.installedCapacity} onChange={handleChange} />
                                                        <label htmlFor="capacityInput">Installed Capacity</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="utilizationInput" placeholder=""
                                                            name="utilization" value={reportData.utilization} onChange={handleChange} />
                                                        <label htmlFor="utilizationInput">Utilization</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="observationInput" placeholder=""
                                                            name="observation" value={reportData.observation} onChange={handleChange} />
                                                        <label htmlFor="observationInput">Observation</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                                    <div className="form-floating mb-3">
                                                        <input type="text" className="form-control" id="statusInput" placeholder=""
                                                            name="operationalStatus" value={reportData.operationalStatus} onChange={handleChange} />
                                                        <label htmlFor="statusInput">Operational Status</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border p-2 rounded-3 mt-3">
                                                <div className="row align-items-center">
                                                    <div className="col-6">
                                                        <label className="fs-md fw-bold mb-1">Order Book</label>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <button type="button" className="btn btn-outline-primary btn-sm border-0" onClick={() => setShowOrderModal(true)}>
                                                            <span className="bi bi-plus-lg"></span> Add
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="table-responsive mt-3">
                                                    <table className="table table-striped table-borderless fs-md">
                                                        <thead className="bg-theme text-white">
                                                            <tr>
                                                                <th>S.No</th>
                                                                <th>Date</th>
                                                                <th>Customer</th>
                                                                <th>Value</th>
                                                                <th>Delivery Date</th>
                                                                <th className="text-center">Edit / Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportData.orderBook.map((order, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{order.date}</td>
                                                                    <td>{order.customer}</td>
                                                                    <td>{order.value}</td>
                                                                    <td>{order.deliveryDate}</td>
                                                                    <td className="text-center">
                                                                        <button type="button" className="btn btn-default text-primary btn-sm">
                                                                            <span className="bi bi-pencil"></span>
                                                                        </button>
                                                                        <button type="button" className="btn btn-default text-danger btn-sm">
                                                                            <span className="bi bi-trash"></span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'salesissue' && (
                                    <div className="tab-pane fade show active" id="salesissue" role="tabpanel">
                                        <div className="p-2">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <textarea className="form-control" id="stressInput" placeholder="" style={{height: '100px'}}
                                                            name="stressReasons" value={reportData.stressReasons} onChange={handleChange} />
                                                        <label htmlFor="stressInput">Reasons for Stress</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'balancesheet' && (
                                    <div className="tab-pane fade show active" id="balancesheet" role="tabpanel">
                                        <div className="p-2">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-borderless fs-md">
                                                    <thead className="bg-theme text-white">
                                                        <tr>
                                                            <th>Parameter</th>
                                                            <th>2022</th>
                                                            <th>2023</th>
                                                            <th>2024</th>
                                                            <th>2024 (Prov.)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reportData.balanceSheetData.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>{row.parameter}</td>
                                                                <td>{row.y2022}</td>
                                                                <td>{row.y2023}</td>
                                                                <td>{row.y2024}</td>
                                                                <td>{row.y2024Prov}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'statusupdate' && (
                                    <div className="tab-pane fade show active" id="statusupdate" role="tabpanel">
                                        <div className="p-2">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <textarea className="form-control" id="observationsInput" placeholder="" style={{height: '100px'}}
                                                            name="diagnosticObservations" value={reportData.diagnosticObservations} onChange={handleChange} />
                                                        <label htmlFor="observationsInput">Diagnostic Observations</label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating mb-3">
                                                        <textarea className="form-control" id="statusInput" placeholder="" style={{height: '100px'}}
                                                            name="diagnosticStatus" value={reportData.diagnosticStatus} onChange={handleChange} />
                                                        <label htmlFor="statusInput">Diagnostic Status</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shareholder Modal */}
            {showShareholderModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Shareholder</h5>
                                <button type="button" className="btn-close" onClick={() => setShowShareholderModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Name" 
                                        value={newShareholder.name} onChange={(e) => setNewShareholder({...newShareholder, name: e.target.value})} />
                                    <label>Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Mobile" 
                                        value={newShareholder.mobile} onChange={(e) => setNewShareholder({...newShareholder, mobile: e.target.value})} />
                                    <label>Mobile No</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Shares" 
                                        value={newShareholder.shares} onChange={(e) => setNewShareholder({...newShareholder, shares: e.target.value})} />
                                    <label>No of Shares / % of Shares</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowShareholderModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addShareholder}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Buyer Modal */}
            {showBuyerModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Buyer</h5>
                                <button type="button" className="btn-close" onClick={() => setShowBuyerModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Name" 
                                        value={newBuyer.name} onChange={(e) => setNewBuyer({...newBuyer, name: e.target.value})} />
                                    <label>Buyer Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Qty" 
                                        value={newBuyer.qty} onChange={(e) => setNewBuyer({...newBuyer, qty: e.target.value})} />
                                    <label>Quantity</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Amount" 
                                        value={newBuyer.amount} onChange={(e) => setNewBuyer({...newBuyer, amount: e.target.value})} />
                                    <label>Amount</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Remarks" 
                                        value={newBuyer.remarks} onChange={(e) => setNewBuyer({...newBuyer, remarks: e.target.value})} />
                                    <label>Remarks</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowBuyerModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addBuyer}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Supplier Modal */}
            {showSupplierModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Supplier</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSupplierModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Name" 
                                        value={newSupplier.name} onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} />
                                    <label>Supplier Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Qty" 
                                        value={newSupplier.qty} onChange={(e) => setNewSupplier({...newSupplier, qty: e.target.value})} />
                                    <label>Quantity</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Amount" 
                                        value={newSupplier.amount} onChange={(e) => setNewSupplier({...newSupplier, amount: e.target.value})} />
                                    <label>Amount</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Remarks" 
                                        value={newSupplier.remarks} onChange={(e) => setNewSupplier({...newSupplier, remarks: e.target.value})} />
                                    <label>Remarks</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addSupplier}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Modal */}
            {showOrderModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Order</h5>
                                <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Date" 
                                        value={newOrder.date} onChange={(e) => setNewOrder({...newOrder, date: e.target.value})} />
                                    <label>Date</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Customer" 
                                        value={newOrder.customer} onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})} />
                                    <label>Customer</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Value" 
                                        value={newOrder.value} onChange={(e) => setNewOrder({...newOrder, value: e.target.value})} />
                                    <label>Value</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Delivery Date" 
                                        value={newOrder.deliveryDate} onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})} />
                                    <label>Delivery Date</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addOrder}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Receivable Modal */}
            {showReceivableModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Receivable</h5>
                                <button type="button" className="btn-close" onClick={() => setShowReceivableModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="From" 
                                        value={newReceivable.from} onChange={(e) => setNewReceivable({...newReceivable, from: e.target.value})} />
                                    <label>From</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Date" 
                                        value={newReceivable.date} onChange={(e) => setNewReceivable({...newReceivable, date: e.target.value})} />
                                    <label>Date</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Amount" 
                                        value={newReceivable.amount} onChange={(e) => setNewReceivable({...newReceivable, amount: e.target.value})} />
                                    <label>Amount</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowReceivableModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addReceivable}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payable Modal */}
            {showPayableModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Payable</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPayableModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="To" 
                                        value={newPayable.to} onChange={(e) => setNewPayable({...newPayable, to: e.target.value})} />
                                    <label>To</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Date" 
                                        value={newPayable.date} onChange={(e) => setNewPayable({...newPayable, date: e.target.value})} />
                                    <label>Date</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Amount" 
                                        value={newPayable.amount} onChange={(e) => setNewPayable({...newPayable, amount: e.target.value})} />
                                    <label>Amount</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPayableModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addPayable}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loan Modal */}
            {showLoanModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Loan Source</h5>
                                <button type="button" className="btn-close" onClick={() => setShowLoanModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Source" 
                                        value={newLoan.source} onChange={(e) => setNewLoan({...newLoan, source: e.target.value})} />
                                    <label>Source</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Amount" 
                                        value={newLoan.amount} onChange={(e) => setNewLoan({...newLoan, amount: e.target.value})} />
                                    <label>Amount</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Since" 
                                        value={newLoan.since} onChange={(e) => setNewLoan({...newLoan, since: e.target.value})} />
                                    <label>Since</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" placeholder="Remarks" 
                                        value={newLoan.remarks} onChange={(e) => setNewLoan({...newLoan, remarks: e.target.value})} />
                                    <label>Remarks</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowLoanModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={addLoan}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Next</button>
            </div>
        </fieldset>
    );
};

export default DiagnosticReport;