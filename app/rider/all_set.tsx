import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Set from '../../assets/icon/all_set.svg';
import MsgIcon from '../../assets/icon/message-icon.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function RiderAllSet(){
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
      <SafeAreaView>
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center px-3`}
        >
            <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className='mr-5 mt-10 ml-auto'>
                    <MsgIcon />
                </View>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-lg mt-5 mx-auto`}
                >
                    You’re all set up
                </Text>

                <View className='mt-5 mx-auto'>
                    <Set />
                </View>

                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} mt-2 text-[14px] text-center leading-5`}
                >
                    We’ll notify you via mail or text message when your application has been approved.
                </Text>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} p-3 rounded-2xl mt-auto`}>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[14px] text-start mt-auto leading-5`}
                    >
                        Only reach out to our support team if:{`\n`} {`\n`}
                        {`    `} - You don’t get a mail from us after 7 days. {`\n`} 
                        {`    `} - You need to change any details you need
                    </Text>
                </View>

                <View className='w-[90%] mx-auto mb-16 mt-3'>
                    <TouchableOpacity
                    onPress={()=>{router.push('/rider/(tabs)/home')}}
                    className={`text-center bg-custom-green relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                    >
                    <Text
                    className='text-white'
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                        Done
                    </Text>
                        
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
      </SafeAreaView>
    )
}