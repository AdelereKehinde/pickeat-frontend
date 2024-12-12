import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import Time from '../assets/icon/time.svg';
import Location from '../assets/icon/location.svg';

interface Properties {
    image:string,
    name: string,
    time: string,
    address: string,
    status: string,
  }

const VendorOrder: React.FC<Properties> = ({image, name, address, time, status}) =>{
    return(
        <View className='flex flex-row  items-center mx-3 py-2 border-b border-gray-300'>
            <View className=''>    
                <Image 
                source={{uri: image}}
                className='border'
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
                    className='text-gray-500 text-[10px]'
                    >
                       {time}
                    </Text>
                </View>
            </View>

            {(status === 'pending') && (
                <View className='ml-auto'>
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='bg-blue-100 rounded-md py-1 px-4'
                    >
                    <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='bg-custom-green rounded-md py-1 px-4 mt-3'
                    >
                    <Text
                            className='text-white text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Accept
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {(status === 'completed') && (
                <View className='ml-auto'>
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='bg-blue-100 rounded-md py-1 px-4'
                    >
                    <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Preparing
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='bg-custom-green rounded-md py-1 px-4 mt-3'
                    >
                    <Text
                            className='text-white text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Check Out
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {(status === 'cancelled') && (
                <View className='ml-3 self-start'>
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='bg-blue-100 rounded-md py-1 px-4'
                    >
                    <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Cancelled
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            
        </View>
    )
}

export default VendorOrder;