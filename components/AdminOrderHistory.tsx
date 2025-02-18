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
    kitchen:any,
    image:any,
    date: string,
    price: string,
    status: string,
    status_history_status: string,
    tracking_id: string,
    onUpdate: (tracking_id: string, status: string, status_history_status: string) => void
  }

const AdminOrderHistory: React.FC<Properties> = ({kitchen, date, price, image, status, tracking_id, status_history_status, onUpdate}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false); // Loading state

    const OrderStatus = async (status_:string) => {
        try {
        if(!loading){
            setLoading(true)
            // alert(status)
            const res = await postRequest(`${ENDPOINTS['cart']['orders-history']}`, {status: status_, tracking_id: tracking_id}, true);

            if (['accepted', 'preparing', 'ready', 'shipped'].includes(status_)){
                onUpdate(tracking_id, 'in progress', status_)
            }

            // alert(status_)
            Toast.show({
                type: 'success',
                text1: 'Status Updated',
                visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            setLoading(false)
        }

        } catch (error:any) {
            setLoading(false)
            // alert(JSON.stringify(error))
            Toast.show({
                type: 'error',
                text1: "An error occured",
                text2: error.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }
    };
    return(
        <View className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-300'} flex flex-row items-center justify-between border-b w-full py-3 px-6`}>
            <View className=''>    
                <Image 
                source={{uri: image}}
                className='border'
                width={55}
                height={70}
                />
            </View>
            <View className='ml-2 grow'>
                <View className='flex flex-row'>
                    <View className=''>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[12px]`}
                        >
                            {kitchen}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[10px]`}
                        >
                            {date}
                        </Text>
                    </View>
                    <View className='ml-auto flex items-end'>
                        {(status=='completed') && (
                            <TouchableOpacity
                            onPress={()=>{(router.push("/vendor/reviews"))}}
                            >   
                                {}
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className=' text-[10px] text-center text-white px-3 py-2 bg-custom-green rounded-md'
                                >
                                    Check
                                </Text>
                            </TouchableOpacity>
                        )}
                        {((status=='pending')) && (
                            <TouchableOpacity
                            className='flex items-center'
                            onPress={()=>{OrderStatus('accepted')}}
                            >   
                                {}
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className=' text-[10px] text-center text-custom-green px-3 py-2 bg-blue-100 rounded-md'
                                >
                                    Accept
                                </Text>
                                {(loading) && (
                                    <View className='absolute w-full top-[4px] '>
                                        <ActivityIndicator size="small" color="#374151" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View className='flex flex-row items-center grow justify-between'>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-700'} text-[10px]`}
                    >
                        Amount: <Text className='text-[14px] text-custom-green'>N{price}</Text>
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