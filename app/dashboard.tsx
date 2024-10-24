import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';
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

    const images = [
        { id: '1', source: require('../assets/images/image1.jpg'), name:'Green chile stew' },
        { id: '2', source: require('../assets/images/image2.jpg'), name:'Chicago-style pizza'},
        { id: '3', source: require('../assets/images/image3.jpg'), name:'Key lime pie' },
        { id: '4', source: require('../assets/images/image1.jpg'), name:'Cobb salad' },
        // Add more images as needed
    ];

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
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
                    className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[14px]`}
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

            <View className="mt-5 p-3">
                <FlatList
                    className='space-x-2'
                    data={images}
                    renderItem={({ item }) => (
                        <View className=' flex items-center'>
                            <Image
                                source={item.source}
                                className="w-36 h-36 rounded-md" // Set desired width and height
                            />
                            <Text
                            style={{fontFamily: 'Inter-Regular'}} 
                            className='text-[13px] text-gray-700 font-medium mt-1'
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
                    // pagingEnabled
                    // onViewableItemsChanged={onViewRef.current}
                    // viewabilityConfig={viewConfigRef.current}
                    // ref={flatListRef}
                />
            </View>

            <View>
                <Text>
                    Special offers for you
                </Text>
            </View>
        </View>
    )
}