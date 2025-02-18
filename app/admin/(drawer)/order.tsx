import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
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

function AdminOrder(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('completed');
    
    type ListData = { id: number; buyer_name: string; price: string; location: string; thumbnail: string; tracking_id: string; status_history_status: string; status: string; items: string; date: string;}[];
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
            // const response = await getRequest<ListData>(`${ENDPOINTS['cart']['vendor-orders']}?all=true&exclude_status=completed`, true);
            const response = [
                {
                    id: 1,
                    buyer_name: 'John Davis',
                    price: '2000',
                    location: 'Abuja',
                    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxMG6duOnBRLCIvsjJxFAb7WAUj5b8iOWiAg&s',
                    tracking_id: '#yye563e',
                    status_history_status: 'completed',
                    status: 'completed',
                    items: 'string',
                    date: 'Oct 24, 2022 at 06:00 am',
                },
                {
                    id: 2,
                    buyer_name: 'John Davis',
                    price: '2000',
                    location: 'Abuja',
                    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxMG6duOnBRLCIvsjJxFAb7WAUj5b8iOWiAg&s',
                    tracking_id: '#yye563e',
                    status_history_status: 'completed',
                    status: 'completed',
                    items: 'string1',
                    date: 'Oct 24, 2022 at 06:00 am',
                }
            ]
            // alert(JSON.stringify(response))
            setParentOrders(response)
            if(!ranOnce){
                setOrders(response)
                setRanOnce(true)
            }
            // setCount(response.count)
            setLoading(false)
        } catch (error) {
            alert(error);
        } 
    };
    useEffect(() => {
        if (isFocused){  
            setLoading(true)      
            fetchMeals(); 
        }
    }, [isFocused, currentPage]); // Empty dependency array ensures this runs once
    

    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchMeals()

        setRefreshing(false); // Stop the refreshing animation
    };

    const UpdateStatus = (tracking_id: string, status: string, status_history_status: string) => {
        // alert(status_history_status)
        var newOrder = parentorders.map((item) =>
            item.tracking_id === tracking_id ? { ...item, status: status, status_history_status: status_history_status } : item
        );
        setParentOrders(newOrder);  
    }

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'custom-gray-1'} w-full h-full flex items-center`}>                
                <View className='bg-white p-4 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilter('completed')}}
                        className={`${(filter == 'all')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'all') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'all')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={()=>{setFilter('pending')}}
                        className={`${(filter == 'pending')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'pending') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'pending')? 'text-white pl-2': 'text-[#909090]'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('completed')}}
                        className={`${(filter == 'completed')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'completed') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'completed')? 'text-white pl-2': 'text-[#909090]'} text-[11px] `}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Completed 
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('cancelled')}}
                        className={`${(filter == 'cancelled')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'cancelled') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'cancelled')? 'text-white pl-2': 'text-[#909090]'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Cancelled
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className='bg-white rounded w-full p-2 mt-1'>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View>
                            <Text className='text-[#000000] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>
                                Order status control
                            </Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className='bg-white rounded w-full p-2 mt-1'>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                            <Text className='text-[#000000] text-[14px] mr-1' style={{fontFamily: 'Inter-Bold'}}>
                                Order dispute
                            </Text>
                            <Text className='text-[#228B22] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>(5)</Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full mt-1 mb-4 relative flex flex-row items-center justify-center`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full p-1 mb-40 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (filter==='all' ? parentorders.length : parentorders.filter((item)=>item.status.includes(filter)).length == 0)) && (
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
                        {parentorders.filter((item)=>item.status.includes(filter)).map((item) => (
                            <View key={item.id}>
                                <AdminOrderHistory 
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
                        {/* <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} /> */}
                    </ScrollView>
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}

export default AdminOrder;