// SplashScreen.js
import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>{' '}
      {/* Replace with your app name/logo */}
      <ActivityIndicator size="large" color="#0000ff" />{' '}
      {/* Loading indicator */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Customize the background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SplashScreen;
