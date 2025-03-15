import React, { useState, useEffect, useContext } from 'react';
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
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleCase from '@/components/TitleCase';

function TrackOrder(){
    const {order_id, kitchen} = useGlobalSearchParams()

    const { theme, toggleTheme } = useContext(ThemeContext);

    const [showPrompt, setShowPrompt] = useState(false)
    const [loading, setLoading] = useState(true)

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
    type responseData = { name: string; status: string; data: ListData_}[];
    const [history, setHistory] = useState<responseData>([]);

    const fetchMeals = async () => {
        try {
            setLoading(true)
            // setParentOrders([])
            
            const response = await getRequest<responseData>(`${ENDPOINTS['cart']['orders-history']}?order_id=${order_id}`, true);
            // alert(JSON.stringify(response))
            setHistory(response)
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
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                {showPrompt && (
                    <Prompt main_text='Thank you for choosing PickEat PickIt' sub_text='You’ve confirmed you’ve now collected your order' order_id='' estimated_time='' clickFunction={()=>{setShowPrompt(false)}} />
                )}
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
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
                    
                    {history.map((item) => (
                        <View>
                            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} px-4 py-3`}>
                                <Text
                                className='text-custom-green text-[13px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    From {TitleCase(item.name)}
                                </Text>
                            </View>
                            
                            <View className='w-full px-4 pt-4 space-y-1'>
                            <View className='flex flex-row w-full justify-start space-x-2'>
                                <Text
                                className='text-gray-500 text-[12px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    {(item.data.find((item) => item.status == "accepted") !== undefined)?
                                        item.data.find((item) => item.status == "accepted")?.date
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
                                    {item.name} has recieved and {'\n'}confirmed your order
                                </Text>
                            </View>

                            <View className='flex flex-row w-full justify-start space-x-2'>
                                <Text
                                className='text-gray-500 text-[12px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                {(item.data.find((item) => item.status == "preparing") !== undefined)?
                                        item.data.find((item) => item.status == "preparing")?.date
                                        :
                                        '---------' 
                                    }
                                </Text>
                                <View className='flex items-center space-y-1'>
                                    {(item.data.find((item) => item.status == "preparing") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                    <View className={`w-[2px] h-8 ${(item.data.find((item) => item.status == "preparing") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

                                    </View>
                                </View>
                                <Text
                                className='text-gray-500 text-[12px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    {item.name} is preparing your order
                                </Text>
                            </View>

                            <View className='flex flex-row w-full justify-start space-x-2'>
                                <Text
                                className='text-gray-500 text-[12px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    {(item.data.find((item) => item.status == "ready") !== undefined)?
                                        item.data.find((item) => item.status == "ready")?.date
                                        :
                                        '---------' 
                                    }
                                </Text>
                                <View className='flex items-center space-y-1'>
                                    {(item.data.find((item) => item.status == "ready") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                    <View className={`w-[2px] h-8 ${(item.data.find((item) => item.status == "ready") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

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
                                {(item.data.find((item) => item.status == "shipped") !== undefined)?
                                        item.data.find((item) => item.status == "shipped")?.date
                                        :
                                        '---------' 
                                    }
                                </Text>
                                <View className='flex items-center space-y-1'>
                                    {(item.data.find((item) => item.status == "shipped") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                    <View className={`w-[2px] h-8 ${(item.data.find((item) => item.status == "shipped") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

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
                                    {(item.data.find((item) => item.status == "completed") !== undefined)?
                                        item.data.find((item) => item.status == "completed")?.date
                                        :
                                        '---------' 
                                    }
                                </Text>
                                <View className='flex items-center space-y-1'>
                                {(item.data.find((item) => item.status == "completed") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                </View>
                                <Text
                                className='text-gray-500 text-[12px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    The courier is delivering your order
                                </Text>
                            </View>
                        </View>

                        <View className='p-4 flex flex-row justify-between items-center'>
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
                        </View>
                    ))}

                    <View className='px-4 flex flex-row justify-between items-center'>
                        <Text
                        className='text-[12px] text-gray-500'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            <Text
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Order ID:
                            </Text> {order_id}
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