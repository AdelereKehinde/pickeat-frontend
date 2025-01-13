import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Check from '../../assets/icon/check.svg'
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Empty from '../../assets/icon/empy_transaction.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';

export default function Services(){
    const [filter, setFilter] = useState('in progress');
    
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);

    type ListData = { id: number; store_name: string; price: string; tracking_id: string; status_history_status: string; kitchen: string; status: string; order_id: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [parentorders, setParentOrders] = useState<ListData>([]);
    const [orders, setOrders] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    const [paginationLoad, setPaginationLoad] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            setLoading(true)
            // setParentOrders([])
            if (ranOnce){
                // setPaginationLoad(true)
            }
            const response = await getRequest<ListData>(`${ENDPOINTS['cart']['buyer-orders']}?all=true`, true);
            // alert(JSON.stringify(response))
            setParentOrders(response) 
            // setCount(response.count)
            if(!ranOnce || paginationLoad){
                setOrders(response)
                setRanOnce(true)
            }
            // alert(JSON.stringify(res))
            // setPaginationLoad(false)
            setLoading(false)
        } catch (error) {
            // alert(error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
    
        // setTransactions([])
        const response = await getRequest<ListData>(`${ENDPOINTS['cart']['buyer-orders']}?all=true`, true);
            // alert(JSON.stringify(response))
        setParentOrders(response)
    
        setRefreshing(false); // Stop the refreshing animation
    };
    
    useEffect(() => {
        if (isFocused){
            fetchMeals(); 
        }
    }, [isFocused, currentPage]); // Empty dependency array ensures this runs once


    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-gray-100 w-full'>
                    <TitleTag withprevious={false} title='Bookings' withbell={true} />
                </View>
                
                <Text
                className='text-custom-green text-[18px] self-start pl-5 pt-5'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    My Bookings
                </Text>

                <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilter('in progress') }}
                        className={`${(filter == 'in progress')? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter == 'in progress') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'in progress')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Accepted
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('cancelled')}}
                        className={`${(filter == 'cancelled')? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'cancelled') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'cancelled')? 'text-white pl-2': ' text-gray-500'} text-[11px] `}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Cancelled
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('completed')}}
                        className={`${(filter == 'completed')? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'completed') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'completed')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Completed
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className='bg-white w-full my-3 mb-40 relative flex flex-row items-center justify-center'>
                    
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mt-4  space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (parentorders.filter((item)=>item.status.includes(filter)).length == 0)) && (
                            <View className='flex items-center'> 
                                <Empty/>
                            </View>
                        )}
                        {((parentorders.length === 0 && loading)) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className='border-b border-gray-300'>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
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
                        {parentorders.filter((item)=>item.status.includes(filter)).map((item) => (
                            <View key={item.id}> 
                                <ServicesLayout 
                                kitchen={item.store_name} 
                                price={item.price} 
                                date={item.date}
                                items={item.items}
                                order_id={item.tracking_id}
                                status={item.status}
                                /> 
                            </View>
                        ))}
                    {/* <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} /> */}
                    </ScrollView>
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}