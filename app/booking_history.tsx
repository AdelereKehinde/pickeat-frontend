import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';

export default function BookingHistory(){
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
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-gray-100 w-full'>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>
            
            <Text
            className='text-custom-green text-[18px] self-start pl-5 mt-5'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Booking History
            </Text>

            <View className='bg-white w-full my-3 mb-36 relative flex flex-row items-center justify-center'>
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