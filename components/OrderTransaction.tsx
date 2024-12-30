import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable, TouchableOpacity } from "react-native";
import ArrowUp from '../assets/icon/arrow_up.svg';
import { TruncatedText } from './TitleCase';

interface Properties {
    receiver: string,
    time: string,
    amount: string,
    commission: string,
    status: string,
    order_id: string,
    price: string,
    date: string,
    item: string[],
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


const OrderTransaction: React.FC<Properties> = ({receiver, amount, commission, time, status, order_id, price, date, item}) =>{
    const [showPopup, setShowPopup] = useState(false)
    return(
        <View
        // style={styles.shadow_box}
        className='w-full'
        >   
            {showPopup && (
                <View>
                </View>
            )}
            <TouchableOpacity
            onPress={()=>{setShowPopup(!showPopup)}}
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
                        ORDER - {TruncatedText(order_id, 25)}
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
                        ₦{amount}
                    </Text>
                    <Text
                    className='text-[10px] text-gray-500'
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                        Commission - #{commission}
                    </Text>
                </View>
            </TouchableOpacity>
            
        </View>
    )
}

export default OrderTransaction;