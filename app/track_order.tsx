import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import DoubleCheck from '../assets/icon/double_check.svg';
import RadioButton from '../assets/icon/radio-button.svg';
import Prompt from '@/components/Prompt';
import { SafeAreaView } from 'react-native-safe-area-context';

function TrackOrder(){

    const [showPrompt, setShowPrompt] = useState(false)

    const [orderDetail, setOrderDetail] = useState({
        order_time: '09:45am',
        preparation_time: '09:47am',
        assignation_time: '',
        pickup_time: '',
        delivery_time: '',
    })

    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                {showPrompt && (
                    <Prompt main_text='Thank you for choosing PickEat PickIt' sub_text='You’ve confirmed you’ve now collected your order' clickFunction={()=>{setShowPrompt(false)}} />
                )}
                <View className='bg-white w-full'>
                    <TitleTag withprevious={true} title='Track order' withbell={false} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className='text-custom-green text-[16px] p-4'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Order Progess
                    </Text>
                    
                    <View className='w-full p-4 space-y-1'>
                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {orderDetail.order_time}
                            </Text>
                            <View className='flex items-center space-y-1'>
                                <DoubleCheck/>
                                <View className={`w-[2px] h-8 ${(orderDetail.preparation_time === '')? 'bg-gray-200':'bg-custom-green'} `}>

                                </View>
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Mardiya Kitchen has recieved and {'\n'}confirmed your order
                            </Text>
                        </View>

                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            {(orderDetail.preparation_time === '')? '---------': orderDetail.preparation_time}
                            </Text>
                            <View className='flex items-center space-y-1'>
                                {(orderDetail.preparation_time === '')? <RadioButton/>:<DoubleCheck/>}
                                <View className={`w-[2px] h-8 ${(orderDetail.assignation_time === '')? 'bg-gray-200':'bg-custom-green'} `}>

                                </View>
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Mardiya Kitchen is preparing your order
                            </Text>
                        </View>

                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {(orderDetail.assignation_time === '')? '---------': orderDetail.assignation_time}
                            </Text>
                            <View className='flex items-center space-y-1'>
                                {(orderDetail.assignation_time === '')? <RadioButton/>:<DoubleCheck/>}
                                <View className={`w-[2px] h-8 ${(orderDetail.pickup_time === '')? 'bg-gray-200':'bg-custom-green'} `}>

                                </View>
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                A courier has been assigned to {'\n'}your order
                            </Text>
                        </View>

                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            {(orderDetail.pickup_time === '')? '---------': orderDetail.pickup_time}
                            </Text>
                            <View className='flex items-center space-y-1'>
                                {(orderDetail.pickup_time === '')? <RadioButton/>:<DoubleCheck/>}
                                <View className={`w-[2px] h-8 ${(orderDetail.delivery_time === '')? 'bg-gray-200':'bg-custom-green'} `}>

                                </View>
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                The courier is on their way to deliver {'\n'}your order
                            </Text>
                        </View>

                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {(orderDetail.delivery_time === '')? '---------': orderDetail.delivery_time}
                            </Text>
                            <View className='flex items-center space-y-1'>
                            {(orderDetail.delivery_time === '')? <RadioButton/>:<DoubleCheck/>}
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                The courier is delivering your order
                            </Text>
                        </View>
                    </View>

                    <View className='p-4 flex flex-row justify-between items-center my-4'>
                        <Text
                        className='text-custom-green text-[17px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            10:01AM
                        </Text>
                        <Text
                        className='text-gray-400 text-[12px]'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Estimated time of delivery
                        </Text>
                    </View>

                    <View className='px-4 flex flex-row justify-between items-center'>
                        <Text
                        className='text-[12px] text-gray-500'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            <Text
                            className='text-[13px] text-gray-800'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Order ID:
                            </Text> BH76898
                        </Text>
                        <TouchableOpacity 
                        onPress={()=>{setShowPrompt(true)}}
                        className='flex flex-row items-center px-4 py-1 rounded-lg bg-gray-100 my-auto'>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Accept Order
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default TrackOrder;