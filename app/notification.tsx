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
import AsyncStorage from '@react-native-async-storage/async-storage';
import BuyerNotifi from '@/components/BuyerNotifi';
import VendorNotifi from '@/components/VendorNotifi';

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

    type SERVICES = 'buyer' | 'vendor' | 'rider';
    const [refreshing, setRefreshing] = useState(false);

    const [service, setService] = useState<SERVICES>('buyer');
    
    const checkService = async () => {
        const servi_ = await AsyncStorage.getItem('service');
        if (servi_ && ['buyer', 'vendor', 'rider',].includes(servi_)) {
            setService(servi_ as SERVICES); // Type assertion to SERVICES
        }
        return servi_ as SERVICES
    };

    const fetchCategories = async () => {
        try {
            const servi_  = await checkService()
            const response = await getRequest<ApiResponse>(`${ENDPOINTS[servi_]['notification']}?page_size=${pageSize}&page=${currentPage}`, true);
                   
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
                                <View key={index} className='mt-3 border-b border-gray-300'>
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
                            {item.notifications.map((sub_item, inner_) => (
                                (service == 'buyer')?
                                    <BuyerNotifi 
                                    key={inner_}
                                    image={sub_item.avatar}
                                    time={sub_item.time}
                                    items={sub_item.items}
                                    message={sub_item.message}
                                    from={sub_item.notification_from}
                                    order_id={sub_item.order_id}
                                    amount={sub_item.amount}
                                    />
                                    : 
                                    <VendorNotifi 
                                    key={inner_}
                                    image={sub_item.avatar}
                                    time={sub_item.time}
                                    items={sub_item.items}
                                    message={sub_item.message}
                                    from={sub_item.notification_from}
                                    order_id={sub_item.order_id}
                                    amount={sub_item.amount}
                                    />    
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