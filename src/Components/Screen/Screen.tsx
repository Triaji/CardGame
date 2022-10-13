import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const Screen = (props: Props) => {
  const { children } = props;
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', backgroundColor: '#333' },
});

export default Screen;
