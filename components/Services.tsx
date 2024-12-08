import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleCase from './TitleCase';

interface Properties {
    kitchen:any,
    items: string,
    date: string,
    price: string,
    order_id: string,
    status: string
  }

const ServicesLayout: React.FC<Properties> = ({kitchen, date, price, items, order_id, status}) =>{
    return(
        <View className='flex items-center justify-between border-b border-gray-300 w-full h-28 py-3 px-6'>
            <View className='w-full flex flex-row'>
                <View className=''>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className=' text-[14px] text-gray-700'
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
                    className=' text-[15px] text-gray-700'
                    >
                        ${price}
                    </Text>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`text-[10px] text-gray-700 ${status.includes('Pending') && 'text-custom-orange'} ${(status=='completed') && 'text-custom-green'} ${(status=='Cancelled') && 'text-red-600'} `}
                    >
                        {TitleCase(status)}
                    </Text>
                </View>
            </View>

            <View className='flex flex-row items-center w-full justify-between'>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className=' text-[10px] text-gray-500'
                >
                    {date}
                </Text>
                <View className='flex flex-row items-center'>
                    {status.includes('Pending') && (
                        <TouchableOpacity
                        onPress={()=>{(router.push("/track_order"))}}
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
                    {((status=='Completed') || (status=='Canceled')) && (
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
                    )}
                </View>
            </View>
        </View>
    )
}

export default ServicesLayout