import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, ScrollView, TouchableOpacity } from "react-native";
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

function Order(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('pending');
    
    type ListData = { id: number; buyer_name: string; location: string; thumbnail: string; tracking_id: string; status_history_status: string; status: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [parentorders, setParentOrders] = useState<ListData>([]);
    const [orders, setOrders] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    const fetchMeals = async () => {
        try {
            setLoading(true)
            // setParentOrders([])
            const response = await getRequest<ListData>(`${ENDPOINTS['cart']['vendor-orders']}?all=true&exclude_status=completed`, true);
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
            fetchMeals(); 
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
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="light-content" backgroundColor="#228B22" />
                <View className='bg-blue-100 w-full'>
                    <TitleTag withprevious={false} title='Orders' withbell={false} />
                </View>

                <Text
                className='text-custom-green text-[16px] self-start pl-5 mt-5'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    My Orders
                </Text>
                
                <View className='my-3 mt-3 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilter('pending')}}
                        className={`${(filter == 'pending')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'pending') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'pending')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('in progress')}}
                        className={`${(filter == 'in progress')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'completed') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'in progress')? 'text-white pl-2': ' text-gray-500'} text-[11px] `}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Confirmed 
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('cancelled')}}
                        className={`${(filter == 'cancelled')? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'cancelled') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'cancelled')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Cancelled
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className='bg-white w-full my-3 mb-36 relative flex flex-row items-center justify-center'>
                    <ScrollView className='w-full p-1 mb-2 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (parentorders.filter((item)=>item.status.includes(filter)).length == 0)) && (
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
                        
                        {(parentorders.length === 0 && loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 6 }).map((_, index) => (
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
                        {parentorders.filter((item)=>item.status.includes(filter)).map((item) => (
                            <View key={item.id}>
                                <VendorOrder status_history_status={item.status_history_status} tracking_id={item.tracking_id} image={item.thumbnail} name={item.buyer_name} time={item.date} address={item.location} status={item.status} onUpdate={UpdateStatus}/>
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

export default Order;