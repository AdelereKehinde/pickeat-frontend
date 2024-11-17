import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import TitleTag from '@/components/Title';
import VendorProductList from '@/components/VendorProductList';

import Search from '../../assets/icon/search.svg';
import Add from '../../assets/icon/add_product.svg';
import Check from '../../assets/icon/check.svg'

export default function Menu(){
    const KitchenProduct = [
        { 
            id: '1', 
            source: require('../../assets/images/image16.jpg'), 
            name:'Fried Plantain', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'Fried rice is sweet',
        },
        { 
            id: '2', 
            source: require('../../assets/images/image18.jpg'), 
            name:'Chicken', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'Fried rice is sweet',
        },
        { 
            id: '3', 
            source: require('../../assets/images/image19.jpg'), 
            name:'Fried Rice', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '2',
            description:'Fried rice is sweet',
        },
        { 
            id: '4', 
            source: require('../../assets/images/image20.jpg'), 
            name:'Salad', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '1',
            description:'Tastes better',
        },
        { 
            id: '5', 
            source: require('../../assets/images/image17.jpg'), 
            name:'Fish Grill', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'Yummy',
        },
        { 
            id: '6', 
            source: require('../../assets/images/image21.jpg'), 
            name:'Chicken BBQ', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '2',
            description:'Assorted',
        },
        { 
            id: '7', 
            source: require('../../assets/images/image20.jpg'), 
            name:'Burger', 
            price:'28.35',
            discount: '15',
            category: 'Dessert',
            discounted_price:'23.45',
            quantity_in_cart: '0',
            description:'So sweet',
        },
    ];
    const Details = {
        kitchen: {
            name: 'Mardiya Kitchen',
            description: 'Rice and chicken Both fried and Jollof',
            delivery_condition: 'This Kitchen provides both Delivery and self pickup options. By default Delivery has been selected (change)',
        },
        products: [
            { id: '1', source: require('../../assets/images/image1.jpg'), name:'Green chile stew' },
            { id: '2', source: require('../../assets/images/image2.jpg'), name:'Chicago - style pizza'},
            { id: '3', source: require('../../assets/images/image3.jpg'), name:'Key lime pie' },
            { id: '4', source: require('../../assets/images/image1.jpg'), name:'Cobb salad' },
            { id: '5', source: require('../../assets/images/image1.jpg'), name:'Green chile stew' },
            { id: '6', source: require('../../assets/images/image2.jpg'), name:'Fried plantain'},
            { id: '7', source: require('../../assets/images/image3.jpg'), name:'Key lime pie' },
            { id: '8', source: require('../../assets/images/image1.jpg'), name:'Cobb salad' },
        ]
    };
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);
    
    return (
        <View className=' bg-white w-full h-full flex items-center mb-10'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-white w-full'>
                <TitleTag withprevious={true} title='Menu' withbell={false} />
            </View>

            <TouchableOpacity
            onPress={()=>{router.push('/vendor/create_product')}}
             className='self-end -mt-8 mr-4'>
                <Add />
            </TouchableOpacity>

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
                    placeholder="Search through your menu"
                    placeholderTextColor=""
                />
            </View>

            <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(1)}}
                    className={`${(filterIndex == 1)? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >   
                    {(filterIndex == 1) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 1)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(2)}}
                    className={`${(filterIndex == 2)? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 2) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 2)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Desert
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(3)}}
                    className={`${(filterIndex == 3)? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 3) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 3)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Breakfast
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(4)}}
                    className={`${(filterIndex == 4)? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 4) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 4)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Add ons
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="px-4 py-3 h-[130px]">
                <FlatList
                    className=''
                    data={Details.products}
                    renderItem={({ item }) => (
                        <View className='w-20 flex items-center'>
                            <Image
                                source={item.source}
                                className="w-14 h-14 rounded-full" // Set desired width and height
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
                    ItemSeparatorComponent={() => <View className='' />}
                />
            </View>

            <View className='w-full bg-gray-50 mb-40 pb-2 '>
                <ScrollView className='w-full space-y-1 mb-16'>
                    {KitchenProduct.map((item) => (
                        <View key={item.id}>
                            <VendorProductList 
                            image={item.source} 
                            category={item.category}
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
        </View>
    )
}