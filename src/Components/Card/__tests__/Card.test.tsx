import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react-native';
import Card from '../Card';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.useFakeTimers();

it('renders correctly', () => {
  const { rerender } = render(
    <Card
      card={{ id: 0, value: 10, flipped: false, matched: false }}
      onPress={() => {}}
    />,
  );

  expect(screen.getByText(/10/i)).toBeDefined();
  fireEvent.press(screen.getByTestId('touchable-card'));
  rerender(
    <Card
      card={{ id: 0, value: 10, flipped: true, matched: false }}
      onPress={() => {}}
    />,
  );

  rerender(
    <Card
      card={{ id: 0, value: 10, flipped: false, matched: false }}
      onPress={() => {}}
    />,
  );

  rerender(
    <Card
      card={{ id: 0, value: 10, flipped: true, matched: true }}
      onPress={() => {}}
    />,
  );

  rerender(
    <Card
      card={{ id: 0, value: 10, flipped: false, matched: false }}
      onPress={() => {}}
    />,
  );

  jest.advanceTimersByTime(1000);
});
