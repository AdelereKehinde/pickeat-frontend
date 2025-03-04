import React, { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, StatusBar, Pressable, Image, TouchableOpacity, ScrollView } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from "expo-router";
import { useUser } from '@/context/UserProvider';
import TitleTag from '@/components/Title';
import User from '../../../assets/icon/user.svg'
import History from '../../../assets/icon/history.svg'
import Notification from '../../../assets/icon/notification-green-outline.svg'
import Theme from '../../../assets/icon/theme.svg'
import ToggleOn from '../../../assets/icon/toggle_on.svg'
import ToggleOff from '../../../assets/icon/toggle_off.svg'
import Device from '../../../assets/icon/device.svg'
import Faq from '../../../assets/icon/faq.svg'
import Support from '../../../assets/icon/support.svg'
import Menu from '../../../assets/icon/menu.svg'
import Review from '../../../assets/icon/reviews.svg'
import Earnings from '../../../assets/icon/earnings.svg'
import Logout from '../../../assets/icon/log_out.svg'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function Account(){
    const { user } = useUser();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [showPushNotification, setShowPushNotification] = useState(false)
    const isNavFocused = useIsFocused();
    useEffect(() => {
        const checkPushNotification = async () => {
          const pushNoti = await AsyncStorage.getItem('pushNotification');
          if (pushNoti){
            setShowPushNotification(eval(pushNoti)); // Show onboarding if the key doesn't exist
          }
        };
        checkPushNotification();
    }, [isNavFocused]);

    const TogglePushNotifi = async () => {
        // Set a flag to indicate the user has completed onboarding
        if (showPushNotification){
            await AsyncStorage.setItem('pushNotification', 'false');
        }else{
            await AsyncStorage.setItem('pushNotification', 'true');
        }
        setShowPushNotification(!showPushNotification)
    };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-50'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={false} title='Profile' withbell={false} />
                </View>
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full py-5 relative flex items-center justify-center`}>
                        <View className='w-24 h-24 overflow-hidden rounded-full'>
                            <Image 
                            source={{uri: user?.avatar}}
                            className='w-24 h-24'
                            />
                        </View>
                        <Text
                        className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} text-xl`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            {user?.first_name} {user?.last_name}
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
                            {user?.phone_number || "No number"}
                        </Text>
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full pt-3`}>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/rider/profile_page"))}}
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
                            onPress={()=>{(router.push("/rider/earnings"))}}
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
                            onPress={()=>{}}
                            className='flex flex-row w-full items-center'
                            >
                                <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} w-10 h-10 flex items-center justify-around rounded-full`}>
                                    <Notification />
                                </View>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}} 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[12px] font-medium ml-5`}
                                >
                                    Push up notifications
                                </Text>
                                <TouchableOpacity
                                onPress={TogglePushNotifi}
                                className='ml-auto'
                                >
                                    {showPushNotification?
                                    <ToggleOn width={40} />
                                    :
                                    <ToggleOff width={40} />
                                    }
                                    
                                </TouchableOpacity>
                            </Pressable>
                        </View>
                        <View className='w-full px-5 my-1'>
                            <Pressable
                            onPress={()=>{(router.push("/rider/settings"))}}
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
                        onPress={()=>{router.replace('/rider/login')}}
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