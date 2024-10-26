import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import Time from '../assets/icon/time.svg';

interface Properties {
    image:any,
    name: string,
    time: string,
    rating: string,
    fee: string,
  }

const KitchenCard: React.FC<Properties> = ({image, name, time, rating, fee}) =>{
    return(
        <View className='flex flex-row  items-center mx-3 py-2 border-b border-gray-300'>
            <View>    
                <Image 
                source={image}
                className=''
                width={70}
                height={55}
                />
            </View>

            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className=' text-[12px]'
                >
                    {name}
                </Text>
                <View className='flex flex-row items-center mt-2'>
                    <Time />
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-gray-500 text-[11px] ml-1'
                    >
                        Arrival in {time}
                    </Text>
                </View>
            </View>

            <View className='ml-auto'>
                <View className='flex flex-row justify-between'>
                    <View className='flex flex-row items-center space-x-2 py-[4px] px-3 rounded-xl bg-gray-200'>
                        <View className=''>
                            <Rating width={12} height={12} />
                        </View>
                        <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {rating}
                        </Text>
                    </View>
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className=''
                    >
                        <View className=''>
                            <Heart width={20} height={20} />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className='text-[10px] mt-1 text-gray-600'
                >
                    Delivery Fee - ${fee}
                </Text>
            </View>
        </View>
    )
}

export default KitchenCard;