import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, Pressable, Image, ScrollView } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { Link } from "expo-router";
import { useUser } from '@/context/UserProvider';
import TitleTag from '@/components/Title';
import User from '../../../assets/icon/user.svg'
import History from '../../../assets/icon/history.svg'
import Wallet from '../../../assets/icon/wallet.svg'
import Theme from '../../../assets/icon/theme.svg'
import Device from '../../../assets/icon/device.svg'
import Faq from '../../../assets/icon/faq.svg'
import Support from '../../../assets/icon/support.svg'
import Menu from '../../../assets/icon/menu.svg'
import Review from '../../../assets/icon/reviews.svg'
import Earnings from '../../../assets/icon/earnings.svg'
import Logout from '../../../assets/icon/log_out.svg'
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function Account(){
    const { user } = useUser();
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-50'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full py-4 relative flex items-center justify-center`}>
                        <View className='w-24 h-24 overflow-hidden rounded-full'>
                            <Image 
                            source={{uri: user?.avatar}}
                            className='w-24 h-24'
                            />
                        </View>
                        <Text
                        className={`${theme == 'dark'? 'text-white' : ' text-gray-900'} text-2xl`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            {user?.first_name || 'No full name'} {user?.last_name || 'No full name'}
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[13px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {user?.email || "No email"}
                        </Text>
                        <Text
                        className='text-[12px] text-custom-green'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {user?.phone_number || "no number"}
                        </Text>
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} grow w-full pt-3`}>
                        
                        <View className='w-full px-5 my-2'>
                            <Pressable
                            onPress={toggleTheme}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Theme />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Dark Theme
                                </Text>
                            </Pressable>
                        </View>
                        
                        <View className='w-full px-5 my-2'>
                            <Pressable
                            onPress={()=>{(router.push("/device"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Device />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Device and session
                                </Text>
                            </Pressable>
                        </View>

                        <Pressable
                        onPress={()=>{router.replace('/vendor/login')}}
                        className={`mb-10 text-center bg-custom-green rounded-xl p-4 w-[90%] self-center mt-auto text-white flex flex-row items-center`}
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
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}