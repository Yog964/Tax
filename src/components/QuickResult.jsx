import React from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

const QuickResult = () => {
    // Read pre-calculated values from Redux store (Keep this to use the final result)
    const readIncome = useSelector((state) => state.calculate.income); // Gross Income
    const activeIncome = useSelector((state) => state.calculate.ActiveIncome); // Taxable Income
    const netTax = useSelector((state) => state.calculate.NetTax); // Final Tax Payable
    
    // NOTE: All other Redux selectors (slabTax, rebate, etc.) and
    // the detailed calculation helpers are kept in the code but
    // are not used in the final return block to simplify the display.
    
    // --- Detailed Calculation logic (KEPT IN CODE but NOT DISPLAYED) ---
    const slabTax = useSelector((state) => state.calculate.SlabTax);
    const rebate = useSelector((state) => state.calculate.Rebate);
    const surcharge = useSelector((state) => state.calculate.Surcharge);
    const marginalRelief = useSelector((state) => state.calculate.MarginalRelief);
    
    // Format helper
    const format = (value) => Math.round(value).toLocaleString('en-IN');

    // Helper to calculate the tax on a specific slab for display (logic mirrors the Redux slice)
    const calculateSlabAmount = (upperLimit, lowerLimit, rate) => {
        if (activeIncome > lowerLimit) {
            const slabBase = Math.min(upperLimit, activeIncome);
            return Math.round(Math.max(0, slabBase - lowerLimit) * rate);
        }
        return 0;
    };

    // Calculate tax for each slab for display in the table (KEPT IN CODE)
    const tax4to8L = calculateSlabAmount(800000, 400000, 0.05);
    const tax8to12L = calculateSlabAmount(1200000, 800000, 0.10);
    const tax12to16L = calculateSlabAmount(1600000, 1200000, 0.15);
    const tax16to20L = calculateSlabAmount(2000000, 1600000, 0.20);
    const tax20to24L = calculateSlabAmount(2400000, 2000000, 0.25);
    const taxAbove24L = activeIncome > 2400000 ? Math.round((activeIncome - 2400000) * 0.30) : 0;
    
    // Tax After Rebate, MR, and Surcharge (pre-cess) for Cess calculation display
    const taxAfterSurcharge = slabTax - rebate - marginalRelief + surcharge;
    
    // Cess calculation
    const cessAmount = Math.round(taxAfterSurcharge * 0.04);
    
    // Determine the nature of the Marginal Relief for display
    let marginalReliefText = "Rs. 0";
    if (marginalRelief > 0 && activeIncome <= 1275000) {
        marginalReliefText = `(Rs. ${format(marginalRelief)}) - Rebate MR`;
    } else if (marginalRelief > 0) {
        marginalReliefText = `(Rs. ${format(marginalRelief)}) - Surcharge MR`;
    }
    // --- Detailed Calculation logic END ---


    return (
        <div className='Quickresult-Page'>
            <Toaster />
            <div className="Quickresultcard">
                <h2>Quick Tax Calculation Result</h2>
                <p className="subtitle">New Regime (FY 2025-26)</p>
                
                {/* --- Summary Section: Simplified Display --- */}
                <div className="summary-section-simplified">
                    
                    <div className="summary-row-large">
                        <span className="label">Total Annual Gross Income</span>
                        <span className="value">Rs. {format(readIncome)}</span>
                    </div>
                    
                    {/* <div className="summary-row-small">
                        <span className="label">Total Taxable Income (TTI)</span>
                        <span className="value">Rs. {format(activeIncome)}</span>
                    </div> */}

                    <hr />

                    <div className="summary-row-final total-tax">
                        <span className="label">NET TAX PAYABLE</span>
                        <span className="value-final">Rs. {format(netTax)}</span>
                    </div>
                    
                </div>
                {/* --- End of Simplified Display --- */}

                {/* NOTE: The detailed Tax Calculation Table is removed/commented out here 
                         as per your request to only display total income and tax. */}

            </div>
            <div className="Quickresultcard"><NavLink to="/DetailedCalculator">View Deatail</NavLink></div>
        </div>
    );
}

export default QuickResult;