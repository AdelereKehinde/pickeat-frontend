import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Link, router, useGlobalSearchParams } from "expo-router";
import TitleTag from '@/components/Title';
import Location from '../../assets/icon/location.svg';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import FullScreenLoader from '@/components/FullScreenLoader';
import { TruncatedText } from '@/components/TitleCase';
import Delay from '@/constants/Delay';
import Empty from '../../assets/icon/empy_transaction.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoundToDecimalPlace from '@/components/RoundToDecimalPlace';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ChevronNext from '../../assets/icon/chevron-next.svg';
import { isLoading } from 'expo-font';
import RiderCompleteOrderPrompt from '@/components/RiderCompleteOrderPrompt';

export default function RiderOrderDetails(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {task_id} = useGlobalSearchParams()

    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);

    
    type PickupDeliveryData = {
        id: number; 
        latitude: number; 
        longitude: number; 
        address: string;
        building_type: string;
        building_name: string;
        floor: string;
        rider_instruction: string;
        store_name: string;
    }
    type BuyerData = {
        avatar: string;
        email: string;
        full_name: string;
        phone_number: string;
    }
    type ItemsData = {
        id: number;
        quantity: number; 
        time: string;
        meal_name: string;
        thumbnail: string;
        price: string;
    }
    
    type ApiResponse = { 
        status: string; 
        message: string; 
        data: {
            status: string;
            status_history: string;
            pickup: PickupDeliveryData;
            delivery: PickupDeliveryData;
            delivery_fee: number;
            total_including_service_charge: number;
            total_excluding_service_charge: number;
            buyer: BuyerData;
            order_detail : {
                order_id: string;
                time: string;
                service_charge: string;
                payment_mode: string;
                items: ItemsData[]
            }
        }
    ;};

    const [resData, setResData] = useState<ApiResponse>();

    const [action, setAction] = useState('')
    const [statement, setStatement] = useState('Please choose to accept or reject this order.')
    const [order_id, setOrderId] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [status, setStatus] = useState('')
    const [statusHistory, setStatusHistory] = useState('')
    const [totalWithCharge, setTotalWithCharge] = useState(0.00)
    const [totalWithoutCharge, setTotalWithoutCharge] = useState(0.00)

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                const response = await getRequest<ApiResponse>(`${ENDPOINTS['rider']['task']}/${task_id}`, true);
                // alert(JSON.stringify(response))
                setResData(response)
                setOrderId(response.data.order_detail.order_id)
                setStatusHistory(response.data.status_history)
                setStatus(response.data.status)
                setTotalWithCharge(response.data.total_including_service_charge)
                setTotalWithoutCharge(response.data.total_excluding_service_charge)

                switch (response.data.status) {
                    case 'pending':
                        setStatement('Please choose to accept or reject this order.')
                        break;
                    case 'accepted':
                        if (response.data.status_history == 'shipped'){
                            setStatement('Proceed to the delivery location')
                        }else{
                            setStatement('Click on the button when you obtain the item from the pickup location')
                        }
                        break;
                    case 'completed':
                        setStatement('This order has been completed')
                        setIsActive(false)
                        break;
                    case 'reject':
                        setStatement('This order has been rejected')
                        setIsActive(false)
                        break;
                    default:
                        break;
                }

                setLoading(false)
            } catch (error) {
                setLoading(false)
                // alert(error);
            }
        };
    
        fetchMeals();
    }, []); // Empty dependency array ensures this runs once



    const OrderStatusUpdate = async (status_:string) => {
        try {
        if(!loading2 && isActive){
            setLoading2(true)

            switch (status_) { 
                case 'accept':
                    var res = await postRequest(`${ENDPOINTS['rider']['order-status-update']}`, {status: 'accepted', task_id: task_id}, true);
                    setStatus('accepted')
                    setStatement('Click on the button when you obtain the item from the pickup location.')
                    break;
                case 'reject':
                    var res = await postRequest(`${ENDPOINTS['rider']['order-status-update']}`, {status: 'rejected', task_id: task_id}, true);
                    setStatement('This order has been rejected')
                    setStatus('rejected')
                    setIsActive(false)
                    break;
                case 'shipped':
                    var res = await postRequest(`${ENDPOINTS['rider']['order-status-update']}`, {status: 'shipped', task_id: task_id}, true);
                    setStatusHistory('shipped')
                    setStatus('accepted')
                    setStatement('Proceed to the delivery location.')
                    break;
                case 'complete':                
                    var res = await postRequest(`${ENDPOINTS['rider']['order-status-update']}`, {status: 'completed', task_id: task_id}, true);
                    setStatusHistory('completed')
                    setStatus('completed')
                    setStatement('This order has been completed.')
                    setIsActive(false)
                    break;
                default:
                    break;
            }

            // alert(status_)
            Toast.show({
                type: 'success',
                text1: 'Status Updated',
                visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            setLoading2(false)
        }

        } catch (error:any) {
            setLoading2(false)
            // alert(JSON.stringify(error))
            Toast.show({
                type: 'error',
                text1: "An error occured",
                // text2: error.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }
    };

    const [showPrompt, setShowPrompt] = useState(false)
    const OnPromptClick = () => {
        setShowPrompt(false)
    }
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
                    <TitleTag withprevious={true} title='Order details' withbell={false} />
                </View>

                {loading && (
                    <FullScreenLoader />
                )}

                {showPrompt && 
                    <RiderCompleteOrderPrompt order_id={order_id} clickFunction={OnPromptClick}/>
                }

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                className='px-4'
                >
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full my-5 rounded-lg relative flex flex-row items-start justify-center`}>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full rounded-lg p-4 flex flex-col items-start`}>
                            <View
                            className={`flex flex-row items-center border-b border-custom-green w-full pb-2`}>
                            {/* Image Preview */}
                                <Location width={22} height={22} />
                                <Text
                                style={{fontFamily: 'Inter-Bold'}}
                                className={`text-custom-green text-[13px] ml-2`}
                                >
                                    Pick Up
                                </Text>
                                <TouchableOpacity
                                onPress={()=>{
                                    router.push({
                                        pathname: '/rider/order_detail',
                                        params: { latitude: resData?.data.pickup.latitude, longitude: resData?.data.pickup.longitude},
                                    }); 
                                }}
                                className='ml-auto'
                                >
                                    <ChevronNext />
                                </TouchableOpacity>
                            </View>
                            <View  className='ml-4'>
                                {(!loading && (
                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[11px] mt-4 `}
                                    >
                                        {resData?.data.pickup.building_name} {resData?.data.pickup.building_type} - ({resData?.data.pickup.floor}) {resData?.data.pickup.address}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full mb-5 rounded-lg relative flex flex-row items-start justify-center`}>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-50'} w-full rounded-lg p-4 flex flex-col items-start`}>
                            <View
                            className={`flex flex-row items-center border-b border-custom-green w-full pb-2`}>
                            {/* Image Preview */}
                                <Location width={22} height={22} />
                                <Text
                                style={{fontFamily: 'Inter-Bold'}}
                                className={`text-custom-green text-[13px] ml-2`}
                                >
                                    Delivery
                                </Text>
                                <TouchableOpacity
                                onPress={()=>{
                                    router.push({
                                        pathname: '/rider/order_detail',
                                        params: { latitude: resData?.data.delivery.latitude, longitude: resData?.data.delivery.longitude},
                                    }); 
                                }}
                                className='ml-auto'
                                >
                                    <ChevronNext />
                                </TouchableOpacity>
                            </View>
                            <View  className='ml-4'>
                                {(!loading) && (
                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[11px] mt-4 `}
                                    >
                                        {resData?.data.delivery.building_name} {resData?.data.delivery.building_type} ({resData?.data.delivery.address} - {resData?.data.delivery.floor}) {resData?.data.delivery.address}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full mb-5 rounded-lg relative flex flex-row items-start justify-center`}>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full rounded-lg p-4 flex flex-row items-center`}>
                            <View
                            className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${loading && 'border-2 border-custom-green'}`}>
                            {/* Image Preview */}
                                <Image 
                                source={{ uri: resData?.data.buyer.avatar }} 
                                style={{ width: 100, height: 100}} />
                            </View>
                            <View  className='ml-4'>
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}}
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[13px] `}
                                >
                                    {resData?.data.buyer.full_name}
                                </Text>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[12px] mt-3`}
                                >
                                    {TruncatedText((resData?.data.buyer.email || ""), 26)}
                                </Text>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`text-custom-green text-[11px] `}
                                >
                                    {resData?.data.buyer.phone_number}
                                </Text>
                            </View>
                        </View>
                    </View>

                <View className='flex flex-row items-center justify-between w-full px-5'>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className=' text-[13px] text-gray-400'
                    >
                        Order ID: {" "} 
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className=' text-[14px] text-custom-green'
                        >
                            {resData?.data.order_detail.order_id}
                        </Text>  
                    </Text>  
                    <Text
                    style={{fontFamily: 'Inter-Regular'}}
                    className=' text-[13px] text-custom-green'
                    >
                        {resData?.data.order_detail.time}
                    </Text>  
                </View>  

                <Text
                style={{fontFamily: 'Inter-SemiBold-Italic'}}
                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[13px] mx-5`}
                >
                    {resData?.data.pickup.store_name}
                </Text>
                
                <View className='space-y-1  border-b border-gray-300 w-[90%] py-2 self-center'>
                {resData?.data.order_detail.items.map((item) => (
                    <View key={item.id} className='flex flex-row mt-5 justify-between items-center'>
                        <View
                        className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-8 h-6 rounded-md flex justify-around items-center`}
                        >
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`text-[10px] text-custom-green`}
                            >
                                X{item.quantity}
                            </Text>
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-400'} text-[13px] grow pl-4`}
                        >
                            {item.meal_name}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[13px] text-custom-green'
                        >
                            ₦{item.price}
                        </Text> 
                    </View>
                ))}
                </View>

                <View className='space-y-2 mt-4'>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} text-[11px]`}
                        >
                            Service Charges:
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-custom-green'
                        >
                            ₦{resData?.data.order_detail.service_charge}
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} text-[11px]`}
                        >
                            Delivery Charges: 
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-custom-green'
                        >
                            ₦{resData?.data.delivery_fee}
                        </Text>  
                    </View> 
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[11px]`}
                        >
                            Payment Mode
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-800'} text-[11px]`}
                        >
                            {resData?.data.order_detail.payment_mode}
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px]`}
                        >
                            Total (with service charge)
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[14px] text-custom-green'
                        >
                            ₦{RoundToDecimalPlace(totalWithCharge, 2)}
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px]`}
                        >
                            Total (without service charge)
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[14px] text-custom-green'
                        >
                            ₦{RoundToDecimalPlace(totalWithoutCharge, 2)} 
                        </Text>  
                    </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full px-5 py-2 mt-12 flex justify-around items-center mb-2`}>
                    {!loading && (
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className={`text-custom-green text-center text-[11px]`}
                        >
                            {statement}
                        </Text>
                    )}  
                </View>

                {((status == 'pending') &&  (statusHistory == 'ready')) &&
                    <View className='flex flex-row items-center px-5 justify-between w-full mb-8'>
                        <TouchableOpacity
                        onPress={()=>{OrderStatusUpdate('reject')}}
                        className={`text-center bg-gray-100 ${(loading2 || !isActive) && 'bg-gray-200'} relative rounded-md py-2 px-2 self-center flex items-center justify-around`}
                        >
                            <Text
                            className={`text-custom-green ${(loading2 || !isActive) && 'text-gray-500'} text-[12px]`}
                            style={{fontFamily: 'Inter-Medium'}} 
                            >
                            Reject Order
                            </Text>
                            {(loading2) && (
                                <View className='absolute w-full top-2'>
                                    <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{OrderStatusUpdate('accept')}}
                        className={`text-center bg-custom-green ${(loading2 || !isActive) && 'bg-custom-inactive-green'} relative rounded-md placeholder-yellow-100 py-2 px-2 self-center flex items-center justify-around`}
                        >
                            <Text
                            className='text-white text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            Accept Order
                            </Text>
                            {(loading2) && (
                                <View className='absolute w-full top-2'>
                                    <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                }

                {((status == 'accepted') && (statusHistory == 'ready')) &&
                    <View className='flex flex-row items-center px-5 justify-around w-full mb-8'>
                        <TouchableOpacity
                        onPress={()=>{OrderStatusUpdate('shipped')}}
                        className={`text-center bg-custom-green ${(loading2 || !isActive) && 'bg-custom-inactive-green'} relative rounded-md placeholder-yellow-100 py-2 px-2 self-center flex items-center justify-around`}
                        >
                            <Text
                            className='text-white text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            Shipped
                            </Text>
                            {(loading2) && (
                                <View className='absolute w-full top-2'>
                                    <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                }
 
                {((statusHistory == 'shipped')) &&
                    <View className='flex flex-row items-center px-5 justify-around w-full mb-8'>
                        <TouchableOpacity
                        onPress={()=>{setShowPrompt(true)}}
                        className={`text-center bg-custom-green ${(loading2 || !isActive) && 'bg-custom-inactive-green'} relative rounded-md placeholder-yellow-100 py-2 px-2 self-center flex items-center justify-around`}
                        >
                            <Text
                            className='text-white text-[12px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            Complete Order
                            </Text>
                            {(loading2) && (
                                <View className='absolute w-full top-2'>
                                    <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                }
                
                <View className={`w-full mb-3 rounded-lg`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[12px] my-2 ml-3`}
                    >
                        Special pickup instruction
                    </Text>
                    <View  className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg p-3`}>
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[12px] `}
                        >
                            {resData?.data.pickup.rider_instruction}
                        </Text>
                    </View>
                </View>

                <View className={`w-full mb-10 rounded-lg`}>
                    <Text
                    style={{fontFamily: 'Inter-SemiBold'}}
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[12px] my-2 ml-3`}
                    >
                        Special delivery instruction                    </Text>
                    <View  className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg p-3`}>
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[12px] `}
                        >
                            {resData?.data.delivery.rider_instruction}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            </View>
            <Toast config={toastConfig} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  shadow_box: {
    // iOS shadow properties
    shadowColor: '#1212126a',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    // Android shadow property
    elevation: 100,
  },
});