import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';
import ENDPOINTS from '@/constants/Endpoint';
import { postRequest } from '@/api/RequestHandler';
import getOrCreateDeviceUUID from '@/constants/GetORCreateDeviceUUID';


const PushNotificationComponent: React.FC = () => {
    const [UUID, setUUID] = useState<string | null>();

    const getUUID = async () =>{
        const uuid = await getOrCreateDeviceUUID()
        setUUID(uuid)
    }

    useEffect(() => {
        // Request permissions for push notifications
        const requestPermission = async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            // Alert.alert('Permission Denied', 'Failed to get push token for push notifications!');
            return;
        }

        // Get FCM token (for physical devices only)
        if (Device.isDevice) {
            try {
            const tokenResponse = await Notifications.getDevicePushTokenAsync();
            console.log('FCM Token:', tokenResponse.data);

            // Send this token to your backend (Django)
            sendTokenToBackend(tokenResponse.data);
            } catch (error) {
            console.error('Error getting token:', error);
            //   Alert.alert('Error', 'Failed to get device token');
            }
        } else {
            console.error('Physical Device Required', 'Must use physical device for Push Notifications');
            // Alert.alert('Physical Device Required', 'Must use physical device for Push Notifications');
        }
        };

        getUUID()
        requestPermission();
    }, []);

    // Function to send FCM token to your Django backend
    const sendTokenToBackend = async (token: string) => {
        try {
            const res = await postRequest(ENDPOINTS['account']['push-notification'], {
                'uuid': UUID,
                'push_token': token,
            }, true);

        console.log('Token sent to backend:', res);
        } catch (error) {
        console.error('Error sending token to backend:', error);
        }
    };

    // No return statement needed since the component does not render anything
    return null;
};

export default PushNotificationComponent;
