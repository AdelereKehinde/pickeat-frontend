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
    const [filter, setFilter] = useState('all');
    
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

    const Categories = [
        {id: '1', name: 'all'},
        {id: '2', name: 'pending'},
        {id: '3', name: 'completed'},
        {id: '4', name: 'cancelled'},
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
                        onPress={()=>{setFilter(item.name)}}
                        className={`bg-gray-100 rounded-lg ${(filter == item.name) && 'bg-custom-green'} px-4 py-2 flex flex-row items-center`}
                        >
                            {(filter== item.name) && (
                                <Check />
                            )}
                            <Text
                            className={`${(filter == item.name)? 'text-white':'text-gray-600'} ml-1 text-[12px] text-center`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {TitleCase(item.name)}
                            </Text>
                        </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                    />
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full p-2 mt-1`}>
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
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} rounded w-full p-2 mt-1`}>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                            <Text className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[13px] mr-1`}
                            style={{fontFamily: 'Inter-SemiBold'}}>
                                Order dispute
                            </Text>
                            <Text className='text-[#228B22] text-[13px]' 
                            style={{fontFamily: 'Inter-SemiBold'}}>(5)</Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full mt-1 mb-4 relative flex flex-row items-center justify-center`}>
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