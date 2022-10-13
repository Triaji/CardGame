import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders, renderWithMockDispatch } from '@utils/TestUtils';
import Game, { CARD_PAIRS_VALUE } from '../Game';
import { mockRandomForEach } from 'jest-mock-random';
import Card from '@components/Card';
import { Alert } from 'react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return Object.setPrototypeOf(
    {
      Alert: {
        ...RN.Alert,
        alert: jest.fn(),
      },
    },
    RN,
  );
});

mockRandomForEach([
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
]);

it('should generate 12 random card values', () => {
  expect(CARD_PAIRS_VALUE()).toEqual([
    11, 21, 31, 41, 51, 61, 11, 21, 31, 41, 51, 61,
  ]);
});

describe('GameScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('renders correctly', () => {
    renderWithProviders(<Game />);
    expect(screen.getByText(/STEP/i)).toBeDefined();
  });

  it('should render 12 cards', () => {
    renderWithProviders(<Game />);
    const cards = screen.UNSAFE_getAllByType(Card);
    expect(cards).toHaveLength(12);
  });

  it('should render reset the cards', () => {
    renderWithProviders(<Game />);
    act(() => {
      fireEvent.press(screen.getByTestId('button-reset'));
      jest.advanceTimersByTime(1000);
    });
  });

  it('should dispatch unflipCards', () => {
    const { store } = renderWithProviders(<Game />);
    const cards = screen.UNSAFE_getAllByType(Card);
    act(() => {
      fireEvent.press(cards[0], {
        id: 0,
      });
    });

    expect(store.getState().cards[0]).toEqual({
      id: 0,
      value: 11,
      flipped: true,
      matched: false,
    });
  });

  it('should initialise by dispatching cards/setCards and step/resetStep', () => {
    const { store } = renderWithMockDispatch(<Game />);
    const values = [11, 21, 31, 41, 51, 61, 11, 21, 31, 41, 51, 61];
    jest.advanceTimersByTime(1);
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'cards/setCards',
      payload: values.map((val, index) => ({
        id: index,
        value: val,
        flipped: false,
        matched: false,
      })),
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'step/resetStep',
      payload: undefined,
    });
  });

  it('should dispatch incrementStep and flipCard when a card is pressed', () => {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    const { store } = renderWithMockDispatch(<Game />, {
      preloadedState: {
        cards: values.map((val, index) => ({
          id: index,
          value: val,
          flipped: false,
          matched: false,
        })),
        step: { value: 0 },
      },
    });
    const cards = screen.UNSAFE_getAllByType(Card);
    act(() => {
      fireEvent.press(cards[0], {
        id: 0,
      });
    });
    expect(store.dispatch).toHaveBeenCalledTimes(4);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'step/incrementStep',
      payload: undefined,
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'cards/flipCard',
      payload: 0,
    });
  });

  it('should dispatch flipCard but not incrementStep when a flipped card is pressed', () => {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    const cardValues = values.map((val, index) => ({
      id: index,
      value: val,
      flipped: index === 0 ? true : false,
      matched: false,
    }));
    const { store } = renderWithMockDispatch(<Game />, {
      preloadedState: {
        cards: cardValues,
        step: { value: 0 },
      },
    });
    const cards = screen.UNSAFE_getAllByType(Card);
    act(() => {
      fireEvent.press(cards[0], cardValues[0]);
    });
    expect(store.dispatch).toHaveBeenCalledTimes(3);
    expect(store.dispatch).not.toHaveBeenCalledWith({
      type: 'step/incrementStep',
      payload: undefined,
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'cards/flipCard',
      payload: 0,
    });
  });

  it('should dispatch unflipCards when 2 cards are flipped with different values', () => {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    const { store } = renderWithMockDispatch(<Game />, {
      preloadedState: {
        cards: values.map((val, index) => ({
          id: index,
          value: val,
          flipped: index === 0 || index === 2 ? true : false,
          matched: false,
        })),
        step: { value: 0 },
      },
    });

    jest.advanceTimersByTime(1000);

    expect(store.dispatch).toHaveBeenCalledTimes(3);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'cards/unflipCards',
      payload: [0, 2],
    });
  });

  it('should update flipped value of the card to true when a card is pressed', () => {
    const { store } = renderWithProviders(<Game />);
    const cards = screen.UNSAFE_getAllByType(Card);
    act(() => {
      fireEvent.press(cards[0], {
        id: 0,
      });
    });

    expect(store.getState().cards[0]).toEqual({
      id: 0,
      value: 11,
      flipped: true,
      matched: false,
    });
  });

  it('should dispatch matchedCards when 2 cards are flipped with different values', () => {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    const { store } = renderWithMockDispatch(<Game />, {
      preloadedState: {
        cards: values.map((val, index) => ({
          id: index,
          value: val,
          flipped: index === 0 || index === 1 ? true : false,
          matched: false,
        })),
        step: { value: 0 },
      },
    });

    expect(store.dispatch).toHaveBeenCalledTimes(3);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'cards/matchCards',
      payload: [0, 1],
    });
  });

  it('should update flipped and matched values of the cards to true when 2 cards of the same value is pressed', () => {
    const { store } = renderWithProviders(<Game />);
    const cards = screen.UNSAFE_getAllByType(Card);
    act(() => {
      fireEvent.press(cards[0], {
        id: 0,
      });
      fireEvent.press(cards[6], {
        id: 6,
      });
      jest.advanceTimersByTime(1000);
    });

    expect(store.getState().cards[0]).toEqual({
      id: 0,
      value: 11,
      flipped: true,
      matched: true,
    });
    expect(store.getState().cards[6]).toEqual({
      id: 6,
      value: 11,
      flipped: true,
      matched: true,
    });
  });

  it('should trigger alert when all of the cards are flipped and matched', () => {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    renderWithMockDispatch(<Game />, {
      preloadedState: {
        cards: values.map((val, index) => ({
          id: index,
          value: val,
          flipped: true,
          matched: true,
        })),
        step: { value: 0 },
      },
    });

    expect(Alert.alert).toHaveBeenCalled();
  });
});
