import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity, Alert, Image, TextInput, StatusBar, Pressable  } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';
import CustomSplashScreen from '@/components/SplashScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { router, useGlobalSearchParams } from 'expo-router';

export default function Index(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isAppReady, setAppReady] = useState(false);

    const [showSellerOnboarding, setShowSellerOnboarding] = useState(false)
    const [showBuyerOnboarding, setShowBuyerOnboarding] = useState(false);
    const [showRiderOnboarding, setShowRiderOnboarding] = useState(false);
    const [showAdminOnboarding, setShowAdminOnboarding] = useState(false);

    const isNavFocused = useIsFocused();
    useEffect(() => {
        const checkOnboarding = async () => {
          const sellerHasVisited = await AsyncStorage.getItem('sellerHasVisitedOnboarding');
          const buyerHasVisited = await AsyncStorage.getItem('buyerHasVisitedOnboarding');
          const riderHasVisited = await AsyncStorage.getItem('riderHasVisitedOnboarding');
          const adminHasVisited = await AsyncStorage.getItem('adminHasVisitedOnboarding');
          setShowSellerOnboarding(!sellerHasVisited); // Show onboarding if the key doesn't exist
          setShowBuyerOnboarding(!buyerHasVisited); // Show onboarding if the key doesn't exist
          setShowRiderOnboarding(!riderHasVisited); // Show onboarding if the key doesn't exist
          setShowAdminOnboarding(!adminHasVisited); // Show onboarding if the key doesn't exist
        };
        checkOnboarding();
    }, [isNavFocused]);

    if (!isAppReady) {
        return <CustomSplashScreen onReady={() => setAppReady(true)} />;
    }
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                
                <View className='flex w-full grow items-center justify-around'>
                    <View className='flex items-center'>
                        <Logo width={200} height={200} />

                        <Text
                        style={{fontFamily: 'Inter-Black'}}
                        className='text-custom-green text-lg -mt-8'
                        >
                            PickEAT PickIT
                        </Text>
                    </View>
                    
                    <View className='w-[80%] space-y-6 -mt-14'>
                        <TouchableOpacity 
                        onPress={async()=>{router.push((showBuyerOnboarding)? '/get_started' : '/login'); await AsyncStorage.setItem('service', 'buyer');}} 
                        // href={showBuyerOnboarding? "/get_started" : "/login"}
                        className={`${theme == 'dark'? 'bg-gray-800  border-gray-500' : '  bg-gray-100 border-custom-green'} rounded-2xl p-4 border`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-custom-green text-center'
                            >
                                User
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={async()=>{router.push((showSellerOnboarding)? '/vendor/welcome' : '/vendor/login'); await AsyncStorage.setItem('service', 'vendor');}} 
                        className={`${theme == 'dark'? 'bg-gray-800  border-gray-500' : '  bg-gray-100 border-custom-green'} rounded-2xl p-4 border text-custom-green text-center`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-custom-green text-center'
                            >
                                Vendor
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                        onPress={async()=>{router.push((showRiderOnboarding)? '/rider/welcome' : '/rider/login'); await AsyncStorage.setItem('service', 'rider');}} 
                        className={`${theme == 'dark'? 'bg-gray-800  border-gray-500' : '  bg-gray-100 border-custom-green'} rounded-2xl p-4 border text-custom-green text-center`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-custom-green text-center'
                            >
                                Rider
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={async()=>{router.push('/admin/login'); await AsyncStorage.setItem('service', 'admin');}} 
                        className={`${theme == 'dark'? 'bg-gray-800  border-gray-500' : '  bg-gray-100 border-custom-green'} rounded-2xl p-4 border text-custom-green text-center`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-custom-green text-center'
                            >
                                Admin
                            </Text>
                        </TouchableOpacity> 
                    </View>
                </View>
                
            </View>
        </SafeAreaView>
    )
}