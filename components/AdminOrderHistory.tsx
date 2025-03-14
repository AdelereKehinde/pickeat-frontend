import React, { useState, useContext, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from 'expo-router'
import TitleCase from './TitleCase';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
    id: number,
    name:any,
    image:any,
    date: string,
    price: string,
    status: string,
    order_items: number,
  }

const AdminOrderHistory: React.FC<Properties> = ({id, name, date, price, image, status, order_items}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false); // Loading state

    return(
        <View className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-300'} flex flex-row items-center justify-between border-b w-full py-3 px-6`}>
            <View className='rounded-md overflow-hidden'>    
                <Image 
                source={{uri: image}}
                className=''
                width={55}
                height={70}
                />
                {((order_items - 1) != 0) && (
                    <View className={`bg-white left-[25px] top-[45px] w-[30px] h-[20px] rounded-full absolute flex justify-around items-center`}>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`text-custom-green text-[11px]`}
                        >
                            +{order_items - 1}
                        </Text>
                    </View>
                )}
            </View>
            <View className='ml-2 grow'>
                <View className='flex flex-row'>
                    <View className=''>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[12px]`}
                        >
                            {name}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[10px]`}
                        >
                            {date}
                        </Text>
                    </View>
                    <View className='ml-auto flex items-end'>
                    
                        <TouchableOpacity
                        onPress={()=>{(router.push(`/admin/order_details?id=${id}`))}}
                        >   
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[10px] text-center text-white px-3 py-2 bg-custom-green rounded-md'
                            >
                                Check
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='flex flex-row items-center grow justify-between'>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-700'} text-[10px]`}
                    >
                        Amount: <Text className='text-[14px] text-custom-green'>₦{price}</Text>
                    </Text>
                    <View className='flex flex-row items-center'>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className={`text-[10px] text-gray-700 ${(status=='in progress') && 'text-custom-orange'} ${(status=='completed' || 'pending') && 'text-custom-green'} ${(status=='cancelled') && 'text-red-600'} `}
                        >
                            {TitleCase(status)}
                        </Text>
                        
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AdminOrderHistory