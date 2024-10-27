import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import CartItem from '@/components/CartItem';

export default function Cart(){
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);

    const Item = [
        { 
            id: '1', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '2', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '3', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '4', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '5', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '6', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '7', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '8', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
        { 
            id: '9', 
            kitchen: "Mardiya Kitchen", 
            items: ['rice', 'milk shake', 'chicken'],
            date: "Sep 4, 2021 at 12:14 am",
            price:'17.84',
        },
    ];
    
    return (
        <View className=' bg-gray-50 w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={false} title='Cart' withbell={true} />
            
            <View className='bg-white w-full my-3 mb-24 relative flex flex-row items-center justify-center'>
                <ScrollView className='w-full mt-4 space-y-1'>
                    {Item.map((item) => (
                        <View key={item.id}>
                            <CartItem 
                            kitchen={item.kitchen} 
                            price={item.price} 
                            date={item.date}
                            items={item.items}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}