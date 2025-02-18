import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert, Image, TextInput, StatusBar, Pressable  } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';
import CustomSplashScreen from '@/components/SplashScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function Index(){
    const [isOpen, setIsOpen] = useState(false)
    const [userHover, setUserHover] = useState(false)
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
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

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
                        <Link 
                        href={showBuyerOnboarding? "/get_started" : "/login"}
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`rounded-2xl bg-gray-100 p-4 border border-custom-green text-custom-green text-center`}>
                            User
                        </Link>

                        <Link 
                        href={showSellerOnboarding? "/vendor/welcome" : "/vendor/login"}
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`rounded-2xl bg-gray-100 p-4 border border-custom-green text-custom-green text-center`}>
                            Vendor
                        </Link>
                        
                        {/* <Link 
                        href="/get_started"
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`rounded-2xl bg-gray-100 p-4 border border-custom-green text-custom-green text-center`}>
                            Rider
                        </Link> */}

                        <Link 
                        href={"/admin/login" as any}
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`rounded-2xl bg-gray-100 p-4 border border-custom-green text-custom-green text-center`}>
                            Admin
                        </Link> 
                    </View>
                </View>
                
            </View>
        </SafeAreaView>
    )
}