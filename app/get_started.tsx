import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Dimensions, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import BG from '../assets/images/unsplash_-GFCYhoRe48.svg';
import Logo from '../assets/images/Logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GetStarted(){
    const {width, height} = Dimensions.get('window')
    const completeOnboarding = async () => {
        // Set a flag to indicate the user has completed onboarding
        await AsyncStorage.setItem('buyerHasVisitedOnboarding', 'true');
        router.replace('/registration');
    };

    return (
        <SafeAreaView>
            <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                <View className=' bg-white w-full h-full flex items-center'>
                    <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                    <View className=''>
                        <BG width={width+8} height={height+8} />
                    </View>
                    <View className='w-full h-full absolute'>

                        <View className='mt-8 self-end -mr-5'>
                            <Logo width={120} height={120} />
                        </View>
                        
                        <View className='p-7 mt-auto mb-16'>
                            <Text 
                            className='text-[28px] text-white'
                            style={{fontFamily: 'Inter-Black', textShadowColor: '#00000024', textShadowRadius: 10}}
                            >
                                Taking Orders for {'\n'} Fast Deliveries
                            </Text>

                            <View className='w-[90%] self-center mt-10 p-4'>
                                <TouchableOpacity
                                onPress={completeOnboarding}
                                className={`text-center bg-custom-green relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                                >
                                    <Text
                                    className='text-white'
                                    style={{fontFamily: 'Inter-Regular'}}
                                    >
                                        Get Started
                                    </Text>
                                                  
                                </TouchableOpacity>
                            </View>
                            {/* <Link
                            href="/registration"
                            style={{fontFamily: 'Inter-Regular'}}
                            className='text-center bg-custom-green rounded-xl p-4 w-[90%] self-center mt-10 text-white'
                            >
                                Get Started
                            </Link> */}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}