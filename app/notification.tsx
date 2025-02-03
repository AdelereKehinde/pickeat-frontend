import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Pagination from '@/components/Pagination';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Empty from '../assets/icon/empy_transaction.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

function Notification(){
    const { theme, toggleTheme } = useContext(ThemeContext);

    type NotificationResponse = { id: number; message: string; type: string; is_read: boolean; date: string; time: string; notification_from: string; amount: number; items: number; order_id: string; avatar: string}[];
    type NotificationResponse2 = { date: number; notifications: NotificationResponse;}[];
    type NotificationResponse1 = { total_count: number; current_page: number; total_pages: number; results: NotificationResponse2};
    type ApiResponse = { status: string; message: string; data: NotificationResponse1;};

    const [notifications, setNotifications] = useState<NotificationResponse2>([]);

    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const [refreshing, setRefreshing] = useState(false);
    const fetchCategories = async () => {
        try {
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['buyer']['notification']}?page_size=${pageSize}&page=${currentPage}`, true);
            setCount(response.data.total_count)
            setLoading(false) 
            // alert(JSON.stringify(response))
            setNotifications(response.data.results)
        } catch (error) {
            setLoading(false)
            // alert(JSON.stringify(error)); 
        }
    };

    useEffect(() => {
        setNotifications([])
        setLoading(true)
        fetchCategories();
    }, [currentPage]); // Empty dependency array ensures this runs once


    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchCategories()
    
        setRefreshing(false); // Stop the refreshing animation
    };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-50'} w-full h-full flex`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Notification' withbell={false} />
                </View>

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ flexGrow: 1 }} className='px-3'>
                    {(!loading && notifications.length === 0) && (
                        <View className='flex items-center'> 
                            <Empty/>
                        </View>
                    )}
                    {(loading) && 
                        <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <View key={index} className='mt-5 border-b border-gray-300'>
                                    <ContentLoader
                                    width="100%"
                                    height={100}
                                    backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                    foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                    >
                                        {/* Add custom shapes for your skeleton */}
                                        <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" />
                                        <Rect x="230" y="10" rx="5" ry="5" width="90" height="25" />
                                        <Rect x="120" y="10" rx="5" ry="5" width="80" height="10" />
                                        <Rect x="120" y="50" rx="5" ry="5" width="80" height="10" />
                                    </ContentLoader>
                                </View> 
                            ))}
                        </View>
                    }
                    {notifications.map((item, _) => (
                        <View className='' key={_}>
                            <Text
                            className={`${theme == 'dark'? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-500'} text-[11px] p-4 w-full`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {item.date}
                            </Text>
                            {item.notifications.map((sub_item) => (
                                <View
                                key={sub_item.id}
                                className='flex flex-row items-center justify-between space-x-3 py-3'
                                >
                                    <Image 
                                        source={{uri: sub_item.avatar}}
                                        className='w-12 h-12 rounded-full'
                                    />
                                    <View className='flex flex-row'>
                                        <View className='w-[65%] flex justify-around'>
                                            <Text
                                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[10px] w-full`}
                                            style={{fontFamily: 'Inter-Medium-Italic'}}
                                            >
                                                From {sub_item.notification_from}
                                            </Text>
                                            <Text
                                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px] w-full`}
                                            style={{fontFamily: 'Inter-Medium'}}
                                            >
                                                {sub_item.message}
                                            </Text>
                                            <Text
                                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[11px] w-full`}
                                            style={{fontFamily: 'Inter-Medium'}}
                                            >
                                                <Text
                                                className='text-custom-green text-[11px] w-full'
                                                style={{fontFamily: 'Inter-SemiBold'}}
                                                >
                                                    Order ID: {"\n"} 
                                                </Text>
                                                {sub_item.order_id} | {sub_item.items} item{(sub_item.items > 1) && 's'}
                                            </Text>
                                        </View>
                                        <View className='flex justify-between items-end grow'>
                                            <Text
                                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[11px] w-full`}
                                            style={{fontFamily: 'Inter-Medium'}}
                                            >
                                                {sub_item.time}
                                            </Text>
                                            <Text
                                            className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[12px] w-full`}
                                            style={{fontFamily: 'Inter-SemiBold'}}
                                            >
                                                ₦{sub_item.amount}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>   
                    ))}
                    
                    <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Notification;