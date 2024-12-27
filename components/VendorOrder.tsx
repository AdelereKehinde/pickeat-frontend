import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import Time from '../assets/icon/time.svg';
import Location from '../assets/icon/location.svg';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';

interface Properties {
    image:string,
    name: string,
    time: string,
    address: string,
    status: string,
    tracking_id: string;
    status_history_status: string,
    onUpdate: (tracking_id: string, status: string, status_history_status: string) => void
  }


const VendorOrder: React.FC<Properties> = ({image, name, address, time, status, tracking_id, status_history_status, onUpdate}) =>{
    const [loading, setLoading] = useState(false); // Loading state
    const STATUS_HISTORY_STATUS = ['', 'accepted', 'preparing', 'ready', 'shipped', 'cancelled', 'completed']
    const [STS, setSTS] = useState(status_history_status); // Loading state

    const OrderStatus = async (status_:string) => {
        try {
        if(!loading && (STATUS_HISTORY_STATUS.indexOf(status_)>STATUS_HISTORY_STATUS.indexOf(STS))){
            setLoading(true)
            // alert(status)
            const res = await postRequest(`${ENDPOINTS['cart']['orders-history']}`, {status: status_, tracking_id: tracking_id}, true);

            if (['accepted', 'preparing', 'ready', 'shipped'].includes(status_)){
                onUpdate(tracking_id, 'in progress', status_)
            }else if(status_ == 'cancelled'){
                onUpdate(tracking_id, 'cancelled', status_)
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
        <View className='flex flex-row  items-center mx-3 py-2 border-b border-gray-300'>
            <View className=''>    
                <Image 
                source={{uri: image}}
                className='border rounded-lg'
                width={55}
                height={70}
                />
            </View>

            <View className='flex justify-start ml-2 w-[45%]'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className=' text-[12px]'
                >
                    {name}
                </Text>
                <View className='flex flex-row items-center mt-2'>
                    <Location />
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-gray-500 text-[10px]'
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

            {(status_history_status == '') && (
                <View className='ml-auto'>
                    <TouchableOpacity 
                    onPress={()=>{OrderStatus('cancelled')}}
                    className='bg-blue-100 rounded-md py-1 px-4 flex items-center'
                    >
                        <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Cancel
                        </Text>
                        {(loading) && (
                            <View className='absolute w-full top-[4px] '>
                                <ActivityIndicator size="small" color="#6b7280" />
                            </View> 
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{OrderStatus('accepted')}}
                    className='bg-custom-green rounded-md py-1 px-4 mt-3 flex items-center'
                    >
                        <Text
                            className='text-white text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Accept
                        </Text>
                        {(loading) && (
                            <View className='absolute w-full top-[4px] '>
                                <ActivityIndicator size="small" color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {(['accepted', 'preparing'].includes(status_history_status)) && (
                <View className='ml-auto'>
                    {(status_history_status === 'accepted') && (
                        <TouchableOpacity 
                        onPress={()=>{OrderStatus('preparing')}}
                        className='bg-custom-green rounded-md py-1 px-4 flex items-center'
                        >
                            <Text
                                className='text-white text-[11px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Preparing
                            </Text>
                            {(loading) && (
                                <View className='absolute w-full top-[4px] '>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    {(status_history_status === 'preparing') && (
                        <TouchableOpacity 
                        onPress={()=>{OrderStatus('shipped')}}
                        className='bg-custom-green rounded-md py-1 px-4 mt-3 flex items-center'
                        >
                            <Text
                                className='text-white text-[11px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Check Out
                            </Text>
                            {(loading) && (
                                <View className='absolute w-full top-[4px] '>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    
                </View>
            )}

            {((!['', 'accepted', 'preparing', 'ready', 'cancelled'].includes(status_history_status)) && (status == 'in progress')) && (
                <View className='ml-auto'>
                        <Pressable 
                        className='bg-blue-100 rounded-md py-1 px-4 flex items-center'
                        >
                            <Text
                                className='text-gray-800 text-[11px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Preparing
                            </Text>
                            {(loading) && (
                                <View className='absolute w-full top-[4px] '>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </Pressable>

                        <Pressable 
                        className='bg-blue-100 rounded-md py-1 px-4 mt-3 flex items-center'
                        >
                            <Text
                                className='text-gray-800 text-[11px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Check Out
                            </Text>
                            {(loading) && (
                                <View className='absolute w-full top-[4px] '>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </Pressable>                    
                </View>
            )}

            {(status_history_status == 'cancelled') && (
                <View className='ml-auto my-auto self-start'>
                    <Pressable 
                    onPress={()=>{}}
                    className='bg-blue-100 rounded-md py-1 px-4'
                    >
                        <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Cancelled
                        </Text>
                    </Pressable>
                </View>
            )}
            
        </View>
    )
}

export default VendorOrder;