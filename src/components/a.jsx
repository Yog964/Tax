import React from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

const QuickResult = () => {
    // Read pre-calculated values from Redux store
    const readIncome = useSelector((state) => state.calculate.income);
    const activeIncome = useSelector((state) => state.calculate.ActiveIncome);
    const netTax = useSelector((state) => state.calculate.NetTax);
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

    // Calculate tax for each slab for display in the table
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
    
    return (
        <div className='Quickresult-Page'>
            <Toaster />
            <div className="Quickresultcard">
                <h2>New Regime Tax Summary (FY 2025-26)</h2>
                {/* Summary Section */}
                <div className="summary-row">
                    <span>Total Gross Income (Before SD)</span>
                    <span>Rs. {format(readIncome)}</span>
                </div>

                <div className="summary-row">
                    <span>Less: Standard Deduction (U/s 16)</span>
                    <span>(Rs. 75,000)</span>
                </div>

                <div className="summary-row highlight">
                    <span>Total **Taxable** Income (TTI)</span>
                    <span>Rs. {format(activeIncome)}</span>
                </div>

                {/* Tax Calculation Table */}
                <table className="tax-table">
                    <thead>
                        <tr>
                            <th>Calculation of Tax (on TTI)</th>
                            <th>Tax Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Up to Rs. 4,00,000</td>
                            <td>Nil</td>
                            <td>Rs. 0</td>
                        </tr>
                        <tr>
                            <td>Rs. 4,00,001 to 8,00,000</td>
                            <td>5%</td>
                            <td>Rs. {format(tax4to8L)}</td>
                        </tr>
                        <tr>
                            <td>Rs. 8,00,001 to 12,00,000</td>
                            <td>10%</td>
                            <td>Rs. {format(tax8to12L)}</td>
                        </tr>
                        <tr>
                            <td>Rs. 12,00,001 to 16,00,000</td>
                            <td>15%</td>
                            <td>Rs. {format(tax12to16L)}</td>
                        </tr>
                        <tr>
                            <td>Rs. 16,00,001 to 20,00,000</td>
                            <td>20%</td>
                            <td>Rs. {format(tax16to20L)}</td>
                        </tr>
                        <tr>
                            <td>Rs. 20,00,001 to 24,00,000</td>
                            <td>25%</td>
                            <td>Rs. {format(tax20to24L)}</td>
                        </tr>
                        <tr>
                            <td>Above Rs. 24,00,000</td>
                            <td>30%</td>
                            <td>Rs. {format(taxAbove24L)}</td>
                        </tr>
                        
                        <tr className="divider">
                            <td>**Total Tax Before Rebate & Surcharge**</td>
                            <td></td>
                            <td>**Rs. {format(slabTax)}**</td>
                        </tr>
                        
                        <tr className="rebate-row">
                            <td>Less: Rebate U/S 87A (Max Rs. 60,000 for TTI ≤ Rs. 12L)</td>
                            <td></td>
                            <td>(Rs. {format(rebate)})</td>
                        </tr>
                         <tr className="mr-row">
                            <td>Less: Marginal Relief (if applicable)</td>
                            <td></td>
                            <td>{marginalReliefText}</td>
                        </tr>
                        
                        <tr className="surcharge-row">
                            <td>Add: Surcharge (if TTI > Rs. 50 Lakh)</td>
                            <td></td>
                            <td>Rs. {format(surcharge)}</td>
                        </tr>
                        
                        <tr className="cess-row">
                            <td>Add: Health & Education Cess (4% on Tax + Surcharge)</td>
                            <td></td>
                            <td>Rs. {format(cessAmount)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Final Tax */}
                <div className="summary-row total-tax">
                    <span>**NET TAX PAYABLE**</span>
                    <span>**Rs. {format(netTax)}**</span>
                </div>
            </div>
        </div>
    );
}

export default QuicskResult;