import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { postRequest, deleteRequest } from '@/api/RequestHandler';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import Remove from '../assets/icon/remove.svg';
import { TruncatedText } from './TitleCase';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
    image: any,
    quantity: number,
    meal_name: string,
    price: number,
  }

const AdminOrderItem: React.FC<Properties> = ({meal_name, quantity, image, price}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);

    return(
        <View className={`${theme == 'dark'? 'border-gray-700' : 'border-gray-400'} flex items-center justify-between border-b w-full py-3 px-6`}>
            <View className='w-full flex flex-row'>
                <View className=''>    
                    <Image 
                    source={{uri: image}}
                    className='w-16 h-16 rounded-md'
                    />
                </View>
                
                <View className='grow ml-2 flex flex-row items-center'>
                    <View className='flex grow'>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[14px] mr-auto`}
                        >
                            {meal_name}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className=' text-[12px] text-custom-green mt-4'
                        >
                            ₦{price}
                        </Text>
                    </View>

                    <View className='flex items-end justify-between mb-2'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[13px]`}
                        >
                            X{quantity}
                        </Text>

                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`text-custom-green text-[12px] mt-2`}
                        >
                            Paid
                        </Text> 
                            
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AdminOrderItem;