import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import TitleTag from '@/components/Title';
import VendorProductList from '@/components/VendorProductList';
import TitleCase from '@/components/TitleCase';
import Empty from '../../assets/icon/Empty2.svg';
import Search from '../../assets/icon/search.svg';
import Add from '../../assets/icon/add_product.svg';
import Check from '../../assets/icon/check.svg'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import Pagination from '@/components/Pagination';
import AdminProductList from '@/components/AdminProductList';
import useDebounce from '@/components/Debounce';
import AngleRight from '../../assets/icon/angler.svg';
import ArrowRightCircle from '../../assets/icon/arrow-right-circle.svg';
import { TruncatedText } from '@/components/TitleCase';
import EllipseDot from '../../assets/icon/ellipse-dot.svg';
import RNPickerSelect from 'react-native-picker-select';
import { useTailwind } from 'nativewind';
import FilterModal from '@/components/FilterModal';
import ConnectionModal from '@/components/ConnectionModal';

export default function PayoutManagement(){
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [loading, setLoading] = useState(true);
    // Get query params
    const {id} = useGlobalSearchParams()
    type PayoutArray = { id: number; date_requested: string; amount: string; email: string; name: string; status: string; processed_date: string;}[];
    type ApiResponse = { count: number; next: string; previous: string; approved: number; pending: number; failed: number; results: PayoutArray;};
    
    const [resData, setResData] = useState<ApiResponse>();
    const [payouts, setPayouts] = useState<PayoutArray>([]);
    const [refreshing, setRefreshing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const [filter, setFilter] = useState('');
    const [openFilter, setOpenFilter] = useState(false)
    const filterOptions = [
        { label: 'all', value: '' },
        { label: 'pending', value: 'pending' },
        { label: 'successful', value: 'success' },
        { label: 'declined', value: 'failed' },
    ];
    
    const fetchMeals = async () => {
        setLoading(true)
        try {
            var Endpoint = `${ENDPOINTS['payment']['admin-withdrawal']}?page_size=${pageSize}&page=${currentPage}&status=${filter}`
            var response = await getRequest<ApiResponse>(Endpoint, true); // Authenticated
            // alert(JSON.stringify(response.results)) 
            setResData(response)
            setCount(response.count)
            setPayouts(response.results) 
            setLoading(false)
        } catch (error) {
            // alert(JSON.stringify(error));
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchMeals();
    }, [filter]); // Empty dependency array ensures this runs once


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center mb-10`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={true} title='Withdrawal Requests' withbell={false} />
                </View>

                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-[95%] mx-auto mt-4 mb-5 px-2 py-2 space-y-2 rounded-lg`}>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} flex flex-row p-2 rounded-lg space-x-3`}>
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Approved Withdrawals
                        </Text>
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            - ({resData?.approved || 0})
                        </Text>
                    </View>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} flex flex-row p-2 rounded-lg space-x-3`}>
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Pending Withdrawals
                        </Text>
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            - ({resData?.pending || 0})
                        </Text>
                    </View>
                    <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} flex flex-row p-2 rounded-lg space-x-3`}>
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Declined Withdrawals
                        </Text>
                        <Text
                        className={`text-[11px] text-custom-green`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            - ({resData?.failed || 0})
                        </Text>
                    </View>
                </View>

                <View className='flex flex-row items-center justify-between w-full px-4 py-2'>
                    <Text
                    className={`text-[14px] ${theme == 'dark'? 'text-gray-100' : ' text-gray-900'}`}
                    style={{fontFamily: 'Inter-Bold'}}
                    >
                        Withdrawal Requests
                    </Text>

                    <FilterModal 
                    options={filterOptions} 
                    getValue={(value)=>{setFilter(value); setOpenFilter(false)}}
                    open={openFilter}
                    />
                </View>


                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full mb-10' 
                    contentContainerStyle={{ flexGrow: 1 }}>
                        {(loading) && 
                            <View className='w-[95%] mx-auto flex space-y-2 overflow-hidden'>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <View key={index} className=' border-gray-300'>
                                        <ContentLoader
                                        width="100%"
                                        height={50}
                                        backgroundColor={(theme == 'dark')? '#111827':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="0" y="0" rx="5" ry="5" width="100%" height="50" />
                                            <Circle cx="15" cy="25" r="10" />
                                            <Rect x="30" y="20" rx="5" ry="5" width="150" height="10" />
                                            <Rect x="270" y="20" rx="5" ry="5" width="50" height="10" />
                                            
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }

                        {(!loading && (payouts.length == 0)) && (
                            <View className='flex items-center'> 
                                <Empty/>
                            </View>
                        )}
                           
                        <View className='mx-3 space-y-1'>
                            {(!loading && (payouts.length > 0)) &&
                                payouts.map((item,index) => (
                                    <View key={item.id} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-md flex flex-row items-center w-full py-3 px-2`}>
                                            {/* <View>
                                                <EllipseDot width={8} height={8} />
                                            </View> */}
                                            <View className='ml-2'>
                                                <Text className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-700'} text-[12px]`} style={{fontFamily: 'Inter-SemiBold'}}>
                                                    {index + 1}.
                                                </Text>
                                            </View>
                                            <View className='ml-1'>
                                                <Text className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-700'} text-[12px]`} style={{fontFamily: 'Inter-SemiBold'}}>
                                                    {TruncatedText(item.name, 15)}
                                                </Text>
                                            </View>
                                            <View className='ml-1'>
                                                <Text className={`${theme == 'dark'? 'text-custom-green' : ' text-custom-green'} text-[12px]`} style={{fontFamily: 'Inter-SemiBold'}}>
                                                    - ₦{TruncatedText(item.amount, 10)}
                                                </Text>
                                            </View>
                                            <View className={`${(item.status == 'pending') && 'bg-yellow-500'} ${(item.status == 'success') && 'bg-custom-green'} ${(item.status == 'failed') && 'bg-red-500'} px-2 rounded-sm ml-auto`}>
                                                <Text className='text-white text-[10px]' style={{fontFamily: 'Inter-Medium'}}>
                                                    {TitleCase(item.status)}
                                                </Text>
                                            </View>
                                            <View className='ml-5'>
                                                <TouchableOpacity
                                                onPress={()=>{router.push(`/admin/payout_details?id=${item.id}`)}}
                                                >
                                                    <ArrowRightCircle width={18} height={18} />
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                ))
                            }
                        </View>
                        
                                
                        <View className='mt-auto'>
                            {((payouts.length != 0) && (count > payouts.length)) && 
                                <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                            }
                        </View>
                        
                    </ScrollView>
                </View>
        </SafeAreaView>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      backgroundColor: 'white',
      marginBottom: 20,
      width: 200,
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: 'black',
      backgroundColor: 'white',
      marginBottom: 20,
      width: 150,
    },
  });