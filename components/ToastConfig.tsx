// CustomToast.js

import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast } from 'react-native-toast-message';

const CustomToast = (props:any) => {
    let backgroundColor = 'white'; // Default background color
    let borderColor = 'green'; // Default border color
    switch (props.type) {
        case 'error':
          backgroundColor = '#f8d7da'; // Light red background for errors
          borderColor = 'red'; // Red border for errors
          break;
        case 'success':
          backgroundColor = '#d4edda'; // Light green background for success
          borderColor = 'green'; // Green border for success
          break;
        case 'info':
          backgroundColor = '#d1ecf1'; // Light blue background for info
          borderColor = '#0c5460'; // Dark blue border for info
          break;
        default:
          break;
    }
  return (
    <BaseToast
      {...props}
      style={[styles.toast, { backgroundColor, borderLeftColor: borderColor }]}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
    />
  );
};

const styles = StyleSheet.create({
  toast: {
    borderLeftWidth: 4,
    borderRadius: 5,
    padding: 10,
  },
  text1: {
    fontFamily: 'Inter-Regular', // Replace with your custom font family
    fontSize: 13,
    color: '#000',
  },
  text2: {
    fontFamily: 'Inter-Regular', // Replace with your custom font family
    fontSize: 11,
    color: '#666',
  },
});

export default CustomToast;
