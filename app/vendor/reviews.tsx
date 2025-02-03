import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, RefreshControl, ActivityIndicator, Alert, Image, TextInput, StyleSheet  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import RatingMeter from '@/components/Rating Meter';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Empty from '../../assets/icon/empy_transaction.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

function getInitials(name: string) {
    // Split the name into an array of words
    const words = name.split(' ');
    
    // Get the first letter of each word, and join them together in uppercase
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
    
    return initials;
  }

export default function Reviews(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    type RatingData = { total_reviews: number; average_rating: number; star_5_count: number; star_4_count: number; star_3_count: number; star_2_count: number; star_1_count: number;};
    type ReviewData = { id: number; name: string; avatar: string; rating: number; comment: string; date: string;}[];
    type ReviewData1 = { count: number; next: string; previous: string; results: ReviewData;};
    type EarningResponse = {rating: RatingData; review: ReviewData1};
    type ApiResponse = { status: string; message: string; data: EarningResponse;};
    const [data, setData] = useState<ApiResponse>()
    const [loading, setLoading] = useState(false); // Loading state
    
    const [reviewData, setReviewData] = useState<ReviewData>([]);
    const [ratingData, setRatingData] = useState<RatingData>();
    const [rating, setRating] = useState(0);
    const [noOfReview, setNoOfReview] = useState(0);
    const [noOf5Star, setNoOf5Star] = useState(0);
    const [noOf4Star, setNoOf4Star] = useState(0);
    const [noOf3Star, setNoOf3Star] = useState(0);
    const [noOf2Star, setNoOf2Star] = useState(0);
    const [noOf1Star, setNoOf1Star] = useState(0);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState(1);
    const pageSize = 5; // Items per page

    const [refreshing, setRefreshing] = useState(false);
    const fetchMeals = async () => {
        try {
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['vendor']['review']}?page_size=${pageSize}&page=${currentPage}`, true);
            // alert(JSON.stringify(response))
            setCount(response.data.review.count)
            setRatingData(response.data.rating)
            setReviewData(response.data.review.results)
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
            // alert(JSON.stringify(error));
        } 
    };
    useEffect(() => {
        setLoading(true)
        setReviewData([])
        fetchMeals(); 
    }, [currentPage]); // Empty dependency array ensures this runs once


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

    const subStars= (rating: number) => Array.from({ length: maxStars }, (_, i) => {
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
            <View 
            className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}
            >
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
                    <TitleTag withprevious={false} title='Reviews' withbell={false} />
                </View>

                <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className='w-full px-2' contentContainerStyle={{ flexGrow: 1 }}>
                    <View 
                    style={styles.shadow_box}
                    className='w-full p-4 rounded-lg shadow-2xl'
                    >
                        <Text
                        className={`${theme == 'dark'? 'text-white' : ' text-gray-900'} text-[16px] self-start mt-5`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Reviews
                        </Text>
                        <View className='w-full mx-auto'>
                            <Text 
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-700'} text-[30px]`}
                            style={{fontFamily: 'Inter-Bold'}}>
                                {rating.toFixed(1)}
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
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}>
                                ({noOfReview} Reviews)
                            </Text>
                        </View>
                    </View>

                    <View className='px-4 mt-2 mb-4'>
                        <RatingMeter star={5} rating={noOf5Star} total={noOfReview} />
                        <RatingMeter star={4} rating={noOf4Star} total={noOfReview} />
                        <RatingMeter star={3} rating={noOf3Star} total={noOfReview} />
                        <RatingMeter star={2} rating={noOf2Star} total={noOfReview} />
                        <RatingMeter star={1} rating={noOf1Star} total={noOfReview} />
                    </View>

                    <View className='w-full space-y-7 mt-5 mb-10'>
                        {((!loading || (reviewData.length !== 0)) && reviewData.length === 0 ) && (
                            <View className='flex items-center'> 
                                <Empty/>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[11px]`}
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    You don't have a review yet
                                </Text>
                            </View>
                        )}
                        {(loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <View key={index} className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'} border-b`}>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor={(theme == 'dark')? '#1f2937':'#f3f3f3'}
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
                        {reviewData.map((item, index) => (
                            <View key={index} className='w-full px-4'>
                                <Text 
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[13px]`}
                                style={{fontFamily: 'Inter-Medium'}}>
                                    {item.date}
                                </Text>
                                <View className='flex flex-row items-center space-x-3 mt-2'>
                                    <View className='bg-green-100 rounded-full w-10 h-10 flex items-center justify-around'>
                                        <Text 
                                        className='text-[13px] text-custom-green'
                                        style={{fontFamily: 'Inter-Medium'}}>
                                            {getInitials(item.name)}
                                        </Text>
                                    </View>
                                    <Text 
                                    className={`${theme == 'dark'? 'text-gray-200' : 'textbg-gray-900'} text-[13px]`}
                                    style={{fontFamily: 'Inter-Medium'}}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View className='flex flex-row space-x-2 mt-2'>
                                    {subStars(item.rating).map((type, index) => (
                                        <FontAwesome
                                        key={index}
                                        name={
                                            type === 'full'
                                            ? 'star'
                                            : type === 'half'
                                            ? 'star-half-o'
                                            : 'star-o'
                                        }
                                        size={20}
                                        color="#228B22" // Gold color for stars
                                        />
                                    ))}
                                </View>
                                <Text 
                                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[14px] mt-2`}
                                style={{fontFamily: 'Inter-Regular'}}>
                                    {item.comment}
                                </Text>
                            </View>                
                        ))}
                    </View>
                    <Pagination currentPage={currentPage} count={count} pageSize={pageSize} onPageChange={(page)=>{setCurrentPage(page);}} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    shadow_box: {
      // iOS shadow properties
      shadowColor: '#1212126a',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      // Android shadow property
      elevation: 100,
    },
  });