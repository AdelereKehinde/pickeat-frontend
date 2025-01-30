import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleCase from './TitleCase';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
    kitchen:any,
    items: string,
    date: string,
    price: string,
    order_id: string,
    status: string,
  }

const ServicesLayout: React.FC<Properties> = ({kitchen, date, price, items, order_id, status}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);

    return(
        <View className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'} flex items-center justify-between border-b w-full h-28 py-3 px-6`}>
            <View className='w-full flex flex-row'>
                <View className=''>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[14px]`}
                    >
                        {kitchen}
                    </Text>
                    <Text className='text-[10px] text-gray-500'>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className='text-[12px] text-custom-green'
                        >
                            ORDER ID: 
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className='text-[12px] text-custom-green'
                        >
                            {' '}{order_id}|
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-[12px] text-custom-green'
                        >
                            {items}
                        </Text>
                    </Text>
                </View>
                <View className='ml-auto flex items-end'>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[15px]`}
                    >
                        ₦{price}
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`text-[10px] text-gray-700 ${(status.includes('pending'))&& 'text-custom-orange'} ${(status=='completed' || status=='in progress') && 'text-custom-green'} ${(status=='cancelled') && 'text-red-600'} `}
                    >
                        {TitleCase(status)}
                    </Text>
                </View>
            </View>

            <View className='flex flex-row items-center w-full justify-between'>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={` ${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[10px]`}
                >
                    {date}
                </Text>
                <View className='flex flex-row items-center'>
                    {status.includes('in progress') && (
                        <TouchableOpacity
                        onPress={()=>{(router.push(`/track_order?tracking_id=${order_id}&kitchen=${kitchen}`))}}
                        >   
                            {}
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[10px] text-center text-white px-4 py-2 bg-custom-green rounded-md'
                            >
                                Track Order
                            </Text>
                        </TouchableOpacity>
                    )}
                    {/* {((status=='completed') || (status=='cancelled')) && (
                        <TouchableOpacity
                        onPress={()=>{alert('Re Order now')}}
                        >   
                            {}
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[10px] text-center text-custom-green px-4 py-2 bg-gray-100 rounded-md'
                            >
                                Re Order
                            </Text>
                        </TouchableOpacity>
                    )} */}
                </View>
            </View>
        </View>
    )
}

export default ServicesLayout