import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'
import { UserProvider } from "@/context/UserProvider";

NativeWindStyleSheet.setOutput({
  default: "native",
})

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Medium-Italic': require('../assets/fonts/Inter-MediumItalic.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
  })
  useEffect(()=>{
    if(loaded || error){
      SplashScreen.hideAsync();
    }
  }, [loaded, error])

  if(!loaded && !error){
    return null
  }

  return (
    <UserProvider>
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
        <Stack.Screen name="vendor/order_history" options={{headerShown: false}} />
        <Stack.Screen name="vendor/menu" options={{headerShown: false}} />
        <Stack.Screen name="vendor/create_product" options={{headerShown: false}} />
        <Stack.Screen name="vendor/earnings" options={{headerShown: false}} />
        <Stack.Screen name="vendor/reviews" options={{headerShown: false}} />
      </Stack>
    </UserProvider>
  );
}
