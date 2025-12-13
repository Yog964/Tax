import { createSlice } from "@reduxjs/toolkit";

// --- Tax Logic Constants (New Regime FY 2025-26) ---
const STANDARD_DEDUCTION = 75000;
const REBATE_LIMIT_INCOME = 1200000; // TTI limit for Rebate u/s 87A
const MAX_REBATE_AMOUNT = 60000; // Max Rebate u/s 87A
const CESS_RATE = 0.04;

// Surcharge Thresholds and Rates for New Regime
const SURCHARGE_THRESHOLD_1 = 5000000;
const SURCHARGE_RATE_1 = 0.1;
const TAX_ON_50L_TTI = 1185000; // Tax on TTI of 50 Lakh (New Regime: 1,080,000 + 4% cess is 1,123,200)

const initialState = {
  income: 10, // Gross Total Income (before deductions)
  NetTax: 0, // Final Tax Payable (with Cess)
  ActiveIncome: 10, // Total Taxable Income (TTI)
  SlabTax: 0, // Tax before Rebate & Surcharge
  Rebate: 0, // Rebate u/s 87A applied
  Surcharge: 0, // Surcharge applied
  MarginalRelief: 0, // Marginal Relief applied (Rebate MR or Surcharge MR)
};

export const calculateSlice = createSlice({
  name: "compute",
  initialState,
  reducers: {
    saveIncome: (state, action) => {
      const grossIncome = Number(action.payload) || 0;
      state.income = grossIncome;
      localStorage.setItem("income", grossIncome);

      // Trigger the calculation immediately after saving income
      calculateSlice.caseReducers.calculateNetTax(state);
    },

    calculateNetTax: (state) => {
      // 1. Calculate Taxable Income (TTI)
      // Note: Only SD is considered here for simplicity; other deductions (like 80CCD(2)) should be added before this line.
      const taxableIncome = Math.max(0, state.income - STANDARD_DEDUCTION); // Applies SD of 75k
      state.ActiveIncome = taxableIncome;

      // 2. Calculate Tax based on Slabs (Backward calculation for efficiency)
      let taxBeforeRebate = 0;
      let balance = taxableIncome;

      // Slabs and Cumulative Tax (Backward)
      if (balance > 2400000) {
        taxBeforeRebate += (balance - 2400000) * 0.3;
        balance = 2400000;
      }
      if (balance > 2000000) {
        taxBeforeRebate += (balance - 2000000) * 0.25;
        balance = 2000000;
      }
      if (balance > 1600000) {
        taxBeforeRebate += (balance - 1600000) * 0.2;
        balance = 1600000;
      }
      if (balance > 1200000) {
        taxBeforeRebate += (balance - 1200000) * 0.15;
        balance = 1200000;
      }
      if (balance > 800000) {
        taxBeforeRebate += (balance - 800000) * 0.1;
        balance = 800000;
      }
      if (balance > 400000) {
        taxBeforeRebate += (balance - 400000) * 0.05; /* 0-4L is 0% */
      }

      state.SlabTax = Math.round(taxBeforeRebate);

      // 3. Apply Rebate U/S 87A and Marginal Relief (MR) on Rebate
      let taxAfterRelief = taxBeforeRebate;
      let marginalRelief = 0;
      let rebateApplied = 0;

      if (taxableIncome <= REBATE_LIMIT_INCOME) {
        // TTI <= 12L
        rebateApplied = Math.min(taxBeforeRebate, MAX_REBATE_AMOUNT); // Max 60k rebate
        taxAfterRelief = taxBeforeRebate - rebateApplied;
      } else {
        // TTI > 12L: Check for Marginal Relief (MR) on Rebate
        // Tax on TTI of 12L is 60k, which is nullified by rebate.
        const taxIf12L = 60000;
        const excessIncome = taxableIncome - REBATE_LIMIT_INCOME; // Income above 12L

        // MR Rule: Tax Payable must not exceed (Tax on 12L) + (Income above 12L)
        const maxTaxWithoutMR = taxIf12L + excessIncome;

        if (taxBeforeRebate > maxTaxWithoutMR) {
          marginalRelief = taxBeforeRebate - maxTaxWithoutMR;
          taxAfterRelief = maxTaxWithoutMR; // Tax is capped at the MR level
        } else {
          taxAfterRelief = taxBeforeRebate;
        }
      }

      // 4. Apply Surcharge and Marginal Relief on Surcharge (For incomes > 50L)
      let surcharge = 0;

      if (taxableIncome > SURCHARGE_THRESHOLD_1) {
        // TTI > 50L
        let surchargeRate = 0;
        if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
          surchargeRate = SURCHARGE_RATE_1;
        } // 10%

        surcharge = Math.round(taxAfterRelief * surchargeRate);
        let taxWithSurcharge = taxAfterRelief + surcharge;

        // --- Marginal Relief on Surcharge (Simplifed Logic) ---
        const taxOn50L = 1185000; // Tax on 50L TTI (after rebate, before surcharge/cess)
        const incrementalIncome = taxableIncome - SURCHARGE_THRESHOLD_1;

        // Max Surcharge Tax Cap = (Tax on 50L) + (Income above 50L)
        const maxTaxCap = taxOn50L + incrementalIncome;

        if (taxWithSurcharge > maxTaxCap) {
          const mrForSurcharge = taxWithSurcharge - maxTaxCap;
          taxWithSurcharge = maxTaxCap;
          marginalRelief += mrForSurcharge;
          surcharge = taxWithSurcharge - taxAfterRelief; // Recalculate Surcharge after MR
        }
        taxAfterRelief = taxWithSurcharge; // Update the final pre-cess tax
      }

      state.Rebate = rebateApplied;
      state.Surcharge = Math.round(surcharge);
      state.MarginalRelief = Math.round(marginalRelief); // Total MR is cumulative

      // 5. Add Health & Education Cess (4%)
      const finalTax = Math.round(taxAfterRelief * (1 + CESS_RATE));

      state.NetTax = finalTax;
      localStorage.setItem("NetTax", finalTax);
    },

    // Other reducers (incrementTax, updateIncome) remain unchanged
    incrementTax: (state, action) => {
      state.NetTax = action.payload;
      localStorage.setItem("NetTax", action.payload);
    },
    updateIncome: (state, action) => {
      state.ActiveIncome = action.payload;
      localStorage.setItem("ActiveIncome", action.payload);
    },
  },
});

export const { saveIncome, incrementTax, updateIncome } =
  calculateSlice.actions;

export default calculateSlice.reducer;
