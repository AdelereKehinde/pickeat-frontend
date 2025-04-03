import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import VendorOrderHistory from '@/components/VendorOrderHistory';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Empty from '../../assets/icon/empy_transaction.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import FilterModal from '@/components/FilterModal';

export default function OrderHistory(){    
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    
    type ListData = { id: number; buyer_name: string; price: string; status_history_status: string; tracking_id: string; location: string; thumbnail: string; status: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [orders, setOrders] = useState<ListData>([]);
   
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const [refreshing, setRefreshing] = useState(false);

    const [filter, setFilter] = useState('');
    const [openFilter, setOpenFilter] = useState(false)
    const filterOptions = [
        { label: 'all', value: '' },
        { label: 'pending', value: 'pending' },
        { label: 'in progress', value: 'in progress' },
        { label: 'completed', value: 'completed' },
        { label: 'cancelled', value: 'cancelled' },
    ];
    
    const fetchMeals = async () => {
        try {
            const response = await getRequest<OrderResponse>(`${ENDPOINTS['cart']['vendor-orders']}?page_size=${pageSize}&page=${currentPage}&status=${filter}`, true);
            // alert(JSON.stringify(response))
            setOrders(response.results)
            setCount(response.count)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            alert(error);
        } 
    };

    useEffect(() => {
        setLoading(true)
        setOrders([])
        fetchMeals(); 
    }, [currentPage, filter]); // Empty dependency array ensures this runs once

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };

    const UpdateStatus = (tracking_id: string, status: string, status_history_status: string) => {
        // alert(status_history_status)
        var newOrder = orders.map((item) =>
            item.tracking_id === tracking_id ? { ...item, status: status, status_history_status: status_history_status } : item
        );
        setOrders(newOrder);  
    }

    return (
        <SafeAreaView className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full`}>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View> 

                <View className='flex flex-row items-center justify-between w-full px-4 py-2'>
                    <Text
                    className={`text-[18px] ${theme == 'dark'? 'text-gray-100' : ' text-gray-900'}`}
                    style={{fontFamily: 'Inter-Bold'}}
                    >
                        Order History
                    </Text>

                    <FilterModal 
                    options={filterOptions} 
                    getValue={(value)=>{setFilter(value); setOpenFilter(false)}}
                    open={openFilter}
                    />
                </View>

                {/* <View className={`${theme == 'dark'? 'bg-gray-800 border-gray-600' : ' bg-white border-gray-200'} w-full my-3 mb-24 border-t-4 relative flex flex-row items-center justify-center`}> */}
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mt-4'
                    contentContainerStyle={{ flexGrow: 1 }}>
                        {((!loading || (orders.length !== 0)) && orders.length === 0 ) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-600'} text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    We’ll notify you when there’s an order
                                </Text>
                            </View>
                        )}
                        {(loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-md `}>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor={(theme == 'dark')? '#111827':'#fff'}
                                        foregroundColor={(theme == 'dark')? '#3a3a3a':'#ecebeb'}
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="8" y="5" rx="5" ry="5" width="70" height="90" />
                                            <Rect x="230" y="60" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="230" y="15" rx="5" ry="5" width="90" height="25" />

                                            <Rect x="90" y="10" rx="5" ry="5" width="70" height="10" />
                                            <Rect x="90" y="30" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="90" y="60" rx="5" ry="5" width="80" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }

                        <View className='space-y-2'>
                            {orders.map((item) => (
                                <View key={item.id}>
                                    <VendorOrderHistory 
                                    image={item.thumbnail}
                                    kitchen={item.buyer_name} 
                                    price={item.price}
                                    date={item.date}
                                    status_history_status={item.status_history_status}
                                    status={item.status}
                                    tracking_id={item.tracking_id}
                                    onUpdate={UpdateStatus}
                                    /> 
                                </View>
                            ))}
                        </View>
                        
                        <View className='mt-auto'>
                            {((count > orders.length)) && 
                                <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                            }
                        </View>
                    </ScrollView>
            {/* </View> */}
        </SafeAreaView>
    )
}