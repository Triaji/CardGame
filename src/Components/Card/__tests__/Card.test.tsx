import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react-native';
import Card from '../Card';
import { default as RN, Animated } from 'react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.useFakeTimers();

describe('CardComponent', () => {
  it('should call onPress correctly when card is pressed', () => {
    const mockPress = jest.fn();
    render(
      <Card
        card={{ id: 0, value: 10, flipped: false, matched: false }}
        onPress={mockPress}
      />,
    );

    fireEvent.press(screen.getByTestId('touchable-card'));
    expect(mockPress).toHaveBeenCalled();
  });

  it('should renders correctly', () => {
    const card = render(
      <Card
        card={{ id: 0, value: 10, flipped: false, matched: false }}
        onPress={() => {}}
      />,
    );
    expect(screen.getByText(/10/i)).toBeDefined();
    card.rerender(
      <Card
        card={{ id: 0, value: 10, flipped: true, matched: false }}
        onPress={() => {}}
      />,
    );

    card.rerender(
      <Card
        card={{ id: 0, value: 10, flipped: false, matched: false }}
        onPress={() => {}}
      />,
    );

    card.rerender(
      <Card
        card={{ id: 0, value: 10, flipped: true, matched: true }}
        onPress={() => {}}
      />,
    );

    card.rerender(
      <Card
        card={{ id: 0, value: 10, flipped: false, matched: false }}
        onPress={() => {}}
      />,
    );

    jest.advanceTimersByTime(1000);

    card.toJSON();

    expect(card).toMatchSnapshot();
  });
});
