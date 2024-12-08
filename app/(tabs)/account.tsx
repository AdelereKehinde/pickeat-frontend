import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, Pressable, Image, TouchableOpacity } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import User from '../../assets/icon/user.svg'
import History from '../../assets/icon/history.svg'
import Wallet from '../../assets/icon/wallet.svg'
import Theme from '../../assets/icon/theme.svg'
import Device from '../../assets/icon/device.svg'
import Faq from '../../assets/icon/faq.svg'
import Support from '../../assets/icon/support.svg'
import Logout from '../../assets/icon/log_out.svg'

export default function Account(){
    const [userData, setUserData] = useState({
        'name': 'James Sussy Milburn',
        'email': 'sussyjames@outlook.com',
        'phone_number': '+2349063287855'
    })
    return (
        <View className=' bg-gray-50 w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={false} title='Profile' withbell={false} />
            
            <View className='bg-gray-100 w-full py-4 relative flex items-center justify-center'>
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

            <View className='w-full bg-white pt-3'>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{(router.push("/profile_page"))}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <User />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            Profile
                        </Text>
                    </Pressable>
                </View>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{(router.push("/booking_history"))}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <History />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            Booking History
                        </Text>
                    </Pressable>
                </View>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{(router.push("/wallet_page"))}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <Wallet />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            Wallet
                        </Text>
                    </Pressable>
                </View>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{alert('clicked')}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <Theme />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            Dark Theme
                        </Text>
                    </Pressable>
                </View>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{(router.push("/device"))}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <Device />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            Device and session
                        </Text>
                    </Pressable>
                </View>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{alert('clicked')}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <Faq />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            FAQ
                        </Text>
                    </Pressable>
                </View>
                <View className='w-full px-5 my-1'>
                    <Pressable
                    onPress={()=>{(router.push("/support"))}}
                    className='flex flex-row w-full items-center'
                    >
                        <View className='w-10 h-10 flex items-center justify-around rounded-full bg-gray-100'>
                            <Support />
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}} 
                        className='text-[12px] text-gray-700 font-medium ml-5'
                        >
                            Support
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                onPress={()=>{alert('Logged out')}}
                className={`text-center bg-custom-green rounded-xl p-4 w-[90%] self-center mt-7 text-white flex flex-row items-center`}
                >
                    <Text
                    style={{fontFamily: 'Inter-Medium'}} 
                    className='text-[14px] text-white font-medium grow text-center'
                    >
                        Log out
                    </Text>
                    <View className='absolute right-5'>
                        <Logout />
                    </View>
              </Pressable>
            </View>
        </View>
    )
}