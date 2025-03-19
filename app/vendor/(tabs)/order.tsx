import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, RefreshControl, FlatList } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import Check from '../../../assets/icon/check.svg'
import VendorOrder from '@/components/VendorOrder';
import { getRequest } from '@/api/RequestHandler';
import Empty from '../../../assets/icon/Empty2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import FullScreenLoader from '@/components/FullScreenLoader';
import TitleCase from '@/components/TitleCase';

function Order(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    
    type ListData = { id: number; buyer_name: string; address: string; thumbnail: string; order_id: string; status_history_status:string; status: string; items: number; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [parentorders, setParentOrders] = useState<ListData>([]);
    const [orders, setOrders] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const isFocused = useIsFocused(); 
    const [ranOnce, setRanOnce] = useState(false); 
    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            // setParentOrders([])
            setCount(0)
            setLoading(true)
            const response = await getRequest<OrderResponse>(`${ENDPOINTS['cart']['vendor-orders']}?status=${filter}&page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            setParentOrders(response.results)
            setCount(response.count)
            setLoading(false)
        } catch (error) {
            // alert(error);
        } 
    };

    useEffect(() => {  
        fetchMeals(); 
    }, [currentPage, filter]); // Empty dependency array ensures this runs once
    

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };

    const Categories = [
        {id: '1', name: 'pending', main: 'pending'},
        {id: '2', name: 'accepted', main: 'in progress'},
        {id: '3', name: 'completed', main: 'completed'},
        {id: '4', name: 'cancelled', main: 'cancelled'},
    ]

    const UpdateStatus = (order_id: string, status: string, status_history_status: string) => {
        // alert(status_history_status)
        var newOrder = parentorders.map((item) =>
            item.order_id === order_id ? { ...item, status: status, status_history_status: status_history_status } : item
        );
        setParentOrders(newOrder);  
    }

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full mb-4`}>
                    <TitleTag withprevious={false} title='Orders' withbell={false} />
                </View>

                {loading && (
                    <FullScreenLoader />
                )}
                <Text
                className='text-custom-green text-[16px] self-start pl-5 mt-5'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    My Orders
                </Text>
                
                <View className={`${theme == 'dark'? 'bg-gray-800' : 'text-white'} p-2 flex flex-row w-full justify-around mt-2`}>
                    <FlatList
                    data={Categories}
                    keyExtractor={(item) => item.id}
                    horizontal={true}  // This makes the list scroll horizontally
                    ItemSeparatorComponent={() => <View className='w-3' />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={()=>{setFilter(item.main)}}
                        className={`bg-white rounded-lg ${(filter == item.main) && 'bg-custom-green'} px-6 py-2 flex flex-row items-center`}
                        >
                            {(filter== item.main) && (
                                <Check />
                            )}
                            <Text
                            className={`${(filter == item.main)? 'text-white':'text-gray-600'} ml-1 text-[12px] text-center`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {TitleCase(item.name)}
                            </Text>
                        </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                    />
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full my-3 relative flex flex-row items-center justify-center`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full p-1 mb-40 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (parentorders.length == 0)) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-600'} text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    We’ll notify you when there’s an order
                                </Text>
                            </View>
                        )}
                        
                        {(parentorders.length === 0 && loading) && 
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
                        {parentorders.map((item, _) => (
                            <View key={_}>
                                <VendorOrder 
                                id={item.id}
                                order_id={item.order_id} 
                                image={item.thumbnail} 
                                name={item.buyer_name} 
                                time={item.date} 
                                address={item.address}
                                items={item.items} 
                                status_history_status={item.status_history_status} 
                                status={item.status} 
                                onUpdate={UpdateStatus}
                                />
                            </View>
                        ))}

                        {((parentorders.length > 0) && (count > parentorders.length)) &&
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
                    </ScrollView>
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}

export default Order;