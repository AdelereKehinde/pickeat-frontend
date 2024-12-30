import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, Image, Dimensions } from "react-native";
import Star from '../assets/icon/star.svg';
import Star2 from '../assets/icon/star2.svg';

interface Properties {
    image:any,
    title: string,
    sub_title: string,
    discount: string,
    discounted_price: string,
    discount_in_price: string,
    tan_or_orange: string,
  }

const SpecialOffer: React.FC<Properties> = ({image, title, sub_title, discount, discounted_price, discount_in_price, tan_or_orange}) =>{
    return(
        <View className='rounded-md overflow-hidden w-full'>
            <View className='max-h-full h-full'>
                <Image 
                source={{ uri: image }}
                className='w-full h-full'
                />
            </View>
            <View className='flex items-end absolute w-full ml-auto top-3'>
                <Text
                style={{fontFamily: 'Inter-Medium'}} 
                className={`rounded-l-full px-2 py-1 text-[9px] ${(parseInt(discount)>15)? 'bg-custom-green text-white': 'bg-custom-tan'}`}
                >
                Spend ₦{discounted_price}, Save ₦{discount_in_price}
                </Text>
            </View>
            <View className='w-full'>
                <View className={`absolute bottom-0 h-11 w-[100%] ${(parseInt(discount)>15)? 'bg-custom-orange-3': 'bg-custom-green'}`}>
                    
                </View>
                <View className={`absolute bottom-0 h-11 w-[90%] ${(parseInt(discount)>15)? 'bg-custom-orange': 'bg-custom-light-green'}`}>
                
                </View>
                <View className={`absolute bottom-0 h-11 w-[65%] ${(parseInt(discount)>15)? 'bg-custom-orange-2': 'bg-custom-tan'}`}>
                    
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
                    className={`${(parseInt(discount)>15)? 'text-white': 'text-gray-500 '} text-[9px]`}>
                        {sub_title}
                    </Text>
                </View>

                <View className='flex flex-row ml-auto mr-8'>
                    <View className='absolute'>
                        {
                            (parseInt(discount)>15)?
                            <Star2 width={31} height={31} />
                            :
                            <Star />
                        }
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