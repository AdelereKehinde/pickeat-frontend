import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import ArrowUp from '../assets/icon/arrow_up.svg';
import { TruncatedText } from './TitleCase';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
    receiver: string,
    type: string,
    time: string,
    amount: string,
    commission: string,
    status: string,
  }

const MoneyTransaction: React.FC<Properties> = ({receiver, type, amount, commission, time, status}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    return(
        <View
        // style={styles.shadow_box}
        className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} flex flex-row items-center space-x-1 my-2 p-2 rounded-lg w-full`}
        >
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-8 h-8 rounded-full flex items-center justify-around`}>
                <ArrowUp />
            </View>
            <View className=''>
                <Text
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[10px]`}
                style={{fontFamily: 'Inter-Bold',}}
                >
                    {TruncatedText(receiver, 28)}
                </Text>
                <View className='flex flex-row space-x-1'>
                    <Text
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[9px]`}
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
                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    -₦{amount}
                </Text>
                {/* <Text
                className='text-[10px] text-gray-500'
                style={{fontFamily: 'Inter-Regular'}}
                >
                    Commission - #{commission}
                </Text> */}
                <View className={`${(status == 'pending') && 'bg-yellow-500'} ${(status == 'completed') && 'bg-custom-green'} ${(status == 'failed') && 'bg-red-500'} mt-1 px-2 rounded-sm`}>
                    <Text
                    className='text-[9px] text-white'
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                        {status}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default MoneyTransaction;