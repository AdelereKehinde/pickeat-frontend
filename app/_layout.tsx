import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'

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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 

      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="get_started" options={{headerShown: false}} />
      <Stack.Screen name="registration" options={{headerShown: false}} />
      <Stack.Screen name="enter_code" options={{headerShown: false}} />
      <Stack.Screen name="complete_profile" options={{headerShown: false}} />
      <Stack.Screen name="complete_profile_2" options={{headerShown: false}} />
      <Stack.Screen name="special_offer" options={{headerShown: false}} />
      <Stack.Screen name="kitchen_page" options={{headerShown: false}} />
      <Stack.Screen name="kitchen_product" options={{headerShown: false}} />
      <Stack.Screen name="booking_history" options={{headerShown: false}} />
      <Stack.Screen name="track_order" options={{headerShown: false}} />
    </Stack>
  );
}
