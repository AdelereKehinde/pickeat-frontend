import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid';

// Generate a random UUID or retrieve from AsyncStorage if it exists
const getOrCreateDeviceUUID = async () => {
  try {
    // Check if the device UUID already exists in AsyncStorage
    let deviceUUID = await AsyncStorage.getItem('device_uuid');

    if (!deviceUUID) {
      // If the UUID doesn't exist, generate a new one
      deviceUUID = UUID.v4();
      
      // Save the newly generated UUID to AsyncStorage
      await AsyncStorage.setItem('device_uuid', deviceUUID);
      console.log('Generated new device UUID:', deviceUUID);
    } else {
      console.log('Found existing device UUID:', deviceUUID);
    }

    return deviceUUID;
  } catch (error) {
    console.error('Error getting or creating device UUID:', error);
    return null;
  }
};

export default getOrCreateDeviceUUID;