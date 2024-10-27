import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import Product from '@/components/Product';

import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';

export default function KitchenPageProduct(){
    const KitchenProduct = [
        { 
            id: '1', 
            source: require('../assets/images/image16.jpg'), 
            name:'Fried Plantain', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'Fried rice is sweet',
        },
        { 
            id: '2', 
            source: require('../assets/images/image18.jpg'), 
            name:'Chicken', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'Fried rice is sweet',
        },
        { 
            id: '3', 
            source: require('../assets/images/image19.jpg'), 
            name:'Fried Rice', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '2',
            description:'Fried rice is sweet',
        },
        { 
            id: '4', 
            source: require('../assets/images/image20.jpg'), 
            name:'Salad', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '1',
            description:'Tastes better',
        },
        { 
            id: '5', 
            source: require('../assets/images/image17.jpg'), 
            name:'Fish Grill', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'Yummy',
        },
        { 
            id: '6', 
            source: require('../assets/images/image21.jpg'), 
            name:'Chicken BBQ', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '2',
            description:'Assorted',
        },
        { 
            id: '7', 
            source: require('../assets/images/image20.jpg'), 
            name:'Burger', 
            price:'28.35',
            discount: '15',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'So sweet',
        },
    ];
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);
    
    return (
        <View className=' bg-white w-full h-full flex items-center mb-10'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={true} title='Kitchen' withbell={true} />
            
            <View className='bg-white w-full my-3 px-4 relative flex flex-row items-center justify-center'>
                <View className='absolute left-6 z-10'>
                    <Search />
                </View>
                <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[11px]`}
                    autoFocus={false}
                    onFocus={()=>setIsFocus(true)}
                    onBlur={()=>setIsFocus(false)}
                    onChangeText={setSearchValue}
                    defaultValue={searchValue}
                    placeholder="Search for available home services"
                    placeholderTextColor=""
                />
                <TouchableOpacity 
                onPress={()=>{}}
                className='flex flex-row items-center px-2 absolute inset-y-0 space-x-1 top-2 right-7 rounded-lg h-8 bg-gray-100 my-auto'>
                    <Text
                    className='text-custom-green'
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Filter
                    </Text>
                    <View className=''>
                        <Filter width={15} height={15} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView className='w-full mt-4 space-y-1'>
                {KitchenProduct.map((item) => (
                    <View key={item.id}>
                        <Product 
                        image={item.source} 
                        name={item.name} 
                        price={item.price} 
                        discount={item.discount} 
                        discounted_price={item.discounted_price} 
                        quantity_in_cart={item.quantity_in_cart}
                        description={item.description}
                        />
                    </View>
                ))}
            </ScrollView>
            
        </View>
    )
}