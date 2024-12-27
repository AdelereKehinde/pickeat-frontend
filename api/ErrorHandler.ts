import axios from 'axios';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Link, router } from "expo-router";

export const getService = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('service'); // Replace 'authToken' with your token key
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

// Handle API errors globally
export const handleError = async (error: any, loginUrl: string = '/vendor/login') => {
  if (axios.isAxiosError(error)) {
    // console.error('Error Response:', error.response?.data || error.message);

    // Check for Unauthorized (401)
    if (error.response?.status === 401) {
      // Alert.alert('Session expired', 'Please log in again.');

      // Clear the token
      await AsyncStorage.removeItem('authToken');
      const service = await getService();
      const login_url = (service? 
        service === 'buyer'? 
          '/login' 
          : 
          '/vendor/login'
        :
        '/login' 
      )
      // Redirect to login screen (if using navigation)
      router.push(login_url)
    }
    // Return the error message for further handling if needed
    throw error.response || new Error(error.message);
  } else {
    throw error;
  }
};