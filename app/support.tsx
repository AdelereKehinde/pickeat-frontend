import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, Pressable, StyleSheet } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import WhatsAPP from '../assets/icon/whatsapp.svg';
import Email from '../assets/icon/email.svg';
import Prompt from '@/components/Prompt';

function Support(){

    const [showPrompt, setShowPrompt] = useState(false)

    const [orderDetail, setOrderDetail] = useState({
        order_time: '09:45am',
        preparation_time: '09:47am',
        assignation_time: '',
        pickup_time: '',
        delivery_time: '',
    })

    return (
        <View className=' bg-gray-100 w-full h-full flex'>
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            {showPrompt && (
                <Prompt main_text='Thank you for choosing PickEat PickIt' sub_text='You’ve confirmed you’ve now collected your order' clickFunction={()=>{setShowPrompt(false)}} />
            )}
            <View style={styles.shadow_box} className='bg-blue-100 w-full'>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>

            <Text
            className='text-custom-green text-[16px] p-4 bg-white'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Support
            </Text>

            <View className='mt-10'>
                <Text
                className='text-gray-600 text-[13px] px-4'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    PickEat PickIt Support
                </Text>
                <Text
                className='text-gray-500 text-[12px] px-4'
                style={{fontFamily: 'Inter-Medium'}}
                >
                    Chat with PickEat PickIt Customer care support
                </Text>

                <Pressable 
                onPress={()=>{setShowPrompt(true)}}
                className='flex flex-row items-center space-x-5 py-1 rounded-lg bg-gray-100 mt-4 border-b border-gray-300 px-4'>
                    <View>
                        <Email />
                    </View>
                    <View>
                        <Text
                        className='text-gray-500 text-[11px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Email Our Support
                        </Text>
                        <Text
                        className='text-custom-green text-[11px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Support@pickeatpickit.com
                        </Text>
                    </View>
                </Pressable>

                <Pressable 
                onPress={()=>{setShowPrompt(true)}}
                className='flex flex-row items-center space-x-5 py-1 rounded-lg bg-gray-100 mt-4 border-b border-gray-300 px-4'>
                    <View>
                        <WhatsAPP />
                    </View>
                    <View>
                        <Text
                        className='text-gray-500 text-[11px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Chat CraftConn Support on Whatsapp
                        </Text>
                        <Text
                        className='text-custom-green text-[11px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            +234 901 2345 678
                        </Text>
                    </View>
                </Pressable>

            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    shadow_box: {
      // iOS shadow properties
      shadowColor: '#1212126a',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      // Android shadow property
      elevation: 100,
    },
  });

export default Support;