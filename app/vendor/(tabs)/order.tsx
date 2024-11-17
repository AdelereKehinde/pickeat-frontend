import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import Check from '../../../assets/icon/check.svg'
import VendorOrder from '@/components/VendorOrder';

function Order(){
    const [isFocused, setIsFocus] = useState(false);
    const [filter, setFilter] = useState('pending');
    
    const Orders = [
        { id: '1', source: require('../../../assets/images/image24.jpg'), name:'Samuel Omotayo .K', time:"Tue 21 Oct. - 4:00PM", address: 'Vila Nova Estate, New Apo Ext.' },
        { id: '2', source: require('../../../assets/images/image24.jpg'), name:'Samuel Omotayo .K', time:"Tue 21 Oct. - 4:00PM", address: 'Vila Nova Estate, New Apo Ext.' },
        { id: '3', source: require('../../../assets/images/image24.jpg'), name:'Samuel Omotayo .K', time:"Tue 21 Oct. - 4:00PM", address: 'Vila Nova Estate, New Apo Ext.' },
        { id: '4', source: require('../../../assets/images/image24.jpg'), name:'Samuel Omotayo .K', time:"Tue 21 Oct. - 4:00PM", address: 'Vila Nova Estate, New Apo Ext.' },
        { id: '5', source: require('../../../assets/images/image24.jpg'), name:'Samuel Omotayo .K', time:"Tue 21 Oct. - 4:00PM", address: 'Vila Nova Estate, New Apo Ext.' },
    ];
    
    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='bg-blue-100 w-full'>
                <TitleTag withprevious={false} title='Orders' withbell={false} />
            </View>

            <Text
            className='text-custom-green text-[16px] self-start pl-5 mt-5'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                My Orders
            </Text>
            
            <View className='my-3 mt-3 flex flex-row w-full justify-around'>
                <TouchableOpacity 
                    onPress={()=>{setFilter('pending')}}
                    className={`${(filter == 'pending')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >   
                    {(filter== 'pending') && (
                        <Check />
                    )}
                    <Text
                    className={`${(filter == 'pending')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Pending
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilter('confirmed')}}
                    className={`${(filter == 'confirmed')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filter == 'confirmed') && (
                        <Check />
                    )}
                    <Text
                    className={`${(filter == 'confirmed')? 'text-white pl-2': ' text-gray-500'} text-[11px] `}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Confirmed
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setFilter('cancelled')}}
                    className={`${(filter == 'cancelled')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filter == 'cancelled') && (
                        <Check />
                    )}
                    <Text
                    className={`${(filter == 'cancelled')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Cancelled
                    </Text>
                </TouchableOpacity>
            </View>

            <View className='bg-white w-full my-3 mb-36 relative flex flex-row items-center justify-center'>
                <ScrollView className='w-full p-1 pb-5 mt-5 space-y-2'>
                {Orders.map((item) => (
                    <View key={item.id}>
                        <VendorOrder image={item.source} name={item.name} time={item.time} address={item.address} status={filter}/>
                    </View>
                ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default Order;