import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';
import Check from '../assets/icon/check.svg'

export default function KitchenPage(){
    const Kitchen = [
        { id: '1', source: require('../assets/images/image11.jpg'), name:'GreenVita', time:"12 - 20", rating: "4.7", fee: '2.34' },
        { id: '2', source: require('../assets/images/image12.jpg'), name:'Sushi shop', time:"10", rating: "4.7", fee: '1.99' },
        { id: '3', source: require('../assets/images/image13.jpg'), name:'Foc i Oli', time:"20", rating: "4.7", fee: '0.00' },
        { id: '4', source: require('../assets/images/image14.jpg'), name:'Pafinolis', time:"20 - 30", rating: "4.7", fee: '1.99' },
        { id: '5', source: require('../assets/images/image11.jpg'), name:'GreenVita', time:"12 - 20", rating: "4.7", fee: '2.34' },
        { id: '6', source: require('../assets/images/image12.jpg'), name:'Sushi shop', time:"10", rating: "4.7", fee: '1.99' },
        { id: '7', source: require('../assets/images/image13.jpg'), name:'Foc i Oli', time:"20", rating: "4.7", fee: '0.00' },
        { id: '8', source: require('../assets/images/image14.jpg'), name:'Pafinolis', time:"20 - 30", rating: "4.7", fee: '1.99' },
    ];
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);
    
    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={true} title='Search' withbell={true} />
            
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

            <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(1)}}
                    className={`${(filterIndex == 1)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
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
                    className={`${(filterIndex == 2)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 2) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 2)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Breakfast
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
                    className={`${(filterIndex == 3)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Stock
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilterIndex(4)}}
                    className={`${(filterIndex == 4)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 4) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 4)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Desert
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className='w-full p-1 pb-5 mt-5 space-y-2'>
            {Kitchen.map((item) => (
                <View key={item.id}>
                    <KitchenCard image={item.source} name={item.name} time={item.time} rating={item.rating} fee={item.fee} />
                </View>
            ))}
            </ScrollView>
        </View>
    )
}