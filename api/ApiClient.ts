import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token'); // Replace 'authToken' with your token key
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

const apiClient = axios.create({
  baseURL: 'https://a8eb-102-91-102-105.ngrok-free.app/api/v1/', 
  // baseURL: 'https://pickeat-backend.onrender.com/api/v1/',
  // timeout: 10000,
  // headers: { 
  //   'Content-Type': 'multipart/form-data',
  // },
});

// Function to attach token for authenticated requests
const setAuthHeaders = async (headers: Record<string, string>) => {
  const token = await getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
};

export default apiClient;
export { setAuthHeaders };
