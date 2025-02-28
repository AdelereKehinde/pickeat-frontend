import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Check from '../../../assets/icon/check.svg'
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Empty from '../../../assets/icon/empy_transaction.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import RiderOrder from '@/components/RiderOrder';

export default function Orders(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(true);

    type ListData = { id: number; buyer_name: string; location: string; thumbnail: string; tracking_id: string; status_history_status: string; status: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};
    
    const [parentorders, setParentOrders] = useState<ListData>([]);
    const [orders, setOrders] = useState<ListData>([]);
    const [orderFilter, setOrderFilter] = useState('pending');

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
            // fetchMeals(); 
        }
    }, [isFocused, currentPage]); // Empty dependency array ensures this runs once

    const UpdateStatus = (tracking_id: string, status: string, status_history_status: string) => {
        // alert(status_history_status)
        var newOrder = parentorders.map((item) =>
            item.tracking_id === tracking_id ? { ...item, status: status, status_history_status: status_history_status } : item
        );
        setParentOrders(newOrder);  
    }
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={false} title='Orders' withbell={true} />
                </View>
                
                <Text
                className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[18px] self-start pl-5 py-5`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    My Orders
                </Text>

                <View className='flex flex-row w-full px-5'>
                    <TouchableOpacity
                    onPress={()=>{setOrderFilter('pending')}}
                    className={`grow ${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg ${(orderFilter == 'pending') && 'bg-custom-green'}`}
                    >
                        <Text
                        className={`${(orderFilter == 'pending')? 'text-white':'text-gray-500'} text-[12px] text-center p-3`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Pending Orders
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{setOrderFilter('ongoing')}}
                    className={`grow ${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg ${(orderFilter == 'ongoing') && 'bg-custom-green'}`}
                    >
                        <Text
                        className={`${(orderFilter == 'ongoing')? 'text-white':'text-gray-500'} text-[12px] text-center p-3`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Ongoing Orders
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full my-3 mb-44 relative flex flex-row items-center justify-center`}>
                    
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mt-4  space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {/* {(!loading && (parentorders.filter((item)=>item.status.includes(orderFilter)).length == 0)) && (
                            <View className='flex items-center'> 
                                <Empty/>
                            </View>
                        )}
                        {((parentorders.length === 0 && loading)) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className={` ${theme == 'dark'? 'border-gray-700' : ' border-gray-300'} border-b`}>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            <Rect x="230" y="20" rx="5" ry="5" width="90" height="10" />
                                            <Rect x="230" y="50" rx="5" ry="5" width="90" height="25" />
                                            <Rect x="20" y="10" rx="5" ry="5" width="80" height="10" />
                                            <Rect x="20" y="30" rx="5" ry="5" width="120" height="10" />
                                            <Rect x="20" y="60" rx="5" ry="5" width="150" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        } */}
                        {parentorders.filter((item)=>item.status.includes(orderFilter)).map((item) => (
                            <View key={item.id}>
                                <RiderOrder 
                                status_history_status={item.status_history_status} 
                                tracking_id={item.tracking_id} 
                                image={item.thumbnail} 
                                name={item.buyer_name} 
                                time={item.date} 
                                address={item.location} 
                                status={item.status} 
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