import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@store/Config';

export interface CardState {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
}

const initialState: CardState[] = [];

export const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addCard: (states, action: PayloadAction<CardState>) => {
      states.push(action.payload);
      return states;
    },
    flipCard: (states, action: PayloadAction<number>) =>
      states.map(state => {
        if (state.id !== action.payload) {
          return state;
        }

        return {
          ...state,
          flipped: true,
        };
      }),
    unflipCards: (states, action: PayloadAction<number[]>) =>
      states.map(state => {
        if (action.payload.indexOf(state.id) === -1) {
          return state;
        }

        return {
          ...state,
          flipped: false,
        };
      }),
    unflipCardsAll: states =>
      states.map(state => {
        return {
          ...state,
          flipped: false,
        };
      }),
    matchCards: (states, action: PayloadAction<number[]>) =>
      states.map(state => {
        if (action.payload.indexOf(state.id) === -1) {
          return state;
        }

        return {
          ...state,
          matched: true,
        };
      }),
    setCards: (states, action: PayloadAction<CardState[]>) => action.payload,
  },
});

export const {
  addCard,
  flipCard,
  unflipCards,
  unflipCardsAll,
  setCards,
  matchCards,
} = cardSlice.actions;

export const selectCards = (state: RootState) => state.cards;

export default cardSlice.reducer;
