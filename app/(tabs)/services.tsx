import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from "react-native";
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

export default function Services(){
    const [filterIndex, setFilterIndex] = useState(1);
    
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);

    type ListData = { id: number; store_name: string; price: string; status: string; order_id: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [parentorders, setParentOrders] = useState<ListData>([]);
    const [orders, setOrders] = useState<ListData>([]);
    const [nextUrl, setNextUrl] = useState('')

    const Filter = (index: number) =>{
        setFilterIndex(index)
        switch (index) {
            case 1:
                var newOrder = parentorders.filter((item)=>item.status.includes("Pending"))
                setOrders(newOrder)
                break;
            case 2:
                var newOrder = parentorders.filter((item)=>item.status.includes("Completed"))
                setOrders(newOrder)
                break;
            case 3:
                var newOrder = parentorders.filter((item)=>item.status.includes("Cancelled"))
                setOrders(newOrder)
                break;
            default:
                alert('default')
                var newOrder = parentorders.filter((item)=>item.status.includes("Pending"))
                setOrders(newOrder)
                break;
        }
    }

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    useEffect(() => {
        if (isFocused){
            const fetchMeals = async () => {
                try {
                    setLoading(true)
                    const response = await getRequest<OrderResponse>(`${ENDPOINTS['cart']['buyer-orders']}`, true);
                    setParentOrders(response.results)
                    if(!ranOnce){
                        setOrders(response.results)
                        setRanOnce(true)
                    }
                    setNextUrl(response.next)
                    setLoading(false)
                } catch (error) {
                    alert(error);
                }
            };
        
            fetchMeals(); 
        }
    }, [isFocused]); // Empty dependency array ensures this runs once


    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-gray-100 w-full'>
                <TitleTag withprevious={false} title='Bookings' withbell={true} />
            </View>
            
            <Text
            className='text-custom-green text-[18px] self-start pl-5 pt-5'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                My Bookings
            </Text>

            <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                <TouchableOpacity 
                    onPress={()=>{Filter(1) }}
                    className={`${(filterIndex == 1)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >   
                    {(filterIndex == 1) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 1)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Pending
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{Filter(2)}}
                    className={`${(filterIndex == 2)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 2) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 2)? 'text-white pl-2': ' text-gray-500'} text-[11px] `}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Cancelled
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{Filter(3)}}
                    className={`${(filterIndex == 3)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                >
                    {(filterIndex == 3) && (
                        <Check />
                    )}
                    <Text
                    className={`${(filterIndex == 3)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                    style={{fontFamily: 'Inter-Medium'}}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            <View className='bg-white w-full my-3 mb-52 relative flex flex-row items-center justify-center'>
                
                <ScrollView className='w-full mt-4 space-y-1'>
                    {((!loading || (parentorders.length !== 0)) && orders.length === 0 ) && (
                        <View className='flex items-center'> 
                            <Empty/>
                        </View>
                    )}
                    {(parentorders.length === 0 && loading) && 
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
                            <ServicesLayout 
                            kitchen={item.store_name} 
                            price={item.price} 
                            date={item.date}
                            items={item.items}
                            order_id={item.order_id}
                            status={item.status}
                            /> 
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Toast config={toastConfig} />
        </View>
    )
}