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
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoundToDecimalPlace from '@/components/RoundToDecimalPlace';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ChevronNext from '../../assets/icon/chevron-next.svg';
import TitleCase from '@/components/TitleCase';
import AdminOrderItem from '@/components/AdminOrderItem';
import ConnectionModal from '@/components/ConnectionModal';

export default function AdminOrderDetails(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {id} = useGlobalSearchParams()

    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    
    type OrderItemsData = {
        id: number; 
        discount: number; 
        thumbnail: number; 
        meal_price: string;
        meal_discount: string;
        meal_name: string;
        tracking_id: string;
        status: string;
        discounted_price: number;
        quantity: number;
    }[]
    
    type ApiResponse = { 
        id: number; 
        buyer: string; 
        order_items: OrderItemsData;
        order_id: string;
        time: string;
        status: string;
        status_history: string;
        total: number;
        delivery_address: {
            latitude: string;
            longitude: string;
            address: string;
            building_type: string;
            building_name: string;
            floor: string
        };
    };
    
    const [resData, setResData] = useState<ApiResponse>();
    const [isActive, setIsActive] = useState(true)
    const [status, setStatus] = useState('')
    const [statusHistory, setStatusHistory] = useState('')
    const [order_id, setOrderId] = useState('')
    const [statement, setStatement] = useState('Please choose to accept or reject this order.')
    
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                const response = await getRequest<ApiResponse>(`${ENDPOINTS['cart']['vendor-orders']}/${id}`, true);
                // alert(JSON.stringify(response))
                setStatus(response.status)
                setOrderId(response.order_id)
                setStatusHistory(response.status_history)
                setResData(response)
                setLoading(false)

                switch (response.status_history) {
                    case 'accepted':
                        setStatement('Click on the button when you start preparing the order.')
                        break;
                    case 'preparing':
                        setStatement('Click on the button when the order is ready.')
                        break;
                    case 'ready':
                        setStatement('A rider is on his way to your store.')
                        setIsActive(false)
                        break;
                    case 'cancelled':
                        setStatement('This order has been cancelled')
                        setIsActive(false)
                        break;
                    default:
                        break;
                }
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
                    var res = await postRequest(`${ENDPOINTS['cart']['vendor-order-status-update']}`, {status: 'accepted', order_id: order_id}, true);
                    setStatus('in progress')
                    setStatusHistory('accepted')
                    setStatement('Click on the button when you start preparing the order.')
                    break;
                case 'cancel':
                    var res = await postRequest(`${ENDPOINTS['cart']['vendor-order-status-update']}`, {status: 'cancelled', order_id: order_id}, true);
                    setStatement('This order has been cancelled')
                    setIsActive(false)
                    break;
                case 'preparing':
                    var res = await postRequest(`${ENDPOINTS['cart']['vendor-order-status-update']}`, {status: 'preparing', order_id: order_id}, true);
                    setStatusHistory('preparing')
                    setStatement('Click on the button when the order is ready.')
                    break;
                case 'ready':
                    if (statusHistory !== 'ready'){
                        var res = await postRequest(`${ENDPOINTS['cart']['vendor-order-status-update']}`, {status: 'ready', order_id: order_id}, true);
                        setStatusHistory('ready')
                        setStatement('A rider is on his way to your store.')
                        setIsActive(false)
                    }
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

                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                className=''
                >
                    <View className={`w-full mt-5 relative flex flex-row items-start justify-center`}>
                        <View className='w-full space-y-2'>
                            {(loading) && 
                                <View className='flex space-y-2 w-screen px-2 mt-2 overflow-hidden'>
                                    {Array.from({ length: 1 }).map((_, index) => (
                                        <View key={index} className=''>
                                            <ContentLoader
                                            width="100%"
                                            height={100}
                                            backgroundColor={(theme == 'dark')? '#111827':'#f3f3f3'}
                                            foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                            >
                                                <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" />
                                                <Rect x="230" y="10" rx="5" ry="5" width="90" height="25" />
                                                <Rect x="120" y="10" rx="5" ry="5" width="80" height="10" />
                                                <Rect x="120" y="50" rx="5" ry="5" width="80" height="10" />
                                            </ContentLoader>
                                        </View> 
                                    ))}
                                </View>
                            }
                            {resData?.order_items.map((item) => (
                                <View key={item.id} className={`rounded-md`}>
                                    <AdminOrderItem 
                                    quantity={item.quantity}
                                    image={item.thumbnail}
                                    meal_name={item.meal_name}
                                    price={item.discounted_price}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className='flex flex-row items-center justify-between w-full px-5 mt-8'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[13px] text-gray-400'
                        >
                                Order ID: {" "} 
                            <Text
                            style={{fontFamily: 'Inter-Bold'}}
                            className=' text-[14px] text-custom-green'
                            >
                                {resData?.order_id}
                            </Text>  
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className=' text-[13px] text-custom-green'
                        >
                            {resData?.time}
                        </Text>  
                    </View>  

                    <View className={`space-y-1 w-[90%] py-2 self-center`}>
                        {resData?.order_items.map((item) => (
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
                                    ₦{item.discounted_price}
                                </Text> 
                            </View>
                        ))}
                    </View>

                    <View className={`${theme == 'dark'? 'border-gray-700' : 'border-gray-400'} border-b space-y-2 pb-4 mt-4`}>
                            <View className='flex flex-row items-center justify-between w-full px-5'>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[13px]`}
                                >
                                    Total: 
                                </Text>  
                                <Text
                                style={{fontFamily: 'Inter-SemiBold'}}
                                className=' text-[13px] text-custom-green'
                                >
                                    ₦{resData?.total}
                                </Text>  
                            </View> 
                    </View>

                    <View className='w-full px-5 mt-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-custom-green text-[12px]`}
                        >
                            DELIVER TO
                        </Text>  
                        {!loading && (
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[11px]`}
                            >
                                {resData?.delivery_address.address} ({resData?.delivery_address.building_type}) {resData?.delivery_address.building_name} | {resData?.delivery_address.floor}
                            </Text>
                        )}  
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full px-5 py-2 mt-12 flex justify-around items-center mb-2`}>
                        {!loading && (
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-center text-[11px]`}
                            >
                                {statement}
                            </Text>
                        )}  
                    </View>
                    
                    {(status == 'pending') && (
                        <View className='w-[90%] mx-auto mb-10 space-y-3'>
                            <TouchableOpacity
                            onPress={()=>[OrderStatusUpdate('accept')]}
                            className={`text-center ${isActive? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
                            >
                                {loading2 && (
                                    <View className='absolute w-full top-4'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                                                
                                <Text
                                className='text-white'
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    Accept
                                </Text>
                                                                
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={()=>[OrderStatusUpdate('cancel')]}
                            className={`text-center ${isActive? 'bg-red-500' : 'bg-red-300'} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
                            >
                                {loading2 && (
                                    <View className='absolute w-full top-4'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                                                
                                <Text
                                className='text-white'
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    Cancel
                                </Text>                                
                            </TouchableOpacity>
                        </View>
                    )}

                    {((statusHistory=='accepted')) && (
                        <View className='w-[90%] mx-auto mb-10 space-y-3'>
                            <TouchableOpacity
                            onPress={()=>(OrderStatusUpdate('preparing'))}
                            className={`text-center ${isActive? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
                            >
                                {loading2 && (
                                    <View className='absolute w-full top-4'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                                                
                                <Text
                                className='text-white'
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    Preparing
                                </Text>
                                                                
                            </TouchableOpacity>
                        </View>
                    )}

                    {((statusHistory=='preparing')) && (
                        <View className='w-[90%] mx-auto mb-10 space-y-3'>
                            <TouchableOpacity
                            onPress={()=>(OrderStatusUpdate('ready'))}
                            className={`text-center ${isActive? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
                            >
                                {loading2 && (
                                    <View className='absolute w-full top-4'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                                                
                                <Text
                                className='text-white'
                                style={{fontFamily: 'Inter-Regular'}}
                                >
                                    Ready
                                </Text>                              
                            </TouchableOpacity>
                        </View>
                    )}
                    
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