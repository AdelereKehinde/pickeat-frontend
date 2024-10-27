import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';


export default function Account(){
    const [userData, setUserData] = useState({
        'name': 'James Sussy Milburn',
        'email': 'sussyjames@outlook.com',
        'phone_number': '+2349063287855'
    })
    return (
        <View className=' bg-gray-50 w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={false} title='Search' withbell={true} />
            
            <View className='bg-gray-100 w-full my-3 py-4 relative flex items-center justify-center'>
                <View className='w-24 h-24 overflow-hidden rounded-full'>
                    <Image 
                    source={require('../../assets/images/image22.jpg')}
                    className='w-24 h-24'
                    />
                </View>
                <Text
                className='text-2xl'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    {userData.name}
                </Text>
                <Text
                className='text-[13px] text-gray-500'
                style={{fontFamily: 'Inter-Medium'}}
                >
                    {userData.email}
                </Text>
                <Text
                className='text-[12px] text-custom-green'
                style={{fontFamily: 'Inter-Medium'}}
                >
                    {userData.phone_number}
                </Text>
            </View>
            <View>
                
            </View>
        </View>
    )
}