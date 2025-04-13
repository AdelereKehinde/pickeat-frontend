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
    type RiderData = {
        id: number;
        name: '';
        delivery_fee: string;
        status: string;
        delivered_at: string;
        assigned_at: string;
        pickup: {
            latitude: string;
            longitude: string;
            address: string;
            building_type: string;
            building_name: string;
            floor: string
        };
        items:  OrderItemsData[]
    }[]

    type ItemsData = {
        id: number;
        quantity: number; 
        time: string;
        meal_name: string;
        thumbnail: string;
        price: string;
    }
    
    type ApiResponse = { 
        id: number; 
        buyer: string; 
        order_items: OrderItemsData;
        riders: RiderData;
        order_id: string;
        service_charge: number;
        delivery_fee: number;
        time: string;
        promo_code: number;
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

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                const response = await getRequest<ApiResponse>(`${ENDPOINTS['admin']['orders']}/${id}`, true);
                // alert(JSON.stringify(response))
                setResData(response)
                setLoading(false)
            } catch (error) {
                setLoading(false) 
                // alert(error);
            }
        };
    
        fetchMeals();
    }, []); // Empty dependency array ensures this runs once
    
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
                                    {Array.from({ length: 4 }).map((_, index) => (
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

                    <View className='flex flex-row items-center justify-between w-full px-5 mt-3'>
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
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} text-[11px]`}
                                >
                                    Service Charges:
                                </Text>  
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className=' text-[11px] text-custom-green'
                                >
                                    ₦{resData?.service_charge}
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
                                    ₦{resData?.delivery_fee}
                                </Text>  
                            </View> 
                            <View className='flex flex-row items-center justify-between w-full px-5'>
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                                >
                                    Promo Code: 
                                </Text>  
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className=' text-[11px] text-custom-green'
                                >
                                    ₦{resData?.promo_code}
                                </Text>  
                            </View> 
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
                                    ₦{RoundToDecimalPlace(resData?.total || 0.000, 2)}
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
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[11px]`}
                        >
                            {resData?.delivery_address.address} ({resData?.delivery_address.building_type}) {resData?.delivery_address.building_name} | {resData?.delivery_address.floor}
                        </Text>  
                    </View> 

                    
                    <View className='mb-10 space-y-2'>
                        {resData?.riders.map((item, _) => (
                            <View key={_}>
                                <View className='w-full px-5 mt-5 flex flex-row items-center'>
                                    <View>
                                        <Text
                                        style={{fontFamily: 'Inter-SemiBold'}}
                                        className={`text-custom-green text-[12px]`}
                                        >
                                            ASSIGNED RIDER ({_ + 1})
                                        </Text>  
                                        <Text
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                                        >
                                            {TruncatedText(`${item.name}`, 20)}
                                        </Text>  
                                    </View>

                                    {(item.status == 'pending')?
                                        <TouchableOpacity
                                        className={`bg-custom-green rounded-md p-2 ml-auto flex`}
                                        onPress={()=>{alert(item.id)}}
                                        >
                                            <Text
                                            style={{fontFamily: 'Inter-Regular'}}
                                            className={`text-white text-[11px]`}
                                            >
                                                Change Rider
                                            </Text>  
                                        </TouchableOpacity>
                                        :
                                        <View
                                        className={`bg-custom-inactive-green rounded-md p-2 ml-auto flex`}
                                        >
                                            <Text
                                            style={{fontFamily: 'Inter-Regular'}}
                                            className={`text-white text-[11px]`}
                                            >
                                                {TitleCase(item.status)}
                                            </Text>  
                                        </View>
                                    }
                                </View> 

                                <View className={`mx-5`}>
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`text-custom-green text-[12px]`}
                                    >
                                        Pickup Location
                                    </Text>  
                                    <Text
                                    style={{fontFamily: 'Inter-Regular'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                                    >
                                        {item?.pickup.address} ({item?.pickup.building_type}) {item?.pickup.building_name} | {item?.pickup.floor}
                                    </Text>  
                                </View>
                                <View className={`mx-5 flex flex-row space-x-1`}>
                                    <Text
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`text-custom-green text-[12px]`}
                                    >
                                        Fee -
                                    </Text>  
                                    <Text
                                    style={{fontFamily: 'Inter-Regular'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[11px]`}
                                    >
                                        {item?.delivery_fee}
                                    </Text>  
                                </View>
                            </View>
                        ))}
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