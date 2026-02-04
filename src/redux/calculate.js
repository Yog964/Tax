import { createSlice } from "@reduxjs/toolkit";

// --- Constants ---
const STANDARD_DEDUCTION = 75000;
const REBATE_LIMIT_NEW = 1200000; 
const MAX_REBATE_NEW = 60000;
const REBATE_LIMIT_OLD = 500000; // Old regime rebate limit
const MAX_REBATE_OLD = 12500;   // Old regime max rebate
const CESS_RATE = 0.04;

const initialState = {
  income: 0,
  ActiveIncome: 0, // This is TTI (Total Taxable Income)
  NetTax: 0,
  SlabTax: 0,
  Rebate: 0,
  Surcharge: 0,
  MarginalRelief: 0,
  regime: 'new', // Track which regime is being used
};

export const calculateSlice = createSlice({
  name: "compute",
  initialState,
  reducers: {
    // Standard Quick Calculation (New Regime only)
    saveIncome: (state, action) => {
      state.income = Number(action.payload) || 0;
      state.regime = 'new';
      // Standard quick calc ignores specific deductions except SD
      calculateSlice.caseReducers.performCalculation(state, { payload: { type: 'new' } });
    },

    // Detailed Calculation (Handles Old and New)
    saveDetailedData: (state, action) => {
  const { annualIncome, taxRegime, section80C, section80D, hraExemption, homeLoanInterest } = action.payload;
  
  // Use Math.round to prevent 1349999.999... issues
  const grossIncome = Math.round(Number(annualIncome));
  state.income = grossIncome;
  state.regime = taxRegime;

  // Apply Standard Deduction
  let tti = grossIncome - STANDARD_DEDUCTION;

  if (taxRegime === 'old') {
    const totalDeductions = 
      Math.min(Number(section80C || 0), 150000) + 
      Number(section80D || 0) + 
      Number(hraExemption || 0) + 
      Math.min(Number(homeLoanInterest || 0), 200000);
    
    tti -= totalDeductions;
  }

  // Final rounding for TTI
  state.ActiveIncome = Math.max(0, Math.round(tti));
  
  calculateSlice.caseReducers.performCalculation(state, { payload: { type: taxRegime } });
},

    performCalculation: (state, action) => {
      const type = action.payload.type;
      const tti = state.ActiveIncome;
      let tax = 0;

      if (type === 'new') {
        // --- NEW REGIME SLABS (FY 2025-26) ---
        let balance = tti;
        if (balance > 2400000) { tax += (balance - 2400000) * 0.3; balance = 2400000; }
        if (balance > 2000000) { tax += (balance - 2000000) * 0.25; balance = 2000000; }
        if (balance > 1600000) { tax += (balance - 1600000) * 0.2; balance = 1600000; }
        if (balance > 1200000) { tax += (balance - 1200000) * 0.15; balance = 1200000; }
        if (balance > 800000) { tax += (balance - 800000) * 0.1; balance = 800000; }
        if (balance > 400000) { tax += (balance - 400000) * 0.05; }
      } else {
        // --- OLD REGIME SLABS (FY 2025-26) ---
        let balance = tti;
        if (balance > 1000000) { tax += (balance - 1000000) * 0.3; balance = 1000000; }
        if (balance > 500000) { tax += (balance - 500000) * 0.2; balance = 500000; }
        if (balance > 250000) { tax += (balance - 250000) * 0.05; }
      }

      state.SlabTax = Math.round(tax);

      // 3. Rebate u/s 87A
      let rebate = 0;
      if (type === 'new' && tti <= REBATE_LIMIT_NEW) {
        rebate = Math.min(tax, MAX_REBATE_NEW);
      } else if (type === 'old' && tti <= REBATE_LIMIT_OLD) {
        rebate = Math.min(tax, MAX_REBATE_OLD);
      }
      state.Rebate = rebate;

      // 4. Final Totals (Simplifying MR for this example)
      const taxAfterRebate = Math.max(0, tax - rebate);
      state.NetTax = Math.round(taxAfterRebate * (1 + CESS_RATE));
    }
  },
});

export const { saveIncome, saveDetailedData } = calculateSlice.actions;
export default calculateSlice.reducer;