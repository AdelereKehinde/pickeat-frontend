import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { Link } from "expo-router";
import TitleTag from '@/components/Title';
import KitchenCard from '@/components/Kitchen';
import Search from '../assets/icon/search.svg';
import Filter from '../assets/icon/filter.svg';
import Check from '../assets/icon/check.svg'
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import useDebounce from '@/components/Debounce';

export default function KitchenPage(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    type ReviewData = { total_reviews: string; average_rating: string;};
    type kitchenResponseResult = { id: string; avatar: string; delivery_time: string; delivery_fee: string; business_name: string; review: ReviewData; is_favourite: boolean}[];
    type kitchenResponse = { count: number; next: string; previous: string; results: kitchenResponseResult;};

    const [kitchens, setKitchens] = useState<kitchenResponseResult>([]);

    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [isFocused, setIsFocus] = useState(false);
    const [filterIndex, setFilterIndex] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 10; // Items per page

    const [refreshing, setRefreshing] = useState(false);
    const fetchCategories = async (query: string) => {
        try {
            setKitchens([]);
            setLoading(true)
            const response = await getRequest<kitchenResponse>(`${ENDPOINTS['vendor']['store-list']}?page_size=${pageSize}&page=${currentPage}&search=${query}`, true);
            setCount(response.count)
            setLoading(false)
            // alert(JSON.stringify(response.results))
            setKitchens(response.results)
        } catch (error) {
            setLoading(false)
            // alert(error); 
        }
    };

    useEffect(() => {
        setKitchens([])
        setLoading(true)
        fetchCategories('');
    }, [currentPage]); // Empty dependency array ensures this runs once
    

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCategories(searchValue)
        setRefreshing(false); // Stop the refreshing animation
    };

    // Create a debounced version of fetchMeals with 500ms delay
    const debouncedSearch = useDebounce(fetchCategories, 800);

    const handleSearch = (query: string) => {
        setSearchValue(query);
         // Clear results if input is empty
        if (query.trim() === '') {
          setLoading(false);
          return;
        }
        debouncedSearch(query); // Call debounced function
    };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Search' withbell={true} />
                </View>

                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full my-3 px-4 relative flex flex-row items-center justify-center`}>
                    <View className='absolute left-6 z-10'>
                        <Search />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} ${(theme == 'dark')? 'text-white': 'text-gray-900'} rounded-lg px-3 pl-7 py-2 text-[11px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocus(true)}
                        onBlur={()=>setIsFocus(false)}
                        onChangeText={handleSearch}
                        defaultValue={searchValue}
                        placeholder="Search for store or kitchen"
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

                {/* <View className='my-3 mt-5 flex flex-row w-full justify-around'>
                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex(1)}}
                        className={`${(filterIndex == 1)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >   
                        {(filterIndex == 1) && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 1)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex(2)}}
                        className={`${(filterIndex == 2)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filterIndex == 2) && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 2)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Breakfast
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex(3)}}
                        className={`${(filterIndex == 3)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filterIndex == 3) && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 3)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Stock
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={()=>{setFilterIndex(4)}}
                        className={`${(filterIndex == 4)? 'bg-custom-green': 'bg-gray-200'} flex flex-row items-center px-3 rounded-lg h-8  my-auto`}
                    >
                        {(filterIndex == 4) && (
                            <Check />
                        )}
                        <Text
                        className={`${(filterIndex == 4)? 'text-white pl-2': ' text-gray-500'} text-[11px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            Desert
                        </Text>
                    </TouchableOpacity>
                </View> */}

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className='w-full p-1 pb-5 mt-5' contentContainerStyle={{ flexGrow: 1 }}>
                {(loading) && 
                    <View className='flex space-y-2 w-screen overflow-hidden'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <View key={index} className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'} mt-5 border-b`}>
                                <ContentLoader
                                width="100%"
                                height={76}
                                backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
                                foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
                                >
                                    {/* Add custom shapes for your skeleton */}
                                    <Rect x="2.5%" y="0" rx="5" ry="5" width="80" height="70" />
                                    <Rect x="70%" y="10" rx="50" ry="5" width="15%" height="25" />
                                    <Rect x="30%" y="15" rx="5" ry="5" width="20%" height="10" />
                                    <Rect x="30%" y="45" rx="5" ry="5" width="25%" height="10" />
                                    <Rect x="70%" y="45" rx="5" ry="5" width="28%" height="10" />
                                </ContentLoader>
                            </View> 
                        ))}
                    </View>
                }
                <View className='space-y-2 mb-6'>
                    {kitchens.map((item) => (
                        <View key={item.id}>
                            <KitchenCard key={item.id} kitchen_id={item.id} image={item.avatar} name={item.business_name} is_favourite={item.is_favourite} time={item.delivery_time} rating={item.review.average_rating} fee={item.delivery_fee} />
                        </View>
                    ))}
                </View>
                
                {((kitchens.length != 0) && (count > kitchens.length)) && 
                    <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}