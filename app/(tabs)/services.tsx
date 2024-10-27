import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Check from '../../assets/icon/check.svg'

export default function Services(){
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);
    
    const Item = [
        { 
            id: '1', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'pending',
        },
        { 
            id: '2', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'completed',
        },
        { 
            id: '3', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'canceled',
        },
        { 
            id: '4', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'pending',
        },
        { 
            id: '5', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'completed',
        },
        { 
            id: '6', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'canceled',
        },
        { 
            id: '7', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'completed',
        },
        { 
            id: '8', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
            status: 'canceled',
        },
    ]

    return (
        <View className=' bg-gray-50 w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={false} title='Bookings' withbell={true} />
            
            <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(1)}}
                    className={`${(filterIndex == 1)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >   
                    {(filterIndex == 1) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 1)? 'text-white': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Accepted
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(2)}}
                    className={`${(filterIndex == 2)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 2) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 2)? 'text-white': ' text-gray-500'} text-[11px] `}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Cancelled
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(3)}}
                    className={`${(filterIndex == 3)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 3) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 3)? 'text-white': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            <View className='bg-white w-full my-3 mb-40 relative flex flex-row items-center justify-center'>
                <ScrollView className='w-full mt-4 space-y-1'>
                    {Item.map((item) => (
                        <View key={item.id}>
                            <ServicesLayout 
                            kitchen={item.kitchen} 
                            price={item.price} 
                            date={item.date}
                            items={item.items}
                            order_id={item.order_id}
                            status={item.status}
                            /> 
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}