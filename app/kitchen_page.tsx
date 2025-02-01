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
    const pageSize = 7; // Items per page

    const [refreshing, setRefreshing] = useState(false);
    const fetchCategories = async () => {
        try {
            const response = await getRequest<kitchenResponse>(`${ENDPOINTS['vendor']['store-list']}?page_size=${pageSize}&page=${currentPage}&search=${searchValue}`, true);
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
        fetchCategories();
    }, [currentPage]); // Empty dependency array ensures this runs once
    

    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchCategories()
    
        setRefreshing(false); // Stop the refreshing animation
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
                        className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-7 py-2 text-[11px]`}
                        autoFocus={false}
                        onFocus={()=>setIsFocus(true)}
                        onBlur={()=>setIsFocus(false)}
                        onChangeText={setSearchValue}
                        defaultValue={searchValue}
                        placeholder="Search for available home services"
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
                className='w-full p-1 pb-5 mt-5 space-y-2' contentContainerStyle={{ flexGrow: 1 }}>
                {(loading) && 
                    <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                        {Array.from({ length: 6 }).map((_, index) => (
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
                {kitchens.map((item) => (
                    <View key={item.id}>
                        <KitchenCard key={item.id} kitchen_id={item.id} image={item.avatar} name={item.business_name} is_favourite={item.is_favourite} time={item.delivery_time} rating={item.review.average_rating} fee={item.delivery_fee} />
                    </View>
                ))}
                <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}