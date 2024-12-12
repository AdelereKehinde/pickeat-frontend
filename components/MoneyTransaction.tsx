import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import ArrowUp from '../assets/icon/arrow_up.svg';
import { TruncatedText } from './TitleCase';

interface Properties {
    receiver: string,
    type: string,
    time: string,
    amount: string,
    commission: string,
    status: string,
  }

const MoneyTransaction: React.FC<Properties> = ({receiver, type, amount, commission, time, status}) =>{
    return(
        <View
        // style={styles.shadow_box}
        className='flex flex-row items-center space-x-1 my-2 bg-white p-2 rounded-lg w-full'
        >
            <View className='w-8 h-8 bg-blue-50 rounded-full flex items-center justify-around'>
                <ArrowUp />
            </View>
            <View className=''>
                <Text
                className='text-[10px] text-gray-800'
                style={{fontFamily: 'Inter-Bold',}}
                >
                    {TruncatedText(receiver, 25)}
                </Text>
                <View className='flex flex-row space-x-1'>
                    <Text
                    className='text-[9px] text-gray-500' 
                    style={{fontFamily: 'Inter-Regular'}} 
                    >
                        {time}
                    </Text>
                    {/* <View className='bg-custom-green px-2 rounded-sm'>
                        <Text
                        className='text-[9px] text-white'
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                            {status}
                        </Text>
                    </View> */}
                </View>
            </View>
            <View className=' flex items-end grow'>
                <Text
                className='text-[11px] text-gray-800'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    -#{amount}
                </Text>
                <Text
                className='text-[10px] text-gray-500'
                style={{fontFamily: 'Inter-Regular'}}
                >
                    Commission - #{commission}
                </Text>
            </View>
        </View>
    )
}

export default MoneyTransaction;