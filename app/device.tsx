import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import FullScreenLoader from '@/components/FullScreenLoader';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';


function Device(){
    const [showPrompt, setShowPrompt] = useState(false)
    const [loading, setLoading] = useState(true)
    const { theme, toggleTheme } = useContext(ThemeContext);

    type devicesType = { id: number; device_name: string; device_type: string; last_active: string; ip_address: string; now: boolean};
    const [devices, setDevices] = useState<devicesType[]>([])

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                setDevices([])
                const response = await getRequest<devicesType[]>(`${ENDPOINTS['account']['list-devices']}`, true);
                // alert(JSON.stringify(response))
                setLoading(false)
                setDevices(response)
            } catch (error) {
                setLoading(false) 
                // alert(JSON.stringify(error));
            } 
        };
    
    fetchMeals(); 
    }, []); // Empty dependency array ensures this runs once

    return (
        <SafeAreaView className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'}`}>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>
                {loading && (
                    <FullScreenLoader />
                )}
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} text-custom-green text-[16px] p-4`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Device and Sessions
                    </Text>

                    
                    <View 
                    style={styles.shadow_box}
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} mt-10 m-3 w-[90%] mx-auto p-4 rounded-lg shadow-2xl`}
                    >
                        {loading && 
                            <View className='flex space-y-2 px-2 overflow-hidden'>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-200'} border-b pb-2`}>
                                        <ContentLoader
                                        width="90%"
                                        height={50}
                                        backgroundColor={(theme == 'dark')? '#111827':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            {/* <Rect x="10" y="10" rx="5" ry="5" width="130" height="15" />
                                            <Rect x="10" y="40" rx="5" ry="5" width="100" height="15" /> */}
                                            <Rect x="0" y="10" rx="5" ry="5" width="60" height="15" />
                                            <Rect x="0" y="35" rx="5" ry="5" width="90" height="15" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }

                        {devices.map((item) => (
                            <View 
                            key={item.id}
                            className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-200'} flex  py-3 rounded-lg border-b`}>
                                <Text
                                className={` ${item.now? 'text-custom-green': (theme == 'dark')? 'text-gray-200' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {item.device_name}
                                </Text>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Last seen - {(item.now)? <Text className='text-custom-green'>NOW</Text> : <Text>{item.last_active}</Text> }
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