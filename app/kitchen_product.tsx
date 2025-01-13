import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import TitleTag from '@/components/Title';
import Product from '@/components/Product';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Empty from '../assets/icon/empy_transaction.svg';
import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { TruncatedText } from '@/components/TitleCase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';

export default function KitchenPageProduct(){
    const {kitchen_id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type VendorStore = { id: string; avatar: string; business_name: string;};
    type CategoryArray = { id: string; category_name: string;}[];
    type MealArray = { id: string; thumbnail: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type MealResponse = { count: number; next: string; previous: string; results: MealArray;};

    const [loading, setLoading] = useState(true);

    const [kitchenMeal, setKitchenMeal] = useState<MealArray>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 5; // Items per page

    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            const response = await getRequest<MealResponse>(`${ENDPOINTS['inventory']['kitchen-meal']}${kitchen_id}/list?page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response.results))
            setCount(response.count)
            setKitchenMeal(response.results) 
            setLoading(false)
        } catch (error) {
            setLoading(false)
            // alert(error);
        }
    };

    useEffect(() => {
        setKitchenMeal([])
        setLoading(true)
        fetchMeals();
    }, [currentPage]); // Empty dependency array ensures this runs once
    
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);

    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchMeals()
    
        setRefreshing(false); // Stop the refreshing animation
    };
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center mb-10'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-white w-full'>
                    <TitleTag withprevious={true} title='Kitchen' withbell={true} />
                </View>
                
                <View className='bg-white w-full my-3 px-4 relative flex flex-row items-center justify-center'>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[11px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocus(true)}
                        onBlur={()=>setIsFocus(false)}
                        onChangeText={setSearchValue}
                        defaultValue={searchValue}
                        placeholder="Search for available home services"
                        placeholderTextColor=""
                    />
                    {/* <TouchableOpacity 
                    onPress={()=>{}}
                    className='flex flex-row items-center px-2 absolute inset-y-0 space-x-1 top-2 right-7 rounded-lg h-8 bg-gray-100 my-auto'>
                        <Text
                        className='text-custom-green'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Filter
                        </Text>
                        <View className=''>
                            <Filter width={15} height={15} />
                        </View>
                    </TouchableOpacity> */}
                </View>

                <View className='w-full bg-gray-50 mb-40 pb-2 '>
                    {(!loading && kitchenMeal.length === 0) && (
                        <View className='flex items-center'> 
                            <Empty/>
                        </View>
                    )}
                    {(loading) && 
                        <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <View key={index} className='mt-5 border-b border-gray-300'>
                                    <ContentLoader
                                    width="100%"
                                    height={100}
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
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

                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {kitchenMeal.map((item) => (
                            <View key={item.id}>
                                <Product 
                                image={item.thumbnail} 
                                meal_id={item.id}
                                name={TruncatedText(item.meal_name, 17)} 
                                price={item.price} 
                                discount={item.discount} 
                                discounted_price={item.discounted_price} 
                                quantity_in_cart={item.cart_quantity}
                                description={TruncatedText(item.meal_description, 18)}
                                />
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