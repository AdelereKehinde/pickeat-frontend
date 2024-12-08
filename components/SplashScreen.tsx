import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Delay from "@/constants/Delay";
import Logo from '../assets/images/Logo.svg';

interface CustomSplashScreenProps {
  onReady: () => void; // onReady is a function with no arguments and no return value
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onReady }) => {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Delay(4000)
        onReady();
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    prepareApp();
  }, [onReady]);

  return (
    <View className="flex justify-center items-center bg-white w-full h-full">
      <Logo width={200} height={200} />
    </View>
  );
};

export default CustomSplashScreen;
