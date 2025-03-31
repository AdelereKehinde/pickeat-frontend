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
    order_id: string,
    task_id: number,
  }


const RiderOrder2: React.FC<Properties> = ({image, name, address, time, order_id, task_id}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);

    return(
        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} flex flex-row  items-center mx-3 px-2 rounded-lg py-2`}>
            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[12px]`}
                >
                    Order #{order_id}
                </Text>
                <View className='flex flex-row items-center mt-1'>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
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

export default RiderOrder2;