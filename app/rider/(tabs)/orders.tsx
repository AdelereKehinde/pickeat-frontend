import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, FlatList, TouchableOpacity, RefreshControl } from "react-native";
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
import RiderOrder2 from '@/components/RiderOrder2';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function Orders(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);

    type ListData = { id: number; order_id: string; kitchen_address: string; kitchen_thumbnail: string; time: string; kitchen_name: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};
    
    const [orders, setOrders] = useState<ListData>([]);
    const [orderFilter, setOrderFilter] = useState('pending');
    const [displayType, setDisplayType] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMeals = async () => {
        try {
            setLoading(true)
            // setParentOrders([])
            if (ranOnce){
                setFilterLoading(true)
            }else{
                setRanOnce(true)
            }
            const response = await getRequest<OrderResponse>(`${ENDPOINTS['rider']['task']}?page_size=${pageSize}&page=${currentPage}&status=${orderFilter}`, true);
            // alert(JSON.stringify(response))
            if (['completed', 'cancelled'].includes(orderFilter)){
                setDisplayType(2)
            }else{
                setDisplayType(1)
            }
            setOrders(response.results) 
            setCount(response.count)
            setLoading(false)
            setFilterLoading(false)
        } catch (error) {
            // alert(error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // setTransactions([])
        const response = await getRequest<OrderResponse>(`${ENDPOINTS['rider']['task']}?page_size=${pageSize}&page=${currentPage}&status=${orderFilter}`, true);
        setOrders(response.results)
        setRefreshing(false); // Stop the refreshing animation
    };
    
    useEffect(() => {
        // if (isFocused){
            fetchMeals(); 
        // }
    }, [currentPage, orderFilter]); // Empty dependency array ensures this runs once

    const filterKeys = [
        {'name': "Pending Orders", 'id': 'pending'},
        {'name': "Ongoing Orders", 'id': 'accepted'},
        {'name': "Completed Orders", 'id': 'completed'},
        {'name': "Cancelled Orders", 'id': 'rejected'},
    ]
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={false} title='Orders' withbell={true} />
                </View>

                {filterLoading && (
                    <FullScreenLoader />
                )}

                <Text
                className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[18px] self-start pl-5 py-5`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    My Orders
                </Text>

                <View className='flex flex-row w-full px-2 space-x-2'>
                    <FlatList
                        data={filterKeys}
                        keyExtractor={(item) => item.id + ''}
                        horizontal={true}  // This makes the list scroll horizontally
                        ItemSeparatorComponent={() => <View className='w-3' />}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                            onPress={()=>{setOrderFilter(item.id)}}
                            className={`bg-gray-100 rounded-lg ${(orderFilter == item.id) && 'bg-custom-green'}`}
                            >
                                <Text
                                className={`${(orderFilter == item.id)? 'text-white':'text-gray-600'} text-[11px] text-center p-3`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                        />
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full my-3 mb-44 relative flex flex-row items-center justify-center`}>
                    
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mt-4 space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (orders.length == 0)) && (
                            <View className='flex items-center'> 
                                <Empty/>
                            </View>
                        )}
                        {((orders.length === 0 && loading)) && 
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
                        }
                        {orders.map((item) => (
                            <View key={item.id}>
                                {(displayType == 1)?
                                    <RiderOrder 
                                        task_id={item.id}
                                        order_id={item.order_id}
                                        image={item.kitchen_thumbnail}
                                        name={item.kitchen_name}
                                        time={item.time}
                                        address={item.kitchen_address}
                                    />
                                    :
                                    <RiderOrder2 
                                        task_id={item.id}
                                        order_id={item.order_id}
                                        image={item.kitchen_thumbnail}
                                        name={item.kitchen_name}
                                        time={item.time}
                                        address={item.kitchen_address}
                                    />
                                }
                                
                            </View>
                        ))}
                    <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                    </ScrollView>
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}