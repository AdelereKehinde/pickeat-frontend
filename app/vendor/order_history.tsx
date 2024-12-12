import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import VendorOrderHistory from '@/components/VendorOrderHistory';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Empty from '../../assets/icon/empy_transaction.svg';

export default function OrderHistory(){    
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('pending');
    
    type ListData = { id: number; buyer_name: string; price: string; location: string; thumbnail: string; status: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [orders, setOrders] = useState<ListData>([]);
    const [nextUrl, setNextUrl] = useState('')

    useEffect(() => {
            const fetchMeals = async () => {
                try {
                setLoading(true)
                const response = await getRequest<OrderResponse>(`${ENDPOINTS['cart']['vendor-orders']}`, true);
                // alert(JSON.stringify(response))
                setOrders(response.results)
                setNextUrl(response.next)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                alert(error);
            } 
        };
        
        fetchMeals(); 
    }, []); // Empty dependency array ensures this runs once

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='bg-blue-100 w-full'>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>
            
            <Text
            className='text-custom-green text-[18px] self-start pl-5 mt-5'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Order History
            </Text>

            <View className='bg-white w-full my-3 mb-36 border-t-4 border-gray-200 relative flex flex-row items-center justify-center'>
                <ScrollView className='w-full mt-4 space-y-1'>
                    {((!loading || (orders.length !== 0)) && orders.length === 0 ) && (
                        <View className='flex items-center'> 
                            <Empty/>
                            <Text
                            className={`text-[11px] text-gray-600`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                We’ll notify you when there’s an order
                            </Text>
                        </View>
                    )}
                    {(orders.length === 0 && loading) && 
                        <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <View key={index} className='border-b border-gray-300'>
                                    <ContentLoader
                                    width="100%"
                                    height={100}
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
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
                    {orders.map((item) => (
                        <View key={item.id}>
                            <VendorOrderHistory 
                            image={item.thumbnail}
                            kitchen={item.buyer_name} 
                            price={item.price}
                            date={item.date}
                            status={item.status}
                            /> 
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}