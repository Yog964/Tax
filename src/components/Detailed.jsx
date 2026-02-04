import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveDetailedData } from '../redux/calculate'; // Ensure this action exists in your slice

const Detailed = () => {
    // State variables
    const [annualIncome, setAnnualIncome] = useState('');
    const [ageGroup, setAgeGroup] = useState('below60');
    const [taxRegime, setTaxRegime] = useState('new'); 
    const [section80C, setSection80C] = useState('');
    const [section80D, setSection80D] = useState('');
    const [hraExemption, setHraExemption] = useState('');
    const [homeLoanInterest, setHomeLoanInterest] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Effect to load previous data from localStorage if available
    useEffect(() => {
        const savedData = localStorage.getItem('detailedTaxData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnnualIncome(parsed.annualIncome || '');
            setAgeGroup(parsed.ageGroup || 'below60');
            setTaxRegime(parsed.taxRegime || 'new');
            setSection80C(parsed.section80C || '');
            setSection80D(parsed.section80D || '');
            setHraExemption(parsed.hraExemption || '');
            setHomeLoanInterest(parsed.homeLoanInterest || '');
        }
    }, []);

    const handleCalculateDetailedTax = () => {
        if (!annualIncome || Number(annualIncome) <= 0) {
            alert('Please enter a valid Annual Income.');
            return;
        }

        const data = {
            annualIncome: Math.round(Number(annualIncome)),
            ageGroup,
            taxRegime,
            // If New Regime is selected, deductions are typically ignored in calculation
            section80C: taxRegime === 'old' ? Number(section80C || 0) : 0,
            section80D: taxRegime === 'old' ? Number(section80D || 0) : 0,
            hraExemption: taxRegime === 'old' ? Number(hraExemption || 0) : 0,
            homeLoanInterest: taxRegime === 'old' ? Number(homeLoanInterest || 0) : 0,
            standardDeduction: 75000 // FY 2025-26 Standard Deduction
        };

        // 1. Save to Redux
        dispatch(saveDetailedData(data));
        
        // 2. Save to Local Storage for persistence
        localStorage.setItem('detailedTaxData', JSON.stringify(data));

        // 3. Navigate to results
        navigate("/DetailedResult");
    };

    // Helper to determine if deduction fields should be interactive
    const isOldRegime = taxRegime === 'old';

    return (
        <div className="Detailed-page">
            <div className="Detailed-container">
                <h1>Detailed Tax Calculator</h1>
                <p className="subtitle">Optimize your tax liability using deductions (FY 2025-26)</p>

                {/* --- Primary Income & Status --- */}
                <div className="input-group">
                    <label>Total Annual Income (Salary/Business/Other)</label>
                    <div className="input-wrapper">
                        <span>₹</span>
                        <input
                            type="number"
                            placeholder="e.g. 1200000"
                            value={annualIncome}
                            onChange={(e) => setAnnualIncome(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Age Group</label>
                    <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                        <option value="below60">Below 60 Years</option>
                        <option value="60to80">60 - 80 Years (Senior Citizen)</option>
                        <option value="above80">Above 80 Years (Super Senior)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Tax Regime Choice</label>
                    <select 
                        value={taxRegime} 
                        onChange={(e) => setTaxRegime(e.target.value)}
                        style={{ border: '2px solid #22c55e' }}
                    >
                        <option value="new">New Tax Regime (Lower Rates, No Deductions)</option>
                        <option value="old">Old Tax Regime (Higher Rates, With Deductions)</option>
                    </select>
                </div>

                <hr className='separator'/>

                {/* --- Deductions Section --- */}
                <div style={{ opacity: isOldRegime ? 1 : 0.6 }}>
                    <h2>Common Deductions {!isOldRegime && <span style={{fontSize: '12px', color: 'red'}}>(Not applicable in New Regime)</span>}</h2>
                    
                    <label>Section 80C (Life Insurance, PPF, ELSS) - Max ₹1.5L</label>
                    <div className="input-wrapper">
                        <span>₹</span>
                        <input
                            type="number"
                            disabled={!isOldRegime}
                            value={section80C}
                            onChange={(e) => setSection80C(e.target.value)}
                            placeholder={isOldRegime ? "0" : "Disabled"}
                        />
                    </div>

                    <label>Section 80D (Health Insurance Premium)</label>
                    <div className="input-wrapper">
                        <span>₹</span>
                        <input
                            type="number"
                            disabled={!isOldRegime}
                            value={section80D}
                            onChange={(e) => setSection80D(e.target.value)}
                            placeholder={isOldRegime ? "0" : "Disabled"}
                        />
                    </div>

                    <label>HRA Exemption</label>
                    <div className="input-wrapper">
                        <span>₹</span>
                        <input
                            type="number"
                            disabled={!isOldRegime}
                            value={hraExemption}
                            onChange={(e) => setHraExemption(e.target.value)}
                            placeholder={isOldRegime ? "0" : "Disabled"}
                        />
                    </div>

                    <label>Home Loan Interest (Section 24b)</label>
                    <div className="input-wrapper">
                        <span>₹</span>
                        <input
                            type="number"
                            disabled={!isOldRegime}
                            value={homeLoanInterest}
                            onChange={(e) => setHomeLoanInterest(e.target.value)}
                            placeholder={isOldRegime ? "0" : "Disabled"}
                        />
                    </div>
                </div>

                <button className="calc-btn" onClick={handleCalculateDetailedTax}>
                    Calculate Detailed Tax
                </button>
                
                <p className="footer-text">
                    *Standard Deduction of ₹75,000 is automatically applied to Salary income in both regimes for FY 25-26.
                </p>
            </div>
        </div>
    );
}

export default Detailed;