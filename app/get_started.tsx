import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Dimensions, StatusBar, ScrollView } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import BG from '../assets/images/unsplash_-GFCYhoRe48.svg';
import Logo from '../assets/images/Logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GetStarted(){
    const {width, height} = Dimensions.get('window')
    
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

                            <Link
                            href="/registration"
                            style={{fontFamily: 'Inter-Regular'}}
                            className='text-center bg-custom-green rounded-xl p-4 w-[90%] self-center mt-10 text-white'
                            >
                                Get Started
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}