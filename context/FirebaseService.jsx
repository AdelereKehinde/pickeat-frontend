import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Request permission for notifications
export async function requestPushNotificationUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Push Notification permission granted.');
    return getToken();
  } else {
    Alert.alert('Push Notification Permission Denied');
  }
}

// Get FCM Token
async function getToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
}

// Handle incoming notifications
export function setupPushNotificationListeners() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open:', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('New FCM message received:', remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
}
