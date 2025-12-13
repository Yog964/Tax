import { configureStore } from '@reduxjs/toolkit'
import calculateReducer from '../redux/calculate.js'
export const store = configureStore({
  reducer: {
    calculate:calculateReducer
  },
})