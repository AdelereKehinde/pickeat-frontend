import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, RefreshControl, FlatList } from "react-native";
import { router } from 'expo-router'
import Check from '../../../assets/icon/check.svg'
import AdminOrderHistory from '@/components/AdminOrderHistory';
import { getRequest } from '@/api/RequestHandler';
import Empty from '../../../assets/icon/Empty2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ArrowRightCircle from '../../../assets/icon/arrow-right-circle.svg';
import TitleCase from '@/components/TitleCase';

function AdminOrder(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    
    type ListData = { id: number; buyer: string; order_items: number; date: string; status: string; price: string; thumbnail: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [orders, setOrders] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            const response = await getRequest<OrderResponse>(`${ENDPOINTS['admin']['orders']}?status=${filter}&page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            setOrders(response.results)
            setCount(response.count)
        } catch (error) {
            setLoading(false)     
            // alert(error);
        } 
    };

    const useFetchMeal = async() =>{
        setLoading(true) 
        setOrders([])
        await fetchMeals()  
        setLoading(false) 
    }
    useEffect(() => { 
        useFetchMeal(); 
    }, [filter]); // Empty dependency array ensures this runs once
    

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };

    // const UpdateStatus = (tracking_id: string, status: string, status_history_status: string) => {
    //     // alert(status_history_status)
    //     var newOrder = parentorders.map((item) =>
    //         item.tracking_id === tracking_id ? { ...item, status: status, status_history_status: status_history_status } : item
    //     );
    //     setParentOrders(newOrder);  
    // }

    const Categories = [
        {id: '1', name: 'pending', main: 'pending'},
        {id: '2', name: 'accepted', main: 'in progress'},
        {id: '3', name: 'completed', main: 'completed'},
        {id: '4', name: 'cancelled', main: 'cancelled'},
    ]

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'text-gray-100'} w-full h-full flex items-center`}>                
                <View className={`${theme == 'dark'? 'bg-gray-900' : 'text-white'} p-4 flex flex-row w-full justify-around`}>
                    <FlatList
                    data={Categories}
                    keyExtractor={(item) => item.id}
                    horizontal={true}  // This makes the list scroll horizontally
                    ItemSeparatorComponent={() => <View className='w-3' />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={()=>{setFilter(item.main)}}
                        className={`bg-white rounded-lg ${(filter == item.main) && 'bg-custom-green'} px-4 py-2 flex flex-row items-center`}
                        >
                            {(filter== item.main) && (
                                <Check />
                            )}
                            <Text
                            className={`${(filter == item.main)? 'text-white':'text-gray-600'} ml-1 text-[12px] text-center`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {TitleCase(item.main)}
                            </Text>
                        </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                    />
                </View>

                {/* <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full p-2 mt-1`}>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View>
                            <Text className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[13px]`} 
                            style={{fontFamily: 'Inter-SemiBold'}}>
                                Order status control
                            </Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> */}

                <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full p-2 mt-1`}>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                            <Text className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[13px] mr-1`}
                            style={{fontFamily: 'Inter-SemiBold'}}>
                                Order dispute
                            </Text>
                            <Text className='text-[#228B22] text-[13px]' 
                            style={{fontFamily: 'Inter-SemiBold'}}>(0)</Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full mt-1 relative flex flex-row items-center justify-center`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full p-1 mb-32 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (orders.length == 0)) && (
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
                        
                        {(loading) && 
                            <View className='flex space-y-2 w-screen px-3 overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className={` ${theme == 'dark'? 'border-gray-700' : ' border-gray-300'}`}>
                                        <ContentLoader
                                        width="100%"
                                        height={90}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            <Rect x="" y="0" rx="5" ry="5" width="100%" height="90" />
                                            <Rect x="10" y="5" rx="5" ry="5" width="70" height="80" />
                                            <Rect x="90" y="15" rx="5" ry="5" width="70" height="10" />
                                            <Rect x="90" y="35" rx="5" ry="5" width="100" height="10" />
                                            <Rect x="90" y="65" rx="5" ry="5" width="150" height="10" />
                                            
                                            <Rect x="270" y="15" rx="5" ry="5" width="50" height="30" />
                                            <Rect x="270" y="65" rx="5" ry="5" width="50" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }
                        {orders.map((item) => (
                            <View key={item.id}>
                                <AdminOrderHistory 
                                id={item.id}
                                image={item.thumbnail}
                                name={item.buyer} 
                                price={item.price}
                                date={item.date}
                                status={item.status}
                                order_items={item.order_items}
                                /> 
                            </View>
                        ))}
                        {((orders.length != 0) && (count > orders.length)) && 
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
                    </ScrollView>
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}

export default AdminOrder;