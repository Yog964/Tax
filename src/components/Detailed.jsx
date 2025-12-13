import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { saveDetailedData } from '../redux/calculate'; // Assume a new action for detailed data

const Detailed = () => {
    // State variables for detailed inputs
    const [annualIncome, setAnnualIncome] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [taxRegime, setTaxRegime] = useState('new'); // 'new' or 'old'
    const [section80C, setSection80C] = useState('');
    const [section80D, setSection80D] = useState('');
    const [hraExemption, setHraExemption] = useState('');
    const [homeLoanInterest, setHomeLoanInterest] = useState('');

    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCalculateDetailedTax = () => {
        // Basic input validation
        if (annualIncome === '' || ageGroup === '' || taxRegime === '') {
            alert('Please fill in Annual Income, Age Group, and Tax Regime.');
            return;
        }

        const data = {
            annualIncome: Number(annualIncome),
            ageGroup,
            taxRegime,
            section80C: Number(section80C || 0),
            section80D: Number(section80D || 0),
            hraExemption: Number(hraExemption || 0),
            homeLoanInterest: Number(homeLoanInterest || 0),
        };

        // TODO: Dispatch action to Redux and/or save to localStorage
        // dispatch(saveDetailedData(data));
        // localStorage.setItem('detailedTaxData', JSON.stringify(data));

        // Navigate to the detailed result page
        navigate("/DetailedResult");
    };

    return (
        <div className="Detailed-page">
            <div className="Detailed-container">
                <h1>Detailed Tax Calculator</h1>
                <p className="subtitle">Optimize your tax liability using deductions</p>

                {/* --- Primary Income & Status --- */}
                <label>Total Annual Income</label>
                <div className="input-wrapper">
                    <span>₹</span>
                    <input
                        type="number"
                        placeholder="Enter total annual income"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                    />
                </div>

                <label>Age Group</label>
                <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                    <option value="">Select option</option>
                    <option value="below60">Below 60 Years</option>
                    <option value="60to80">Between 60 - 80 Years (Senior Citizen)</option>
                    <option value="above80">Above 80 Years (Super Senior Citizen)</option>
                </select>

                <label>Tax Regime Choice</label>
                <select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)}>
                    <option value="new">New Tax Regime (Default)</option>
                    <option value="old">Old Tax Regime (With Deductions)</option>
                </select>
                
                <hr className='separator'/>

                {/* --- Deductions (Visible primarily for Old Regime) --- */}
                <h2>Common Deductions (For Old Regime)</h2>
                <p className="note-text">Enter amounts for deductions you are claiming. Enter 0 if not claiming.</p>

                {/* Section 80C */}
                <label>Section 80C Investment (Max ₹1,50,000)</label>
                <div className="input-wrapper">
                    <span>₹</span>
                    <input
                        type="number"
                        placeholder="e.g., PPF, ELSS, Life Insurance"
                        value={section80C}
                        onChange={(e) => setSection80C(e.target.value)}
                        // Disabled or styled differently if taxRegime is 'new' and no 80CCD(2) benefit is considered
                        // For simplicity, we keep it enabled here but logic in the calculation component
                    />
                </div>

                {/* Section 80D */}
                <label>Section 80D - Health Insurance</label>
                <div className="input-wrapper">
                    <span>₹</span>
                    <input
                        type="number"
                        placeholder="e.g., Premium paid for self, family, parents"
                        value={section80D}
                        onChange={(e) => setSection80D(e.target.value)}
                    />
                </div>
                
                {/* HRA Exemption (A simplified input) */}
                <label>HRA Exemption Amount Claimed</label>
                <div className="input-wrapper">
                    <span>₹</span>
                    <input
                        type="number"
                        placeholder="Calculated HRA exemption"
                        value={hraExemption}
                        onChange={(e) => setHraExemption(e.target.value)}
                    />
                </div>

                {/* Section 24b - Home Loan Interest */}
                <label>Home Loan Interest Paid (Max ₹2,00,000)</label>
                <div className="input-wrapper">
                    <span>₹</span>
                    <input
                        type="number"
                        placeholder="Interest on loan for self-occupied property"
                        value={homeLoanInterest}
                        onChange={(e) => setHomeLoanInterest(e.target.value)}
                    />
                </div>

                <button className="calc-btn" onClick={handleCalculateDetailedTax}>
                    Calculate Detailed Tax
                </button>
                
                <p className="footer-text">
                    Detailed estimation based on Indian tax rules and claimed deductions.
                </p>
            </div>
        </div>
    );
}

export default Detailed;