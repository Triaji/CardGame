/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {setupStore} from '@store/Config';
import GameScreen from '@screens/Game';

const App = () => {
  return (
    <Provider store={setupStore()}>
      <GameScreen />
    </Provider>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000',
  },
});

export default App;
