import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Pressable, TouchableOpacity, Modal } from "react-native";
import ArrowUp from '../assets/icon/arrow_up.svg';
import { TruncatedText } from './TitleCase';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
    receiver: string,
    time: string,
    amount: string,
    commission: string,
    status: string,
    order_id: string,
  }

  interface Properties2 {
    state: string,
    order_id: string,
    price: string,
    date: string,
    item: string[],
  }

  const Popup: React.FC<Properties2> = ({state, order_id, price, date, item}) =>{
    return(
        <View
        // style={styles.shadow_box}
        className='w-full'
        >   
            
        </View>
    )
}


const OrderTransaction: React.FC<Properties> = ({receiver, amount, commission, time, status, order_id}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [showPopup, setShowPopup] = useState(false)
    return(
        <View
        // style={styles.shadow_box}
        className='w-full'
        >   
            <View
            // onPress={()=>{setShowPopup(!showPopup)}}
            className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} flex flex-row items-center space-x-1 my-1 p-2 rounded-lg w-full`}
            >
                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-8 h-8 rounded-full flex items-center justify-around`}>
                    <ArrowUp />
                </View>
                <View className=''>
                    <Text
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[10px]`}
                    style={{fontFamily: 'Inter-Bold',}}
                    >
                        ORDER - {TruncatedText(order_id, 25)}
                    </Text>
                    <View className='flex flex-row space-x-1'>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[9px]`}
                        style={{fontFamily: 'Inter-Regular'}} 
                        >
                            {time}
                        </Text>
                    </View>
                </View>
                <View className=' flex items-end grow'>
                    <Text
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        ₦{amount}
                    </Text>
                    {/* <Text
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[10px]`}
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
            
        </View>
    )
}

export default OrderTransaction;