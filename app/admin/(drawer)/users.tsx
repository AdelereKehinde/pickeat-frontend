import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
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
import AngleRight from '../../../assets/icon/angler.svg';
import EllipseDot from '../../../assets/icon/ellipse-dot.svg';
import Search from '../../../assets/icon/search.svg';
import Filter from '../../../assets/icon/filter.svg';

function AdminUser(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('client');
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    
    type ListData = { id: number; name: string; email: string; phone: string; thumbnail: string; type: string; status_history_status: string; status: string; items: string; date: string;}[];
    type OrderResponse = { count: number; next: string; previous: string; results: ListData;};

    const [parentUsers, setParentUsers] = useState<ListData>([]);
    const [users, setUsers] = useState<ListData>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            // setParentUsers([])
            // const response = await getRequest<ListData>(`${ENDPOINTS['cart']['vendor-users']}?all=true&exclude_status=completed`, true);
            const response = [
                {
                    id: 1,
                    name: 'John Davis',
                    email: '2000',
                    phone: 'Abuja',
                    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxMG6duOnBRLCIvsjJxFAb7WAUj5b8iOWiAg&s',
                    type: 'Client',
                    status_history_status: 'completed',
                    status: 'completed',
                    items: 'string',
                    date: 'Oct 24, 2022 at 06:00 am',
                },
                {
                    id: 2,
                    name: 'John Davis',
                    email: '2000',
                    phone: 'Abuja',
                    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxMG6duOnBRLCIvsjJxFAb7WAUj5b8iOWiAg&s',
                    type: 'Vendor',
                    status_history_status: 'completed',
                    status: 'completed',
                    items: 'string22',
                    date: 'Oct 24, 2022 at 06:00 am',
                }
            ]
            // alert(JSON.stringify(response))
            setParentUsers(response)
            if(!ranOnce){
                setUsers(response)
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

    const UpdateStatus = (email: string, status: string, status_history_status: string) => {
        // alert(status_history_status)
        var newUser = parentUsers.map((item) =>
            item.email === email ? { ...item, status: status, status_history_status: status_history_status } : item
        );
        setParentUsers(newUser);  
    }

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'custom-gray-1'} w-full h-full flex items-center`}>      
                <View className='bg-white w-full p-4 relative flex flex-row items-center justify-center'>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} w-full h-[50px] ${isFocusedSearch? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[12px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocusedSearch(true)}
                        onBlur={()=>setIsFocusedSearch(false)}
                        onChangeText={setSearchValue}
                        defaultValue={searchValue}
                        placeholder="Search"
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                    />
                    <TouchableOpacity 
                    onPress={()=>{}}
                    className='flex flex-row items-center absolute right-6 rounded-lg p-2 bg-gray-100'>
                        <Text
                        className='text-custom-green text-[12px]'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Filter
                        </Text>
                        <View className=''>
                            <Filter width={15} height={15} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className='bg-white p-4 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilter('client')}}
                        className={`${(filter == 'all')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'all') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'all')? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            All users
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={()=>{setFilter('client')}}
                        className={`${(filter == 'client')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filter== 'client') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'client')? 'text-white pl-2': 'text-[#909090]'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Client
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('vendor')}}
                        className={`${(filter == 'vendor')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'vendor') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'vendor')? 'text-white pl-2': 'text-[#909090]'} text-[11px] `}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Vendors 
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilter('rider')}}
                        className={`${(filter == 'rider')? 'bg-custom-green': 'bg-[#F5F5F5]'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filter == 'rider') && (
                            <Check />
                        )}
                        <Text
                        className={`${(filter == 'rider')? 'text-white pl-2': 'text-[#909090]'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Riders
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className='bg-white rounded w-full p-2 mt-1'>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                            <Text className='text-[#000000] text-[14px] mr-1' style={{fontFamily: 'Inter-Bold'}}>
                                Suspended account
                            </Text>
                            <Text className='text-[#767676] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>(5)</Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full mt-1 mb-4 relative flex flex-row items-center justify-center`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full p-1 mb-40 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (filter==='all' ? parentUsers.length : parentUsers.filter((item)=>item.status.includes(filter)).length == 0)) && (
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
                        
                        {(parentUsers.length === 0 && loading) && 
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
                        {parentUsers.filter((item)=>item.status.includes(filter)).map((item, index) => (
                            <View key={item.id}>
                                <View className='bg-white border-gray-300 flex flex-row items-center justify-between border-b w-full py-3 px-6'>
                                    <View className='flex flex-row justify-between items-center w-full'>
                                        <View className='flex flex-row justify-start'>
                                            <View>
                                                <EllipseDot width={20} height={20} />
                                            </View>
                                            <View className='ml-4'>
                                                <Text className='text-[#767676] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>
                                                    {index + 1}.
                                                </Text>
                                            </View>
                                            <View className='ml-1'>
                                                <Text className='text-[#767676] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className='flex flex-row justify-start'>
                                            <View>
                                                <Text className='text-[#228B22] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>
                                                    {item.type}
                                                </Text>
                                            </View>
                                            <View className='ml-5'>
                                                <TouchableOpacity>
                                                    <AngleRight width={20} height={20} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
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

export default AdminUser;