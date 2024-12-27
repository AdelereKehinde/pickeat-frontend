import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router'
import TitleTag from '@/components/Title';
import DoubleCheck from '../assets/icon/double_check.svg';
import RadioButton from '../assets/icon/radio-button.svg';
import Prompt from '@/components/Prompt';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import FullScreenLoader from '@/components/FullScreenLoader';

function TrackOrder(){
    const {tracking_id, kitchen} = useGlobalSearchParams()

    const [showPrompt, setShowPrompt] = useState(false)
    const [loading, setLoading] = useState(false)
    const [trackingId, setTrackingId] = useState(Array.isArray(tracking_id)? tracking_id[0] : tracking_id)
    const [kitchenName, setKitchenName] = useState(Array.isArray(kitchen)? kitchen[0] : kitchen)

    const [orderDetail, setOrderDetail] = useState({
        order_time: '09:45am',
        preparation_time: '09:47am',
        assignation_time: '',
        pickup_time: '',
        delivery_time: '',
    })
    const STATUS_HISTORY_STATUS = ['accepted', 'preparing', 'ready', 'shipped', 'cancelled', 'completed']

    type ListData_ = {date: string; days_ago: string; status: string;}[];
    type ListData = { status: string; data: ListData_};
    const [status, setStatus] = useState<ListData>();
    const [history, setHistory] = useState<ListData_>([]);

    const fetchMeals = async () => {
        try {
            setLoading(true)
            // setParentOrders([])
            
            const response = await getRequest<ListData>(`${ENDPOINTS['cart']['orders-history']}?tracking_id=${trackingId}`, true);
            // alert(JSON.stringify(response))
            setStatus(response) 
            setHistory(response.data)
            // setCount(response.count)
            setLoading(false)
        } catch (error) {
            // alert(error);
        }
    };
    
    useEffect(() => {
        fetchMeals(); 
    }, []); // Empty dependency array ensures this runs once

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

                {loading && (
                    <FullScreenLoader />
                )}

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
                                {(history.find((item) => item.status == "accepted") !== undefined)?
                                    history.find((item) => item.status == "accepted")?.date
                                    :
                                    '---------' 
                                }
                            </Text>
                            <View className='flex items-center space-y-1'>
                                <DoubleCheck/>
                                <View className={`w-[2px] h-8 ${(history.find((item) => item.status == "accepted") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

                                </View>
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]' 
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {kitchenName} has recieved and {'\n'}confirmed your order
                            </Text>
                        </View>

                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            {(history.find((item) => item.status == "preparing") !== undefined)?
                                    history.find((item) => item.status == "preparing")?.date
                                    :
                                    '---------' 
                                }
                            </Text>
                            <View className='flex items-center space-y-1'>
                                {(history.find((item) => item.status == "preparing") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                <View className={`w-[2px] h-8 ${(history.find((item) => item.status == "preparing") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

                                </View>
                            </View>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {kitchenName} is preparing your order
                            </Text>
                        </View>

                        <View className='flex flex-row w-full justify-start space-x-2'>
                            <Text
                            className='text-gray-500 text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {(history.find((item) => item.status == "ready") !== undefined)?
                                    history.find((item) => item.status == "ready")?.date
                                    :
                                    '---------' 
                                }
                            </Text>
                            <View className='flex items-center space-y-1'>
                                {(history.find((item) => item.status == "ready") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                <View className={`w-[2px] h-8 ${(history.find((item) => item.status == "ready") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

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
                            {(history.find((item) => item.status == "shipped") !== undefined)?
                                    history.find((item) => item.status == "shipped")?.date
                                    :
                                    '---------' 
                                }
                            </Text>
                            <View className='flex items-center space-y-1'>
                                {(history.find((item) => item.status == "shipped") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                <View className={`w-[2px] h-8 ${(history.find((item) => item.status == "shipped") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

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
                                {(history.find((item) => item.status == "completed") !== undefined)?
                                    history.find((item) => item.status == "completed")?.date
                                    :
                                    '---------' 
                                }
                            </Text>
                            <View className='flex items-center space-y-1'>
                            {(history.find((item) => item.status == "completed") === undefined)? <RadioButton/>:<DoubleCheck/>}
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
                            </Text> {trackingId}
                        </Text>
                        {/* <TouchableOpacity 
                        onPress={()=>{setShowPrompt(true)}}
                        className='flex flex-row items-center px-4 py-1 rounded-lg bg-gray-100 my-auto'>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Accept Order
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default TrackOrder;