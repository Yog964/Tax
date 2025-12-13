import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const calculateSlice = createSlice({
  name: 'compute',
  initialState,
  reducers: {
    decrement: (state) => {

    },
    incrementByAmount: (state, action) => {

    },
  },
})

export const { decrement, incrementByAmount } = calculateSlice.actions

export default calculateSlice.reducer