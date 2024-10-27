import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";

interface Properties {
    kitchen:any,
    items: string[],
    date: string,
    price: string,
  }

const CartItem: React.FC<Properties> = ({kitchen, date, price, items}) =>{
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
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-[12px] text-custom-green'
                        >
                            {items.length} item{(items.length==1)? '': 's'} {''}
                        </Text>
                        {'\('}
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-[10px] text-gray-400'
                        >
                            {items.map((item, index) => (
                                <Text key={index}>{item},</Text>
                            ))}  
                        </Text> 
                        {'\)'}
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
                    className=' text-[10px] text-gray-700 text-custom-orange'
                    >
                        Pending
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
                    <TouchableOpacity
                    onPress={()=>{alert('order now')}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[10px] text-center text-custom-green px-2 py-2 bg-gray-100 rounded-md mr-2'
                        >
                            Cancel Order
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{alert('order now')}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[10px] text-center text-white px-2 py-2 bg-custom-green rounded-md'
                        >
                            Confirm Order
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CartItem;