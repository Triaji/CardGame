import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@store/Config';

export interface StepState {
  value: number;
}

const initialState: StepState = {
  value: 0,
};

export const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    incrementStep: state => {
      state.value += 1;
    },
    resetStep: state => {
      state.value = 0;
    },
  },
});

export const { incrementStep, resetStep } = stepSlice.actions;

export const selectStep = (state: RootState) => state.step.value;

export default stepSlice.reducer;
