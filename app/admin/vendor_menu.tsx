import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, FlatList, Image, RefreshControl } from "react-native";
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

export default function VendorMenu(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    // Get query params
    const {id} = useGlobalSearchParams()
    type CategoryArray = { id: number; category_name: string;}[];
    type MealArray = { id: number; thumbnail: string; meal_name: string; category: CategoryArray; vendor_store: string; price: string; discount: string;  discounted_price: string; meal_description: string; in_stock: string; in_cart: string; in_wishlist: string; cart_quantity: string}[];
    type ApiResponse = { count: number; next: string; previous: string; results: MealArray;};
    
    const [meals, setMeals] = useState<MealArray>([]);
    const [categories, setCategories] = useState<CategoryArray>([{'id': 0, category_name: 'all'}]);
    const [refreshing, setRefreshing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 6; // Items per page
    
    const [searchValue, setSearchValue] = useState('')
    const [preSearchValue, setPreSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState('all');

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
        setMeals([])
        setLoading(true)
        try {
            if(filterIndex ==  'all'){
                var Endpoint = `${ENDPOINTS['inventory']['kitchen-meal']}${id}/list?page=${currentPage}&page_size=${pageSize}`
            }else{
                var Endpoint = `${ENDPOINTS['inventory']['kitchen-meal']}${id}/list?page=${currentPage}&page_size=${pageSize}&category=${filterIndex}`
            }
            if (searchValue.length > 2){
                Endpoint = `${Endpoint}&search=${searchValue}`
            }
            var response = await getRequest<ApiResponse>(Endpoint, true); // Authenticated
            // alert(JSON.stringify(response.results)) 
            setCount(response.count)
            setMeals(response.results) 
            setLoading(false)
        } catch (error) {
            // alert(JSON.stringify(error));
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once

    const pageIsFocused = useIsFocused();
    useEffect(() => {
        fetchMeals();
    }, [currentPage, filterIndex, pageIsFocused, searchValue]); // Empty dependency array ensures this runs once

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
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={true} title='Vendor Menu' withbell={false} />
                </View>

                <View className='w-full my-3 px-4 relative flex flex-row items-center justify-center'>
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
                        value={preSearchValue}
                        placeholder="Search through vendor menu"
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                    />
                </View>

                <View className='my-3 mt-5 flex flex-row w-full justify-around px-3'>
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

                {/* <Text
                className={`text-[15px] self-start ml-3 mt-5`}
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Add ons
                </Text>

                <View className="px-4 py-3 h-[130px]">
                    <FlatList
                        className=''
                        data={Details.products}
                        renderItem={({ item }) => (
                            <View className='w-20 flex items-center'>
                                <Image
                                    source={item.source}
                                    className="w-14 h-14 rounded-full" // Set desired width and height
                                />
                                <Text
                                style={{fontFamily: 'Inter-Regular'}} 
                                className='text-[10px] text-gray-700 mt-1 text-center'
                                >
                                    {item.name}
                                </Text>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        // Add spacing between items with ItemSeparatorComponent
                        ItemSeparatorComponent={() => <View className='' />}
                    />
                </View> */}
                
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-50'} w-full mt-3`}>
                    <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    className='w-full space-y-1 mb-56' contentContainerStyle={{ flexGrow: 1 }}>
                        {(!loading && filterIndex == 'all' && meals.length == 0) && (
                            <View className='flex items-center'>
                                <TouchableOpacity
                                onPress={()=>{router.push('/vendor/create_product')}}
                                className=''>
                                    <Empty />
                                </TouchableOpacity>
                            </View>
                        )} 
                        {(!loading && filterIndex !== 'all' && meals.filter((item)=>item.category[0].category_name == filterIndex).length == 0) && (
                            <View className='flex items-center'>
                                <View
                                className=''>
                                    <Empty />
                                </View>
                            </View>
                        )} 
                        {(loading && (meals.length == 0)) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'bg-gray-900' : ' border-gray-300'} mt-5 border-b`}>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor={(theme == 'dark')? '#111827':'#f3f3f3'}
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
                        {(!loading && (meals.length > 0)) &&
                            meals.map((item) => (
                                <View key={item.id}>
                                    <AdminProductList 
                                    image={item.thumbnail} 
                                    id={item.id}
                                    category={TitleCase(item.category[0].category_name)}
                                    name={TitleCase(item.meal_name)} 
                                    price={item.price} 
                                    discount={item.discount} 
                                    discounted_price={item.discounted_price} 
                                    quantity_in_cart={item.cart_quantity}
                                    description={item.meal_description}
                                    />
                                </View>
                            ))
                        }
                                

                        {((meals.length != 0) && (count > meals.length)) && 
                            <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                        }
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}