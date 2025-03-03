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
    time: string,
    message: string,
    from: string,
    order_id: string,
    items: number,
    amount: number;
  }


const VendorNotifi: React.FC<Properties> = ({image, message, time, from, order_id, items, amount}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);

    return(
        <View className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-300'} flex flex-row  items-center px-3 py-2`}>
            <View
            className='flex flex-row items-center w-full py-3'
            >
                <Image 
                    source={{uri: image}}
                    className='w-12 h-12 rounded-full'
                />
                <View className='flex flex-row ml-2 grow'>
                    <View className='flex justify-around'>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[11px] w-full`}
                        style={{fontFamily: 'Inter-Medium-Italic'}}
                        >
                                {message}
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px] w-full`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {message}
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[11px] w-full`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            <Text
                            className='text-custom-green text-[11px] w-full'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Order ID: {"\n"} 
                            </Text>
                            {order_id}
                        </Text>
                    </View>
                    <View className='flex justify-between items-end ml-auto'>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[11px] w-full`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {time}
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[12px] w-full`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            ₦{amount}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
        
    )
}

export default VendorNotifi;