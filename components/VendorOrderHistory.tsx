import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleCase from './TitleCase';

interface Properties {
    kitchen:any,
    image:any,
    date: string,
    price: string,
    status: string
  }

const VendorOrderHistory: React.FC<Properties> = ({kitchen, date, price, image, status}) =>{
    return(
        <View className='flex flex-row items-center justify-between border-b border-gray-300 w-full py-3 px-6'>
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
                        className=' text-[12px] text-gray-700'
                        >
                            {kitchen}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[10px] text-gray-500'
                        >
                            {date}
                        </Text>
                    </View>
                    <View className='ml-auto flex items-end'>
                        {(status=='completed') && (
                            <TouchableOpacity
                            onPress={()=>{(router.push("/track_order"))}}
                            >   
                                {}
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className=' text-[10px] text-center text-white px-3 py-2 bg-custom-green rounded-md'
                                >
                                    Check Review
                                </Text>
                            </TouchableOpacity>
                        )}
                        {((status=='pending')) && (
                            <TouchableOpacity
                            onPress={()=>{alert('Re Order now')}}
                            >   
                                {}
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className=' text-[10px] text-center text-custom-green px-3 py-2 bg-blue-100 rounded-md'
                                >
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View className='flex flex-row items-center grow justify-between'>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className=' text-[10px] text-gray-700'
                    >
                        Amount: <Text className='text-[14px] text-custom-green'>N{price}</Text>
                    </Text>
                    <View className='flex flex-row items-center'>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className={`text-[10px] text-gray-700 ${(status=='pending') && 'text-custom-orange'} ${(status=='completed') && 'text-custom-green'} ${(status=='cancelled') && 'text-red-600'} `}
                        >
                            {TitleCase(status)}
                        </Text>
                        
                    </View>
                </View>
            </View>
        </View>
    )
}

export default VendorOrderHistory