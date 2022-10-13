import reducer, { incrementStep, resetStep, selectStep } from '../Slice';
import type { StepState } from '../Slice';

describe('StepSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual({ value: 0 });
  });

  it('should handle the step counter being incremented', () => {
    const previousState: StepState = { value: 9 };

    expect(reducer(previousState, incrementStep())).toEqual({ value: 10 });
  });

  it('should handle the step counter being reset', () => {
    const previousState: StepState = { value: 9 };

    expect(reducer(previousState, resetStep())).toEqual({ value: 0 });
  });

  it('should handle fetching step', () => {
    const previousState: StepState = { value: 9 };

    expect(selectStep({ step: previousState, cards: [] })).toEqual(9);
  });
});
