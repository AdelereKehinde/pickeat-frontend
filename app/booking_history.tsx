import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Empty from '../assets/icon/empy_transaction.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function BookingHistory(){
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);

    const { theme, toggleTheme } = useContext(ThemeContext);
    
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);

    type ListData = { id: number; status: string; order_id: string; kitchens: string[]; price: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [orders, serOrders] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            setLoading(true)
            serOrders([])
            const response = await getRequest<OrderResponse>(`${ENDPOINTS['cart']['buyer-orders']}?page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            serOrders(response.results)
            setCount(response.count)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            // alert(error);
        }
    };

    useEffect(() => {
        fetchMeals(); 
    }, [currentPage]); // Empty dependency array ensures this runs once

    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchMeals()
    
        setRefreshing(false); // Stop the refreshing animation
    };

    return (
        <SafeAreaView className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'}`}>
            <View className={`${theme == 'dark'? 'text-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>
                
                <Text
                className='text-custom-green text-[18px] self-start pl-5 mt-5'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Booking History
                </Text>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full my-3 mb-28 relative flex items-center`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mt-4 space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && orders.length === 0) && (
                            <View className='flex items-center'> 
                                <Empty/>
                            </View>
                        )}
                        {(loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <View key={index} className='border-b border-gray-300'>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor={(theme == 'dark')? '#111827':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            {/* <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" /> */}
                                            <Rect x="230" y="20" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="230" y="50" rx="5" ry="5" width="90" height="25" />
                                            <Rect x="20" y="10" rx="5" ry="5" width="80" height="10" />
                                            <Rect x="20" y="30" rx="5" ry="5" width="120" height="10" />
                                            <Rect x="20" y="60" rx="5" ry="5" width="150" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }
                        {orders.map((item) => (
                            <View key={item.id}> 
                                <ServicesLayout 
                                kitchens={item.kitchens} 
                                price={item.price} 
                                date={item.date}
                                items={item.items}
                                order_id={item.order_id}
                                status={item.status}
                                /> 
                            </View>
                        ))}
                        {((orders.length != 0) && (count > orders.length)) && 
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}