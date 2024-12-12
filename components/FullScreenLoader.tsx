import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const FullScreenLoader = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#4caf50" />
    </View>
  );
};

export default FullScreenLoader;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
