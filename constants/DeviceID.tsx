import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

const DeviceUUID = async () => {
  try {
    // Check if UUID already exists in AsyncStorage
    let deviceUUID = await AsyncStorage.getItem('device_uuid');
    
    if (!deviceUUID) {
      // If UUID doesn't exist, generate a new UUID
      deviceUUID = uuidv4();
      // Store the new UUID
      await AsyncStorage.setItem('device_uuid', deviceUUID as string);
    }

    return deviceUUID as string;

  } catch (error) {
    console.error('Error storing device UUID:', error);
  }
};

export default DeviceUUID;