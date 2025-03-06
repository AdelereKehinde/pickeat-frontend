import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl, FlatList } from "react-native";
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
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Check from '../assets/icon/check.svg'
import useDebounce from '@/components/Debounce';

export default function KitchenPageProduct(){
    const {kitchen_id} = useGlobalSearchParams()
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type VendorStore = { id: string; avatar: string; business_name: string;};
    type CategoryArray = { id: number; category_name: string;}[];
    type MealArray = { id: string; thumbnail: string; meal_name: string; category: CategoryArray; vendor_store: VendorStore; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type MealResponse = { count: number; next: string; previous: string; results: MealArray;};

    const [loading, setLoading] = useState(true);

    const [kitchenMeal, setKitchenMeal] = useState<MealArray>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page

    const [categories, setCategories] = useState<CategoryArray>([{'id': 0, category_name: 'all'}]);
    const [filterIndex, setFilterIndex] = useState('all');
    const [searchValue, setSearchValue] = useState('')
    const [preSearchValue, setPreSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCategories = async () => {
        try {
            const storedData = await AsyncStorage.getItem('categories');
            // If data exists, parse it and set it to state
            if (storedData && categories.length == 1) {
                const parsedData: CategoryArray = JSON.parse(storedData);
                setCategories((prevCategories) => [...prevCategories, ...parsedData]);
            }
        } catch (error) {
            // alert(JSON.stringify(error));
            // setLoading(false)
        }
    };

    const fetchMeals = async () => {
        try {
            setLoading(true)
            if(filterIndex ==  'all'){
                var Endpoint = `${ENDPOINTS['inventory']['kitchen-meal']}${kitchen_id}/list?page=${currentPage}&page_size=${pageSize}`
            }else{
                var Endpoint = `${ENDPOINTS['inventory']['kitchen-meal']}${kitchen_id}/list?page=${currentPage}&page_size=${pageSize}&category=${filterIndex}`
            }
            if (searchValue.length > 2){
                Endpoint = `${Endpoint}&search=${searchValue}`
            }
            var response = await getRequest<MealResponse>(Endpoint, true); // Authenticated
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
        fetchCategories();
    }, []); 

    useEffect(() => {
        setKitchenMeal([])
        fetchMeals();
    }, [currentPage, filterIndex, searchValue]); // Empty dependency array ensures this runs once

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
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center mb-10`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Kitchen' withbell={true} />
                </View>
                
                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full my-3 px-4 relative flex flex-row items-center justify-center`}>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[11px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocus(true)}
                        onBlur={()=>setIsFocus(false)}
                        onChangeText={handleSearch}
                        defaultValue={preSearchValue}
                        placeholder="Search for meal in kitchen"
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
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

                <View className='my-3 flex flex-row w-full justify-around px-3'>
                    {                
                        <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id + ''}
                        horizontal={true}  // This makes the list scroll horizontally
                        ItemSeparatorComponent={() => <View className='w-3' />}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={()=>{setFilterIndex(item.category_name)}}
                                className={`${(filterIndex == item.category_name)? 'bg-custom-green': 'bg-blue-100'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                            >   
                                {(filterIndex == item.category_name) && (
                                    <Check />
                                )}
                                <Text
                                className={`${(filterIndex == item.category_name)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    {item.category_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}  // Hide the horizontal scroll bar
                        />
                    }
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-50'} w-full mb-52 pb-2 `}>
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

                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full space-y-1 mb-5' contentContainerStyle={{ flexGrow: 1 }}>
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
                        {((kitchenMeal.length != 0) && (count > kitchenMeal.length)) && 
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
                    </ScrollView>                    
                </View>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}