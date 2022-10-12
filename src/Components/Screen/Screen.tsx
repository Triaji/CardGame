import React from 'react';
import {View, SafeAreaView} from 'react-native';

type Props = {
  children: React.ReactNode;
};

const Screen = (props: Props) => {
  const {children} = props;
  return (
    <SafeAreaView
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#333'}}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
