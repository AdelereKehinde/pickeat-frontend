import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, TextInput, TouchableOpacity, FlatList, Image, Dimensions, ScrollView, Pressable } from "react-native";
import TitleTag from '@/components/Title';

import Account from '../assets/icon/account.svg';
import Mail from '../assets/icon/mail.svg';
import Notification from '../assets/icon/notification.svg';
import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';


export default function ConfirmOrder(){
    const Details = {
        kitchen: {
            name: 'Mardiya Kitchen',
            description: 'Rice and chicken Both fried and Jollof',
            delivery_condition: 'This Kitchen provides both Delivery and self pickup options. By default Delivery has been selected (change)',
        },
        products: [
            { id: '1', source: require('../assets/images/image1.jpg'), name:'Green chile stew' },
            { id: '2', source: require('../assets/images/image2.jpg'), name:'Chicago - style pizza'},
            { id: '3', source: require('../assets/images/image3.jpg'), name:'Key lime pie' },
            { id: '4', source: require('../assets/images/image1.jpg'), name:'Cobb salad' },
            { id: '5', source: require('../assets/images/image1.jpg'), name:'Green chile stew' },
            { id: '6', source: require('../assets/images/image2.jpg'), name:'Fried plantain'},
            { id: '7', source: require('../assets/images/image3.jpg'), name:'Key lime pie' },
            { id: '8', source: require('../assets/images/image1.jpg'), name:'Cobb salad' },
        ]
    };

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-white w-full'>
                <TitleTag withprevious={true} title='Confirm order' withbell={false} />
            </View>

            <View className='px-4 mt-4'>
                <View className='flex flex-row'>
                    <View>
                        <Image
                        source={require('../assets/images/image23.jpg')}
                        />
                    </View>

                    <View className='ml-2'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}} 
                        className='text-[13px] mt-1'
                        >
                            {Details.kitchen.name}  
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Regular'}} 
                        className='text-[10px] text-gray-700 font-medium mt-1'
                        >
                            {Details.kitchen.description}
                        </Text>
                    </View>
                </View>
               
                <Text
                    style={{fontFamily: 'Inter-Regular'}} 
                    className='text-[10px] text-gray-700 font-medium mt-3'
                >
                    {Details.kitchen.delivery_condition}
                </Text>
                
            </View>

            <Text
                style={{fontFamily: 'Inter-SemiBold'}} 
                className='text-[14px] mt-4 pl-8 w-full'
                >
                    Add Ons
                </Text>

            <View className="px-4 py-3 h-38 ">
                <FlatList
                    className=''
                    data={Details.products}
                    renderItem={({ item }) => (
                        <View className='w-20 flex items-center'>
                            <Image
                                source={item.source}
                                className="w-16 h-16 rounded-full" // Set desired width and height
                            />
                            <Text
                            style={{fontFamily: 'Inter-Regular'}} 
                            className='text-[10px] text-gray-700 mt-1 text-center'
                            >
                                {item.name}
                            </Text>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    // Add spacing between items with ItemSeparatorComponent
                    ItemSeparatorComponent={() => <View className='w-2' />}
                />
            </View>
        </View>
    )
}