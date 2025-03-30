import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router'
import TitleTag from '@/components/Title';
import DoubleCheck from '../assets/icon/double_check.svg';
import RadioButton from '../assets/icon/radio-button.svg';
import Prompt from '@/components/Prompt';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import FullScreenLoader from '@/components/FullScreenLoader';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleCase from '@/components/TitleCase';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import BuyerCompleteOrderPrompt from '@/components/BuyerCompleteOrderPrompt';

function getCurrentTimeFormatted(): string {
    const currentTime = new Date();
  
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert hours from 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;  // the hour '0' should be '12'
  
    // Ensure minutes stays as a number but pad with a leading zero if necessary
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  
    // Return the formatted time
    return `${hours}:${paddedMinutes} ${ampm}`;
}




function TrackOrder(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const {order_id, kitchen} = useGlobalSearchParams()
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(false)

    const [isActive, setIsActive] = useState(true)
    const [statement, setStatement] = useState("The rider is on the way. Click this button when you've received your order from the rider")

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
    type responseData = { name: string; store_id: number; status: string; delivery_time: string; data: ListData_}[];
    const [history, setHistory] = useState<responseData>([]);

    const fetchMeals = async () => {
        try {
            // setParentOrders([])
            const response = await getRequest<responseData>(`${ENDPOINTS['cart']['orders-history']}?order_id=${order_id}`, true);
            // alert(JSON.stringify(response))
            setHistory(response)
            // setCount(response.count) 
        } catch (error) {
            // alert(error);
        }
    };

    const callFetchMeal = async() =>{
        setLoading(true)
        await fetchMeals()
        setLoading(false)
    }
    
    useEffect(() => {
        callFetchMeal()
    }, []); // Empty dependency array ensures this runs once

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        // setTransactions([])
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };

    const [showPrompt, setShowPrompt] = useState(false)
    const [completedMessage, setCompletedMessage] = useState({
        title: '',
        message: ''
    })
    const OnPromptClick = () => {
        setShowPrompt(false)
    }

    const OrderStatusUpdate = async (status_:string, store_id: number) => {
        try {
        if(!loading2){
            setLoading2(true)
            type ResData = { status: string; message: string; data: {
                title: string;
                message: string;
            }};
            var res = await postRequest<ResData>(`${ENDPOINTS['cart']['buyer-order-status-update']}`, {status: 'completed', order_id: order_id, store_id: store_id}, true);
            setCompletedMessage({
                "title": res.data.title,
                "message": res.data.message
            })

            setShowPrompt(true)

            const hs = history.find((item) => item.store_id == store_id)
            if (hs) {
                hs.status = 'completed';  // This will modify the object directly in the array
            }

            setLoading2(false)
        }

        } catch (error:any) {
            setLoading2(false)
            // alert(JSON.stringify(error))
            Toast.show({
                type: 'error',
                text1: error.data?.message || 'An error ocurred.',
                // text2: error.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }
    };

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

                {showPrompt && 
                    <BuyerCompleteOrderPrompt title={completedMessage.title} message={completedMessage.message} order_id={order_id} clickFunction={OnPromptClick}/>
                }

                <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    <Text
                    className='text-custom-green text-[16px] p-4'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Order Progess
                    </Text>
                    
                    {history.map((item, _) => (
                        <View key={_}>
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
                                        {(item.data.find((item) => item.status == "accepted") === undefined)? <RadioButton/>:<DoubleCheck/>}
                                        <View className={`w-[2px] h-8 ${(item.data.find((item) => item.status == "accepted") === undefined)? 'bg-gray-200':'bg-custom-green'} `}>

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
                                        The courier has delivered your order.
                                    </Text>
                                </View>
                            </View> 

                            <View className='p-4 flex flex-row justify-between items-center'>
                                <Text
                                className='text-custom-green text-[14px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {item.delivery_time}
                                </Text>
                                <Text
                                className='text-gray-400 text-[12px]'
                                style={{fontFamily: 'Inter-SemiBold'}} 
                                >
                                    Estimated time of delivery
                                </Text>
                            </View>

                            {((item.status == 'shipped')) &&
                                <View className='flex items-center justify-around w-full mb-8'>
                                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full px-5 py-2 mt-12 flex justify-around items-center mb-2`}>
                                        <Text
                                        style={{fontFamily: 'Inter-Regular'}}
                                        className={`text-custom-green text-center text-[11px]`}
                                        >
                                            The rider is on the way.{'\n'}Click this button when you've received your order from the rider
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                    onPress={()=>{OrderStatusUpdate('complete', item.store_id)}}
                                    className={`text-center bg-custom-green ${(loading2) && 'bg-custom-inactive-green'} w-[90%] mx-auto relative rounded-md placeholder-yellow-100 py-2 px-2 self-center flex items-center justify-around`}
                                    >
                                        <Text
                                        className='text-white text-[12px]'
                                        style={{fontFamily: 'Inter-Medium'}}
                                        >
                                        Complete
                                        </Text>
                                        {(loading2) && (
                                            <View className='absolute w-full top-2'>
                                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            }

                            {((item.status == 'completed')) &&
                                <View className='flex flex-row items-center justify-around w-full mb-8'>
                                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full px-5 py-2 mt-12 flex justify-around items-center mb-2`}>
                                        <Text
                                        style={{fontFamily: 'Inter-Regular'}}
                                        className={`text-custom-green text-center text-[11px]`}
                                        >
                                            This order has been completed
                                        </Text>
                                    </View> 
                                </View>
                            }
                        </View>
                    ))}

                    

                    <View className='px-4 flex flex-row justify-between items-center my-10'>
                        <Text
                        className='text-[14px] text-custom-green'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            <Text
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-900'} text-[15px]`}
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
            <Toast config={toastConfig} />
        </SafeAreaView>
    )
}

export default TrackOrder;