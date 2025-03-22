import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, Pressable, Image, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
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
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full`}>
                    <TitleTag withprevious={false} title='Profile' withbell={false} />
                </View>
                
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
                            {user?.full_name || 'No full name'}
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

                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full pt-3`}>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/vendor/profile_page"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <User />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Profile
                                </Text>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/vendor/menu"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Menu />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Menu
                                </Text>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
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
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/vendor/order_history"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <History />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Order History
                                </Text>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/vendor/settings"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <FontAwesome name="cogs" size={20} color="#228b22" />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Settings
                                </Text>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/vendor/earnings"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Earnings />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Earnings and Payment
                                </Text>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
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
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/vendor/reviews"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Review />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Review and Ratings
                                </Text>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/support"))}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Support />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Support
                                </Text>
                            </Pressable>
                        </View>

                        <Pressable
                        onPress={()=>{router.replace('/vendor/login')}}
                        className={`mb-5 text-center bg-custom-green rounded-xl p-4 w-[90%] self-center mt-7 text-white flex flex-row items-center`}
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