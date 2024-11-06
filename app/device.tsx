import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, Pressable, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';

function Device(){

    const [showPrompt, setShowPrompt] = useState(false)

    const [devices, setDevices] = useState([
        {   
            id: 1,
            name: 'iPhone XS Max',
            now: true,
            last_seen: ''
        },
        {
            id: 2,
            name: 'Samsung S20',
            now: false,
            last_seen: 'Yesterday , 5:20pm'
        },
    ])

    return (
        <View className=' bg-gray-100 w-full h-full flex'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-gray-100 w-full'>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>

            <Text
            className='text-custom-green text-[16px] p-4 bg-white'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Device and Sessions
            </Text>

            
            <View className='mt-10 bg-white m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl'>
                {devices.map((item) => (
                    <View 
                    key={item.id}
                    className='flex  py-3 rounded-lg border-b border-gray-200'>
                        <Text
                        className={` ${item.now? 'text-custom-green': 'text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            {item.name}
                        </Text>
                        <Text
                        className='text-gray-500 text-[11px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Last seen - {(item.now)? <Text className='text-custom-green'>NOW</Text> : <Text>{item.last_seen}</Text> }
                        </Text>
                    </View>
                ))}
            </View>
            
        </View>
    )
}

export default Device;