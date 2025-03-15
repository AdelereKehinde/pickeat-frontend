import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, FlatList, TouchableOpacity, RefreshControl } from "react-native";
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
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleCase from '@/components/TitleCase';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function Services(){
    const [filter, setFilter] = useState('pending');
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(true);

    type ListData = { id: number; status: string; order_id: string; kitchens: string[]; price: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [parentorders, setParentOrders] = useState<ListData>([]);
    const [orders, setOrders] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

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
            const response = await getRequest<OrderResponse>(`${ENDPOINTS['cart']['buyer-orders']}?status=${filter}&page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            setParentOrders(response.results) 
            setCount(response.count)
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
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };
    
    useEffect(() => {
        if (isFocused){
            fetchMeals(); 
        }
    }, [currentPage, filter]); // Empty dependency array ensures this runs once

    const Categories = [
        {id: '1', name: 'pending', main: 'pending'},
        {id: '2', name: 'accepted', main: 'in progress'},
        {id: '3', name: 'completed', main: 'completed'},
        {id: '4', name: 'cancelled', main: 'cancelled'},
    ]

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={false} title='Bookings' withbell={true} />
                </View>
                
                {loading && (
                    <FullScreenLoader />
                )}

                <Text
                className={`${theme == 'dark'? 'text-white' : ' text-custom-green'} text-[18px] self-start pl-5 pt-5`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    My Bookings
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

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full my-3 mb-44 relative flex flex-row items-center justify-center`}>
                    
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mt-4  space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (parentorders.length == 0)) && (
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
                        {parentorders.map((item) => (
                            <View key={item.id}> 
                                <ServicesLayout 
                                kitchens={item.kitchens} 
                                price={item.price} 
                                date={item.date}
                                items={item.items}
                                order_id={item.order_id}
                                status={item.status}
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