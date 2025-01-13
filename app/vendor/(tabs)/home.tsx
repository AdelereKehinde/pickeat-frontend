import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native";
import { router } from 'expo-router'
import TitleTag from '@/components/Title';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Empty from '../../../assets/icon/empy_transaction.svg';
import RatingMeter from '@/components/Rating Meter';
import { SafeAreaView } from 'react-native-safe-area-context';

function Home(){
    type PopularOrder = { id: number; thumbnail: string; meal_name: string; quantity: string;}[];
    type RatingData = { total_reviews: number; average_rating: number; star_5_count: number; star_4_count: number; star_3_count: number; star_2_count: number; star_1_count: number;};
    type EarningResponse = { orders: number; total_amount:  number; popular_order: PopularOrder; rating: RatingData;};
    type ApiResponse = { status: string; message: string; data: EarningResponse;};

    const [loading, setLoading] = useState(false); // Loading state
    const [data, setData] = useState<ApiResponse>()
    const [popularOrder, setPopularOrder] = useState<PopularOrder>([])
    const [ratingData, setRatingData] = useState<RatingData>();
    const [rating, setRating] = useState(0);
    const [noOfReview, setNoOfReview] = useState(0);
    const [noOf5Star, setNoOf5Star] = useState(0);
    const [noOf4Star, setNoOf4Star] = useState(0);
    const [noOf3Star, setNoOf3Star] = useState(0);
    const [noOf2Star, setNoOf2Star] = useState(0);
    const [noOf1Star, setNoOf1Star] = useState(0);
    
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['vendor']['dashboard']}`, true);
            // alert(JSON.stringify(response))
            setPopularOrder(response.data.popular_order)
            setRatingData(response.data.rating)
            setRating(response.data.rating.average_rating)
            setNoOfReview(response.data.rating.total_reviews)
            setNoOf5Star(response.data.rating.star_5_count)
            setNoOf4Star(response.data.rating.star_4_count)
            setNoOf3Star(response.data.rating.star_3_count)
            setNoOf2Star(response.data.rating.star_2_count)
            setNoOf1Star(response.data.rating.star_1_count)
            setData(response)
            setLoading(false)
        } catch (error) {
            setLoading(false) 
            // alert(error);
        } 
    };
    useEffect(() => {
        if(isFocused){
            setLoading(true)
            fetchMeals(); 
        }
    }, [isFocused]); // Empty dependency array ensures this runs once


    const onRefresh = async () => {
        setRefreshing(true);
    
        await fetchMeals()

        setRefreshing(false); // Stop the refreshing animation
    };

    const maxStars = 5; // Maximum stars

    // Create an array to represent each star
    const stars = Array.from({ length: maxStars }, (_, i) => {
        if (i < Math.floor(rating)) {
        return 'full'; // Full star
        } else if (i < rating) {
        return 'half'; // Half star
        } else {
        return 'empty'; // Empty star
        }
    });
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-blue-100 w-full'>
                    <TitleTag withprevious={false} title='My Dashboard' withbell={true} />
                </View> 
                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className='w-full flex' contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className='text-[16px] self-start pl-5 mt-5'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Insights
                    </Text>
                    
                    <View className='my-3 mt-3 space-y-3 flex w-[90%] bg-blue-50 p-4 rounded-lg mx-auto'>
                        <View className='flex flex-row justify-between items-center bg-white rounded-xl p-3'>
                            <Text
                            className='text-[13px] text-gray-500'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Total Orders
                            </Text>
                            <Text
                            className='text-[13px] text-custom-green'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {data?.data.orders}
                            </Text>
                        </View>
                        <View className='flex flex-row justify-between items-center bg-white rounded-xl p-3'>
                            <Text
                            className='text-[13px] text-gray-500'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Total Amount
                            </Text>
                            <Text
                            className='text-[13px] text-custom-green'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                ₦{data?.data.total_amount || 0}
                            </Text>
                        </View>
                    </View>

                    <Text
                    className='text-[16px] self-start pl-5 mt-5'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Most Popular orders
                    </Text>
                    
                    <View className='my-3 mt-3  flex w-[90%] rounded-lg mx-auto space-y-2'>
                        {((!loading || (popularOrder.length !== 0)) && popularOrder.length === 0 ) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`text-[11px] text-gray-600`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    You don't have an order yet
                                </Text>
                            </View>
                        )}
                        {(popularOrder.length === 0 && loading) && 
                            <View className='flex space-y-2 w-screen overflow-hidden'>
                                {Array.from({ length: 3 }).map((_, index) => (
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
                        {popularOrder.map((item) => (
                            <View key={item.id} className='flex flex-row justify-between items-center space-x-2'>
                                <View className='w-14 h-14 flex justify-around items-center rounded-full overflow-hidden'>    
                                    <Image 
                                    source={{uri: item.thumbnail}}
                                    className='border'
                                    width={55}
                                    height={55}
                                    />
                                </View>
                                <View className='grow border-b-2 border-gray-200'>
                                    <View className='flex flex-row justify-between items-center'>
                                        <Text
                                        className='text-[13px] text-gray-700'
                                        style={{fontFamily: 'Inter-SemiBold'}}
                                        >
                                            {item.meal_name}
                                        </Text>
                                        <Text
                                        className='text-[13px] text-custom-green'
                                        style={{fontFamily: 'Inter-SemiBold'}}
                                        >
                                            {item.quantity}
                                        </Text>
                                    </View>
                                    <Text
                                    className='text-[11px] text-gray-500'
                                    style={{fontFamily: 'Inter-Regular'}}
                                    >
                                        Most recent
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text
                    className='text-[16px] self-start pl-5 mt-5'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Reviews
                    </Text>
                    <View className='w-[90%] mx-auto px-4'>
                        <Text 
                        className='text-[30px] text-gray-700'
                        style={{fontFamily: 'Inter-Bold'}}>
                            {ratingData?.average_rating.toFixed(1)}
                        </Text>
                        <View className='flex flex-row space-x-2'>
                            {stars.map((type, index) => (
                                <FontAwesome
                                key={index}
                                name={
                                    type === 'full'
                                    ? 'star'
                                    : type === 'half'
                                    ? 'star-half-o'
                                    : 'star-o'
                                }
                                size={30}
                                color="#228B22" // Gold color for stars
                                />
                            ))}
                        </View>
                        <Text 
                        className='text-[13px] text-gray-500'
                        style={{fontFamily: 'Inter-Medium'}}>
                            ({noOfReview} Reviews)
                        </Text>
                    </View>
                    <View className='px-4 mt-2 mb-4'>
                        <RatingMeter star={5} rating={noOf5Star} total={noOfReview} />
                        <RatingMeter star={4} rating={noOf4Star} total={noOfReview} />
                        <RatingMeter star={3} rating={noOf3Star} total={noOfReview} />
                        <RatingMeter star={2} rating={noOf2Star} total={noOfReview} />
                        <RatingMeter star={1} rating={noOf1Star} total={noOfReview} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Home;