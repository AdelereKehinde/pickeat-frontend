import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect, useContext, useState, useRef } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'
import { UserProvider } from "@/context/UserProvider";
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { ConnectionContext, ConnectionProvider } from "@/context/ConnectionProvider";
import { Platform, } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import getOrCreateDeviceUUID from "@/constants/GetORCreateDeviceUUID";
import ENDPOINTS from "@/constants/Endpoint";
import { postRequest } from "@/api/RequestHandler";
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  // alert(errorMessage);
  console.log("push token error", errorMessage)
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      await postRequest(
        ENDPOINTS['account']['push-notification'],
        {
          'push_token': pushTokenString,
          'project_id': projectId
        },
        true
      );
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

NativeWindStyleSheet.setOutput({
  default: "native",
})


export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Medium-Italic': require('../assets/fonts/Inter-MediumItalic.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-SemiBold-Italic': require('../assets/fonts/Inter-SemiBoldItalic.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
  })

  useEffect(()=>{
    if(loaded || error){
      SplashScreen.hideAsync();
    }
  }, [loaded, error])

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if(!loaded && !error){
    return null
  }

  return (
    <ConnectionProvider>
      <UserProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 

            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="get_started" options={{headerShown: false}} />
            <Stack.Screen name="registration" options={{headerShown: false}} />
            <Stack.Screen name="login" options={{headerShown: false}} />
            <Stack.Screen name="enter_code" options={{headerShown: false}} />
            <Stack.Screen name="complete_profile" options={{headerShown: false}} />
            <Stack.Screen name="complete_profile_2" options={{headerShown: false}} />
            <Stack.Screen name="special_offer" options={{headerShown: false}} />
            <Stack.Screen name="kitchen_page" options={{headerShown: false}} />
            <Stack.Screen name="kitchen_product" options={{headerShown: false}} />
            <Stack.Screen name="booking_history" options={{headerShown: false}} />
            <Stack.Screen name="track_order" options={{headerShown: false}} />
            <Stack.Screen name="support" options={{headerShown: false}} />
            <Stack.Screen name="device" options={{headerShown: false}} />
            <Stack.Screen name="confirm_order" options={{headerShown: false}} />
            <Stack.Screen name="wallet_page" options={{headerShown: false}} />
            <Stack.Screen name="add_card" options={{headerShown: false}} />
            <Stack.Screen name="payment" options={{headerShown: false}} />
            <Stack.Screen name="payment_confirmation" options={{headerShown: false}} />
            <Stack.Screen name="profile_page" options={{headerShown: false}} />
            <Stack.Screen name="notification" options={{headerShown: false}} />
            <Stack.Screen name="kitchen_profile" options={{headerShown: false}} />
            <Stack.Screen name="chat" options={{headerShown: false}} />
            <Stack.Screen name="set_delivery_address" options={{headerShown: false}} />
            <Stack.Screen name="paystack_webview" options={{headerShown: false}} />

            {/* VENDOR */}
            <Stack.Screen name="vendor/(tabs)" options={{ headerShown: false }} />  

            <Stack.Screen name="vendor/welcome" options={{headerShown: false}} />
            <Stack.Screen name="vendor/create_profile" options={{headerShown: false}} />
            <Stack.Screen name="vendor/list_services" options={{headerShown: false}} />
            <Stack.Screen name="vendor/set_availability" options={{headerShown: false}} />
            <Stack.Screen name="vendor/receive_food_order" options={{headerShown: false}} />
            <Stack.Screen name="vendor/get_started" options={{headerShown: false}} />
            <Stack.Screen name="vendor/all_set" options={{headerShown: false}} />
            <Stack.Screen name="vendor/signup" options={{headerShown: false}} />
            <Stack.Screen name="vendor/enter_code" options={{headerShown: false}} />
            <Stack.Screen name="vendor/login" options={{headerShown: false}} />
            <Stack.Screen name="vendor/forgot_password" options={{headerShown: false}} />
            <Stack.Screen name="vendor/confirm_pin" options={{headerShown: false}} />
            <Stack.Screen name="vendor/reset_password" options={{headerShown: false}} />
            <Stack.Screen name="vendor/account_setup_1" options={{headerShown: false}} />
            <Stack.Screen name="vendor/account_setup_2" options={{headerShown: false}} />
            <Stack.Screen name="vendor/account_setup_3" options={{headerShown: false}} />
            <Stack.Screen name="vendor/account_setup_4" options={{headerShown: false}} />
            <Stack.Screen name="vendor/order_history" options={{headerShown: false}} />
            <Stack.Screen name="vendor/menu" options={{headerShown: false}} />
            <Stack.Screen name="vendor/create_product" options={{headerShown: false}} />
            <Stack.Screen name="vendor/earnings" options={{headerShown: false}} />
            <Stack.Screen name="vendor/reviews" options={{headerShown: false}} />
            <Stack.Screen name="vendor/chat_page" options={{headerShown: false}} />
            <Stack.Screen name="vendor/set_store_address" options={{headerShown: false}} />
            <Stack.Screen name="vendor/profile_page" options={{headerShown: false}} />
            <Stack.Screen name="vendor/order_details" options={{headerShown: false}} />
            <Stack.Screen name="vendor/transaction_pin" options={{headerShown: false}} />
            <Stack.Screen name="vendor/reset_transaction_pin" options={{headerShown: false}} />
            <Stack.Screen name="vendor/payment_info" options={{headerShown: false}} />
            <Stack.Screen name="vendor/settings" options={{headerShown: false}} />
            <Stack.Screen name="vendor/handbook" options={{headerShown: false}} />

            {/* ADMIN */}
            <Stack.Screen name="admin/(drawer)" options={{headerShown: false}} />
            <Stack.Screen name="admin/login" options={{headerShown: false}} />
            <Stack.Screen name="admin/user_details" options={{headerShown: false}} />
            <Stack.Screen name="admin/vendor_details" options={{headerShown: false}} />
            <Stack.Screen name="admin/rider_details" options={{headerShown: false}} />
            <Stack.Screen name="admin/view_delivery_address" options={{headerShown: false}} />
            <Stack.Screen name="admin/view_store_address" options={{headerShown: false}} />
            <Stack.Screen name="admin/vendor_menu" options={{headerShown: false}} />
            <Stack.Screen name="admin/meal_detail" options={{headerShown: false}} />
            <Stack.Screen name="admin/suspended" options={{headerShown: false}} />
            <Stack.Screen name="admin/order_details" options={{headerShown: false}} />
            <Stack.Screen name="admin/payout" options={{headerShown: false}} />
            <Stack.Screen name="admin/payout_details" options={{headerShown: false}} />


            {/* RIDER */}
            <Stack.Screen name="rider/(tabs)" options={{ headerShown: false }} />  
            <Stack.Screen name="rider/welcome" options={{headerShown: false}} />
            <Stack.Screen name="rider/welcome2" options={{headerShown: false}} />
            <Stack.Screen name="rider/welcome3" options={{headerShown: false}} />
            <Stack.Screen name="rider/login" options={{headerShown: false}} />
            <Stack.Screen name="rider/signup" options={{headerShown: false}} />
            <Stack.Screen name="rider/verification_code" options={{headerShown: false}} />
            <Stack.Screen name="rider/create_profile" options={{headerShown: false}} />
            <Stack.Screen name="rider/create_profile_2" options={{headerShown: false}} />
            <Stack.Screen name="rider/create_profile_3" options={{headerShown: false}} />
            <Stack.Screen name="rider/identity_verification" options={{headerShown: false}} />
            <Stack.Screen name="rider/availability" options={{headerShown: false}} />
            <Stack.Screen name="rider/all_set" options={{headerShown: false}} />
            <Stack.Screen name="rider/order_detail" options={{headerShown: false}} />
            <Stack.Screen name="rider/earnings" options={{headerShown: false}} />
            <Stack.Screen name="rider/profile_page" options={{headerShown: false}} />
            <Stack.Screen name="rider/settings" options={{headerShown: false}} />
            <Stack.Screen name="rider/handbook" options={{headerShown: false}} />
            <Stack.Screen name="rider/transaction_pin" options={{headerShown: false}} />
            <Stack.Screen name="rider/reset_transaction_pin" options={{headerShown: false}} />
            <Stack.Screen name="rider/payment_info" options={{headerShown: false}} />
            
          </Stack>
        </ThemeProvider>
      </UserProvider>
    </ConnectionProvider>
  );
}
