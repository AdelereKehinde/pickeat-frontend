import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert, Image, TextInput, StatusBar, Pressable  } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';


export default function Index(){
    const [isOpen, setIsOpen] = useState(false)
    const [userHover, setUserHover] = useState(false)
    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <View className='flex w-full grow items-center justify-around border'>
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
                    href="/get_started"
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`rounded-2xl bg-gray-100 p-4 border border-custom-green text-custom-green text-center`}>
                        User
                    </Link>

                    <Link 
                    href="/vendor/welcome"
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`rounded-2xl bg-gray-100 p-4 text-custom-green text-center`}>
                        Vendor
                    </Link>
                    
                    <Link 
                    href="/get_started"
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`rounded-2xl bg-gray-100 p-4 text-custom-green text-center`}>
                        Rider
                    </Link>

                    <Link 
                    href="/get_started"
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`rounded-2xl bg-gray-100 p-4 text-custom-green text-center`}>
                        Admin
                    </Link>
                </View>
            </View>
            
        </View>
    )
}