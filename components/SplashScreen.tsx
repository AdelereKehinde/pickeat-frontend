import React, { useEffect, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Delay from "@/constants/Delay";
import Logo from '../assets/images/Logo.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface CustomSplashScreenProps {
  onReady: () => void; // onReady is a function with no arguments and no return value
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onReady }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
    <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} flex justify-center items-center w-full h-full`}>
      <Logo width={200} height={200} />
    </View>
  );
};

export default CustomSplashScreen;
