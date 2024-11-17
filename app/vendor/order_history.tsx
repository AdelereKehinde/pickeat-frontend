import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import VendorOrderHistory from '@/components/VendorOrderHistory';

export default function OrderHistory(){
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);
    
    const Item = [
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '1', 
            kitchen: "Robert Fox", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'pending',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '2', 
            kitchen: "Cameron Williamson", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'completed',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '3', 
            kitchen: "Wade Warren", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'cancelled',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '4', 
            kitchen: "Brooklyn Simmons", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'pending',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '5', 
            kitchen: "Kathryn Murphy", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'completed',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '6', 
            kitchen: "Kathryn Murphy", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'cancelled',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '7', 
            kitchen: "Kathryn Murphy", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'completed',
        },
        { 
            source: require('../../assets/images/image25.jpg'),
            id: '8', 
            kitchen: "Kathryn Murphy", 
            items: ['rice', 'milk shake', 'chicken'],
            order_id: 'ERFH76',
            date: "Sep 4, 2021 at 12:14 am",
            price:'5000',
            status: 'cancelled',
        },
    ]

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='bg-blue-100 w-full'>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>
            
            <Text
            className='text-custom-green text-[18px] self-start pl-5 mt-5'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Order History
            </Text>

            <View className='bg-white w-full my-3 mb-36 border-t-4 border-gray-200 relative flex flex-row items-center justify-center'>
                <ScrollView className='w-full mt-4 space-y-1'>
                    {Item.map((item) => (
                        <View key={item.id}>
                            <VendorOrderHistory 
                            image={item.source}
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