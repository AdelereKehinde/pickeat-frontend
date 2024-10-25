import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, Image, Dimensions } from "react-native";
import Star from '../assets/icon/Star.svg';

interface Properties {
    title: string,
    sub_title: string,
    discount: string,
    discounted_price: string,
    discount_in_price: string,
    tan_or_orange: string,
  }

const SpecialOffer: React.FC<Properties> = ({title, sub_title, discount, discounted_price, discount_in_price, tan_or_orange}) =>{
    return(
        <View className='rounded-md overflow-hidden'>
            <View>
                <Image 
                source={require('../assets/images/image4.jpg')}
                width={250}
                height={140}
                />
            </View>
            <View className='flex items-end absolute w-full ml-auto top-3'>
                <Text
                style={{fontFamily: 'Inter-Medium'}} 
                className='rounded-l-full px-2 py-1 text-[9px] bg-custom-tan'
                >
                Spend ${discounted_price}, Save ${discount_in_price}
                </Text>
            </View>
            <View className=''>
                <View className='absolute bottom-0 h-11 w-full bg-custom-green'>
                    
                </View>
                <View className='absolute bottom-0 h-11 w-[90%] bg-custom-light-green'>
                
                </View>
                <View className='absolute bottom-0 h-11 w-[65%] bg-custom-tan'>
                    
                </View>
            </View>
            <View className='flex flex-row items-center px-2 absolute bottom-1 w-full'>
                <View className='flex'>
                    <Text 
                    style={{fontFamily: 'Inter-SemiBold'}} 
                    className='text-[12px]'
                    >
                        {title}
                    </Text>
                    <Text 
                    style={{fontFamily: 'Inter-Medium'}} 
                    className='text-gray-400 text-[9px]'
                    >
                        {sub_title}
                    </Text>
                </View>

                <View className='flex flex-row mx-auto'>
                    <View className='absolute'>
                        <Star />
                    </View>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}} 
                    className='text-center text-[8px] text-white px-[7px] py-[3px]'
                    >
                    {discount}%{'\n'}OFF
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default SpecialOffer;