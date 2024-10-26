import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity, FlatList, Image, Dimensions, ScrollView, Pressable } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import SpecialOffer from '@/components/SpecialOfferCard';
import KitchenCard from '@/components/Kitchen';

import Account from '../assets/icon/account.svg';
import Mail from '../assets/icon/mail.svg';
import Notification from '../assets/icon/notification.svg';
import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';


export default function Dashboard(){
    const {country_code, phone_number} = useGlobalSearchParams()

    const [address, setAddress] = useState('')

    const ValidateFormContent = ():boolean =>{
        if((address !== '')){
            return true
        }
        return false
    }
    const [isFocused, setIsFocus] = useState(false);

    const {width, height} = Dimensions.get('window')

    const DisplayProduct = [
        { id: '1', source: require('../assets/images/image1.jpg'), name:'Green chile stew' },
        { id: '2', source: require('../assets/images/image2.jpg'), name:'Chicago-style pizza'},
        { id: '3', source: require('../assets/images/image3.jpg'), name:'Key lime pie' },
        { id: '4', source: require('../assets/images/image1.jpg'), name:'Cobb salad' },
    ];
    const Special = [
        { 
            id: '1', 
            source: require('../assets/images/image4.jpg'), 
            title:'Stainless Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'15',
            discount_in_price:'10',
            discounted_price:'45'
        },
        { 
            id: '2', 
            source: require('../assets/images/image15.jpg'), 
            title:'Mardiya Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'22',
            discount_in_price:'5',
            discounted_price:'40'
        },
        { 
            id: '3', 
            source: require('../assets/images/image4.jpg'), 
            title:'Stainless Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'15',
            discount_in_price:'10',
            discounted_price:'45'
        },
        { 
            id: '4', 
            source: require('../assets/images/image15.jpg'), 
            title:'Mardiya Kitchen', 
            sub_title:'$2.99 Delivery fee | 15-20 min' ,
            discount:'22',
            discount_in_price:'5',
            discounted_price:'40'
        },
    ];
    const Sellers = [
        { id: '1', source: require('../assets/images/image5.jpg'), name:'Darlene Robert' },
        { id: '2', source: require('../assets/images/image6.jpg'), name:'Darlene Robert' },
        { id: '3', source: require('../assets/images/image7.jpg'), name:'Darlene Robert' },
        { id: '4', source: require('../assets/images/image8.jpg'), name:'Darlene Robert' },
        { id: '5', source: require('../assets/images/image9.jpg'), name:'Darlene Robert' },
        { id: '6', source: require('../assets/images/image10.jpg'), name:'Darlene Robert' },
        { id: '7', source: require('../assets/images/image1.jpg'), name:'Darlene Robert' },
        { id: '8', source: require('../assets/images/image2.jpg'), name:'Darlene Robert' },
    ];
    const Kitchen = [
        { id: '1', source: require('../assets/images/image11.jpg'), name:'GreenVita', time:"12 - 20", rating: "4.7", fee: '2.34' },
        { id: '2', source: require('../assets/images/image12.jpg'), name:'Sushi shop', time:"10", rating: "4.7", fee: '1.99' },
        { id: '3', source: require('../assets/images/image13.jpg'), name:'Foc i Oli', time:"20", rating: "4.7", fee: '0.00' },
        { id: '4', source: require('../assets/images/image14.jpg'), name:'Pafinolis', time:"20 - 30", rating: "4.7", fee: '1.99' },
    ];

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <ScrollView>
                <View className='mt-10 flex flex-row justify-between p-4 w-full'>
                <View className='flex flex-row items-center space-x-2 rounded-2xl bg-gray-100 p-3'>
                    <View className=''>
                        <Account />
                    </View>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Welcome, HayWhy
                    </Text>
                </View>

                <View className='flex flex-row space-x-2 rounded-2xl bg-gray-100 p-3'>
                    <View className=' '>
                        <Notification />
                    </View>
                    <View className=''>
                        <Mail />
                    </View>
                </View>
                </View>

                <View className='mt-5 w-full px-4 relative flex flex-row items-center justify-center'>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[11px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocus(true)}
                        onBlur={()=>setIsFocus(false)}
                        onChangeText={setAddress}
                        defaultValue={address}
                        placeholder="Search for available foods"
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

                <View className="mt-3 p-3 h-40">
                    <FlatList
                        className=''
                        data={DisplayProduct}
                        renderItem={({ item }) => (
                            <View className=' flex items-center'>
                                <Image
                                    source={item.source}
                                    className="w-28 h-28 rounded-md" // Set desired width and height
                                />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className='text-[11px] text-gray-700 font-medium mt-1'
                                >
                                    {item.name}
                                </Text>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        // Add spacing between items with ItemSeparatorComponent
                        ItemSeparatorComponent={() => <View className='w-3' />}
                    />
                </View>

                <View className=''>
                    <Link
                    href="/special_offer"
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-gray-500 text-[12px] px-3'
                    >
                        Special offers for you
                    </Link>
                    <View className='h-[180px] p-3'>
                        <FlatList
                            className=''
                            data={Special}
                            renderItem={({ item }) => (
                                <View key={item.id} className='w-[250px] h-[150px]'>
                                    <Pressable
                                    onPress={()=>{(router.push("/kitchen_product"))}}
                                    >
                                        <SpecialOffer 
                                        image={item.source}
                                        title={item.title}
                                        sub_title={item.sub_title}
                                        discount={item.discount}
                                        discount_in_price={item.discount_in_price}
                                        discounted_price={item.discounted_price}
                                        tan_or_orange='tan'
                                    />
                                    </Pressable>
                                </View>
                            )}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            // Add spacing between items with ItemSeparatorComponent
                            ItemSeparatorComponent={() => <View className='w-3' />}
                        />
                    </View>
                </View>

                <View className='mt-2'>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-gray-500 text-[12px] px-3'
                    >
                        Featured Sellers
                    </Text>
                    <View className='h-24 p-3'>
                        <FlatList
                            className=''
                            data={Sellers}
                            renderItem={({ item }) => (
                                <View
                                key={item.id}
                                className='flex items-center'
                                >
                                    <View className='flex items-center rounded-full overflow-hidden '>
                                        <Image 
                                        source={item.source}
                                        className='w-12 h-12'
                                        />
                                    </View>
                                    <Text
                                    style={{fontFamily: 'Inter-Regular'}}
                                    className='text-[9px] mt-1'
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

                <View className='mb-10 mt-5'>
                    <Link
                    href="/kitchen_page"
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-gray-500 text-[12px] px-3'
                    >
                        Kitchens near you
                    </Link>
                    {Kitchen.map((item) => (
                        <KitchenCard key={item.id} image={item.source} name={item.name} time={item.time} rating={item.rating} fee={item.fee} />
                    ))}
                </View>
            </ScrollView>   
        </View>
    )
}