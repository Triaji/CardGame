import { Animated } from 'react-native';
import { jest } from '@jest/globals';

Animated.timing = () => ({
  start: () => jest.fn(),
  spring: () => jest.fn(),
});

Animated.sequence = () => jest.fn();
Animated.spring = () => jest.fn();
