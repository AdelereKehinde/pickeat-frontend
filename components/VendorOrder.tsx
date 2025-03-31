import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { Link, router, useGlobalSearchParams } from "expo-router";
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import Time from '../assets/icon/time.svg';
import Location from '../assets/icon/location.svg';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
    id: number;
    image:string,
    name: string,
    time: string,
    address: string,
    status: string,
    items: number,
    status_history_status: string;
    order_id: string;
    onUpdate: (order_id: string, status: string, status_history_status: string) => void
  }


const VendorOrder: React.FC<Properties> = ({id, image, name, address, time, status, items, status_history_status, order_id, onUpdate}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false); // Loading state
    const STATUS_HISTORY_STATUS = ['', 'accepted', 'preparing', 'ready', 'shipped', 'cancelled', 'completed']
    const [STS, setSTS] = useState(status_history_status); // Loading state

    return(
        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} flex flex-row  items-center rounded-lg mx-2 px-2 py-2`}>
            <View className=''>    
                <Image 
                source={{uri: image}}
                className='border rounded-lg'
                width={55}
                height={70}
                />
                {((items - 1) != 0) && (
                    <View className={`bg-white left-[25px] top-[45px] w-[30px] h-[20px] rounded-full absolute flex justify-around items-center`}>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`text-custom-green text-[11px]`}
                        >
                            +{items - 1}
                        </Text>
                    </View>
                )}
            </View>

            <View className='flex justify-start ml-2 w-[45%]'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[12px]`}
                >
                    {name}
                </Text>
                <View className='flex flex-row items-center mt-2'>
                    <Location />
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[10px]`}
                    >
                        {address}
                    </Text>
                </View>
                <View className='flex flex-row items-center mt-2'>
                    <Time />
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-custom-green text-[10px] ml-1'
                    >
                       {time}
                    </Text>
                </View>
            </View>
            <View className='ml-auto'>
                <TouchableOpacity 
                onPress={()=>{router.push(`/vendor/order_details?id=${id}`)}}
                className='bg-custom-green rounded-md py-1 px-4 flex items-center'
                >
                    <Text
                        className='text-white text-[11px]'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            View
                    </Text>
                    {(loading) && (
                        <View className='absolute w-full top-[4px] '>
                            <ActivityIndicator size="small" color="#6b7280" />
                        </View> 
                    )}
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

export default VendorOrder;