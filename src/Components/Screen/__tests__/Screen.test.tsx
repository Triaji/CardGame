import React from 'react';
import { Text } from 'react-native';
import Screen from '../Screen';
import renderer from 'react-test-renderer';

describe('ScreenComponent', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Screen>
          <Text>Test</Text>
        </Screen>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
