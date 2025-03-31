import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl, FlatList } from "react-native";
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
import TitleCase from '@/components/TitleCase';
import FullScreenLoader from '@/components/FullScreenLoader';
import { TruncatedText } from '@/components/TitleCase';
import useDebounce from '@/components/Debounce';

function AdminUser(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('users');
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [preSearchValue, setPreSearchValue] = useState('')
    
    type ListData = { id: number; full_name: string;}[];
    type ApiResponse = { suspended: number; count: number; next: string; previous: string; results: ListData;};

    const [parentUsers, setParentUsers] = useState<ListData>([]);
    const [suspended, setSuspended] = useState(0);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const Categories = [
        {id: '1', name: 'users'},
        {id: '2', name: 'vendors'},
        {id: '3', name: 'riders'},
        {id: '4', name: 'admins'},
    ]
    const fetchMeals = async () => {
        try {
            var Endpoint = ''
            switch (filter) {
                case 'users':
                    Endpoint = `${ENDPOINTS['admin']['buyers']}?page_size=${pageSize}&page=${currentPage}&is_active=true`
                    break;
                case 'vendors':
                    Endpoint = `${ENDPOINTS['admin']['vendors']}?page_size=${pageSize}&page=${currentPage}&is_active=true`
                    break;
                case 'riders':
                    Endpoint = `${ENDPOINTS['admin']['riders']}?page_size=${pageSize}&page=${currentPage}&is_active=true`
                    break;
                case 'admins':
                    Endpoint = `${ENDPOINTS['admin']['admins']}?page_size=${pageSize}&page=${currentPage}&is_active=true`
                    break;
                default:
                    Endpoint = `${ENDPOINTS['admin']['buyers']}?page_size=${pageSize}&page=${currentPage}&is_active=true`
                    break;
            }

            if (searchValue.length > 2){
                Endpoint = `${Endpoint}&search=${searchValue}`
            }

            var response = await getRequest<ApiResponse>(Endpoint, true);
            // alert(JSON.stringify(response))
            setSuspended(response.suspended)
            setCount(response.count)
            setParentUsers(response.results)
            // if(!ranOnce){
            //     setUsers(response)
            //     setRanOnce(true)
            // }
            // setCount(response.count)
            setLoading(false)
        } catch (error) {
            // alert(error);
        } 
    };
    useEffect(() => {
        if (isFocused){  
            setLoading(true) 
            setParentUsers([])     
            fetchMeals(); 
        }
    }, [filter, currentPage, searchValue]); // Empty dependency array ensures this runs once
    
    // Create a debounced version of fetchMeals with 500ms delay
    const debouncedSearch = useDebounce(setSearchValue, 1000);
    const handleSearch = (query: string) => {
        // setMeals([]); // Clear results if input is empty
        setPreSearchValue(query)
        if (query.trim() === '') {
            // alert(1)
            setSearchValue('')
            setLoading(false);
          return;
        }else{
            if(query.length >= 2){
                debouncedSearch(query); // Call debounced function
            }
            // alert(2)
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMeals()
        setRefreshing(false); // Stop the refreshing animation
    };

    const NextPage = (id:number) => {
        switch (filter) {
            case 'users':
                router.push(`/admin/user_details?id=${id}`)
                break;
            case 'vendors':
                router.push(`/admin/vendor_details?id=${id}`)
                break;
            case 'riders':
                router.push(`/admin/rider_details?id=${id}`)
                break;
        }
    }

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-gray-100'} w-full h-full flex items-center`}>      
                {loading && (
                    <FullScreenLoader />
                )}
                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full p-4 relative flex flex-row items-center justify-center`}>
                    <View className='absolute left-6'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} w-full h-[50px] ${isFocusedSearch? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[12px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocusedSearch(true)}
                        onBlur={()=>setIsFocusedSearch(false)}
                        onChangeText={handleSearch}
                        defaultValue={preSearchValue}
                        placeholder="Search"
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                    />
                    {/* <TouchableOpacity 
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
                    </TouchableOpacity> */}
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} p-4 flex flex-row w-full justify-around`}>
                    <FlatList
                    data={Categories}
                    keyExtractor={(item) => item.id}
                    horizontal={true}  // This makes the list scroll horizontally
                    ItemSeparatorComponent={() => <View className='w-3' />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={()=>{setFilter(item.name); setCurrentPage(1)}}
                        className={`bg-gray-100 rounded-lg ${(filter == item.name) && 'bg-custom-green'} flex flex-row items-center px-4 py-2`}
                        >
                            {(filter== item.name) && (
                                <Check />
                            )}
                            <Text
                            className={`${(filter == item.name)? 'text-white':'text-gray-600'} ml-1 text-[12px] text-center`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {TitleCase(item.name)}
                            </Text>
                        </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                    />
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-800' : ' text-white'} rounded w-full p-2 mt-1`}>
                    <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View className='flex flex-row justify-start'>
                            <Text 
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px] mr-1' `}
                            style={{fontFamily: 'Inter-Medium'}}>
                                Suspended account
                            </Text>
                            <Text 
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[13px] ml-1`}
                            style={{fontFamily: 'Inter-Regular'}}>
                                ({suspended}) 
                            </Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity
                            onPress={()=>{router.push(`/admin/suspended?user=${filter}`)}}
                            >
                                <ArrowRightCircle />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full mt-1 mb-4 relative flex flex-row items-center justify-center`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full p-1 mb-44 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && (filter==='all' ? parentUsers.length : parentUsers.length == 0)) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-600'} text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Empty {filter}
                                </Text>
                            </View>
                        )}
                        
                        {(parentUsers.length === 0 && loading) && 
                            <View className='flex space-y-2 w-screen overflow-hidden'>
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
                        {parentUsers.map((item, index) => (
                                <View key={item.id} className={`${theme == 'dark'? 'bg-gray-800 border-gray-500' : ' bg-white border-gray-300'} flex flex-row items-center w-full py-3 px-6`}>
                                            <View>
                                                <EllipseDot width={15} height={15} />
                                            </View>
                                            <View className='ml-4'>
                                                <Text className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-700'} text-[14px]`} style={{fontFamily: 'Inter-SemiBold'}}>
                                                    {index + 1}.
                                                </Text>
                                            </View>
                                            <View className='ml-1'>
                                                <Text className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-700'} text-[14px]`} style={{fontFamily: 'Inter-SemiBold'}}>
                                                    {TruncatedText(item.full_name, 15)}
                                                </Text>
                                            </View>
                                            <View className='ml-auto'>
                                                <Text className='text-[#228B22] text-[13px]' style={{fontFamily: 'Inter-Bold'}}>
                                                    {TitleCase(filter)}
                                                </Text>
                                            </View>
                                            <View className='ml-5'>
                                                <TouchableOpacity
                                                onPress={()=>{NextPage(item.id)}}
                                                >
                                                    <AngleRight width={20} height={20} />
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                        ))}
                        {((parentUsers.length != 0) && (count > parentUsers.length)) && 
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
                    </ScrollView>
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}

export default AdminUser;