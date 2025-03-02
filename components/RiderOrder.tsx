import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import ChevronNext from '../assets/icon/chevron-next.svg';
import Location from '../assets/icon/location.svg';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { Link, router } from "expo-router";

interface Properties {
    image:string,
    name: string,
    time: string,
    address: string,
    task_id: number;
  }


const RiderOrder: React.FC<Properties> = ({image, name, address, time, task_id}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);

    return(
        <View className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-300'} flex flex-row  items-center px-5 py-2 border-b`}>
            <View className=''>    
                <Image 
                source={{uri: image}}
                className='border rounded-lg'
                width={55}
                height={70}
                />
            </View>

            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[12px]`}
                >
                    {name}
                </Text>
                <View className='flex flex-row items-center'>
                    <Location />
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[10px]`}
                    >
                        {address}
                    </Text>
                </View>
                <View className='flex flex-row items-center mt-2'>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-900'} text-[11px] ml-1'`}
                    >
                       Time:
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-custom-green text-[11px] ml-1'
                    >
                       {time}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
            onPress={()=>{
                router.push({
                    pathname: '/rider/order_detail',
                    params: { task_id: task_id},
                }); 
            }}
            className='ml-auto'
            >
                <ChevronNext />
            </TouchableOpacity>
        </View>
    )
}

export default RiderOrder;