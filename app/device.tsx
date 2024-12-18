import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <SafeAreaView>
            <View className=' bg-gray-100 w-full h-full flex'>
                <StatusBar barStyle="light-content" backgroundColor="#228B22" />
                <View className='bg-blue-100 w-full'>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className='text-custom-green text-[16px] p-4 bg-white'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Device and Sessions
                    </Text>

                    
                    <View 
                    style={styles.shadow_box}
                    className='mt-10 bg-white m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl'
                    >
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
                </ScrollView>
            </View>
        </SafeAreaView>
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

export default Device;