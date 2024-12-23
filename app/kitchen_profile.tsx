import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, TextInput, StyleSheet, Linking } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router'
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import KitchenImage from '../assets/images/kitchen_profile.svg';
import Arrow from '../assets/icon/arrow_right.svg';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { FontAwesome } from '@expo/vector-icons';
import FullScreenLoader from '@/components/FullScreenLoader';
import TitleCase from '@/components/TitleCase';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

function KitchenProfile(){
    const {kitchen_id, name} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type ReviewData = { total_reviews: number; average_rating: number;};
    type ProfileResponse = {id: number; review: ReviewData; avatar: string; business_name: string; business_mail: string; business_number: string; description: ''; available_from: string; available_to: string; time_start: string; time_end: string; profession: string; profession_category: string; address: "", chat_id: ""};
    type ApiResponse = { status: string; message: string; data: ProfileResponse;};

    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', ];

    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [noOfReview, setNoOfReview] = useState(0);

    const [data, setData] = useState<ProfileResponse>();

    const [availability, setAvailability] = useState([''])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['vendor']['profile']}/${kitchen_id}`, true); 
            setLoading(false) 
            // alert(JSON.stringify(response))
            setNoOfReview(response.data.review.total_reviews)
            setRating(response.data.review.average_rating)
            setData(response.data)

            const startIndex = daysOfWeek.indexOf(response.data.available_from);
            const endIndex = daysOfWeek.indexOf(response.data.available_to);

            setAvailability([...daysOfWeek.slice(startIndex), ...daysOfWeek.slice(0, startIndex)]
            .slice(0, (endIndex >= startIndex ? endIndex - startIndex + 1 : daysOfWeek.length - startIndex + endIndex + 1)))
            // alert(`${JSON.stringify(availability)} - ${startIndex} - ${endIndex}`)
        } catch (error) {
            setLoading(false)
            // alert(JSON.stringify(error)); 
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once

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

    const [review, setReview] = useState('');
    const [selectedRating, setSelectedRating] = useState<number>(0); // Default rating is 0
    const handleRating = (rating: number) => {
        setSelectedRating(rating); // Set selected rating
    };
    
    const getStarType = (index: number): 'full' | 'empty' => {
        return selectedRating >= index + 1 ? 'full' : 'empty';
    };

    const [error, setError] = useState('');

    const submitRating = async() => {
        if(review == ''){
            setError('type in your review')
        }else if(selectedRating==0){
            setError('select your star rating')
        }else{
            setError('')
            try{
                setLoading(true)
                const response = await postRequest(`${ENDPOINTS['buyer']['review']}`,{
                    store: kitchen_id,
                    rating: selectedRating,
                    comment: review,
                }, true); 
                setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: "Review sent",
                    // text2: res.message,
                    visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            }catch(error){
                setLoading(false)
                setReview('')
                setSelectedRating(0)
                Toast.show({
                    type: 'error',
                    text1: "An error occured",
                    // text2: error.data?.data?.message || 'Unknown Error',
                    visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            }
        }
    }

    const makeCall = () => {
      const url = `tel:${data?.business_number}`; // Format for opening phone app with the number
        Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
                Toast.show({
                    type: 'error',
                    text1: "Your device does not support phone calls.",
                    // text2: error.data?.data?.message || 'Unknown Error',
                    visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            } else {
                return Linking.openURL(url); // Opens the phone app
            }
        })
        .catch((err) => console.error('Error occurred:', err));
        };

    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='w-full bg-white'>
                    <TitleTag withprevious={true} title={data?.business_name || ''} withbell={true} />
                </View>
                
                {loading && (
                    <FullScreenLoader />
                )}

                <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View>
                        <View className='-mt-12 -z-10'>
                            <KitchenImage />
                        </View>
                        <View
                        style={styles.shadow_box}
                        className='w-[90%] mx-auto px-5 py-3 rounded-lg bg-white -mt-8 flex flex-row'
                        >
                            <View>
                                <Text
                                className='text-[15px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {data?.business_name}                         
                                </Text>

                                <View className='flex flex-row items-center space-x-2 mt-2'>
                                    {/* <Text 
                                    className='text-[30px] text-gray-700'
                                    style={{fontFamily: 'Inter-Bold'}}>
                                        {rating.toFixed(1)}
                                    </Text> */}
                                    <View className='flex flex-row space-x-1'>
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
                                            size={13}
                                            color="#228B22" // Gold color for stars
                                            />
                                        ))}
                                    </View>
                                    <Text 
                                    className='text-[10px] text-gray-400'
                                    style={{fontFamily: 'Inter-Medium'}}>
                                        {noOfReview} ratings
                                    </Text>
                                </View>

                                <Text
                                className='text-[10px]'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    {data?.address}             
                                </Text>
                            </View>


                            <View className='ml-auto flex items-end'>
                                <Text
                                className='text-[10px] text-gray-500'
                                style={{fontFamily: 'Inter-Medium'}}
                                >
                                    Allergies?                    
                                </Text>
                                <TouchableOpacity
                                onPress={makeCall}
                                className='bg-custom-green rounded-full px-8 py-1 flex items-center justify-around mt-3'
                                >
                                    <Text
                                    className='text-[10px] text-white'
                                    style={{fontFamily: 'Inter-Medium'}}
                                    >
                                        Call                      
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View className='flex items-center justify-around flex-row w-[80%] mx-auto mt-7 '>
                        <View className='grow border-r-2 border-gray-300 px-4'>
                            <Text
                            className='text-[13px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Category                  
                            </Text>
                            <Text
                            className='text-[12px] text-gray-500'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {data?.profession_category}                      
                            </Text>
                        </View>
                        <View className='grow px-4'>
                            <Text
                            className='text-[13px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Profession                  
                            </Text>
                            <Text
                            className='text-[12px] text-gray-500'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {data?.profession}              
                            </Text>
                        </View>
                    </View>

                    <View className='w-[90%] mx-auto'>
                        <TouchableOpacity
                        onPress={()=>{router.push(`/vendor/chat_page?kitchen_id=${data?.id}&name=${data?.business_name}&avatar=${data?.avatar}&chat_id=${data?.chat_id}`)}}
                        className={`text-center bg-custom-green relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
                        >
                            <Text
                            className='text-white text-[15px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Request this Service
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.shadow_box} className='bg-white w-[90%] mx-auto rounded-lg p-4 mt-5 border border-gray-100'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className='text-[12px] text-custom-green -mt-2 border-b py-1 border-gray-200'
                        >
                            Description
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Regular'}}
                        className='text-[12px] text-gray-500 border-gray-200 my-8'
                        >
                            {data?.description}
                        </Text>
                    </View>


                    <View className='w-[70%] mx-auto mt-5'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className='text-[13px] text-custom-green'
                        >
                            Availability
                        </Text>

                        <View className='space-y-1'>
                            {availability.map((item, _)=> (
                                <View key={_} className='flex flex-row justify-between'>
                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}}
                                    className='text-[12px] text-gray-400'
                                    >
                                        {TitleCase(item)}
                                    </Text>
                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}}
                                    className='text-[12px] text-gray-400'
                                    >
                                        -
                                    </Text>
                                    <Text
                                    style={{fontFamily: 'Inter-SemiBold'}}
                                    className='text-[12px] text-gray-400'
                                    >
                                        {data?.time_start} - {data?.time_end}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.shadow_box} className='bg-white w-[90%] mx-auto rounded-lg p-4 mt-5 mb-16 border border-gray-100'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className='text-[12px] text-custom-green -mt-2 border-b py-1 border-gray-200'
                        >
                            Review
                        </Text>
                        <View className={`flex-row space-x-2 mt-3`}>
                            {Array.from({ length: maxStars }, (_, index) => {
                            const type = getStarType(index);

                            return (
                                <TouchableOpacity
                                key={index}
                                onPress={() => handleRating(index + 1)}
                                >
                                <FontAwesome
                                    name={type === 'full' ? 'star' : 'star-o'}
                                    size={30}
                                    color="#228B22"
                                    className={`${
                                    type === 'full' ? 'text-custom-green' : 'text-gray-400'
                                    }`}
                                />
                                </TouchableOpacity>
                            );
                            })}
                        </View>
                        <TextInput
                        onChangeText={setReview}
                        multiline={true}
                        value={review}
                        numberOfLines={5}
                        style={{fontFamily: 'Inter-Medium'}}
                        placeholder="Write reviews about our service"
                        className="text-[12px] rounded-lg text-start"
                        />
                        {error != '' && (
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className='text-[12px] text-red-500'
                            >
                                {error}
                            </Text>
                        )}
                        <TouchableOpacity
                        onPress={submitRating}
                        className='flex flex-row items-center justify-between border-t border-gray-300 py-1'
                        >
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className='text-[12px] text-custom-green '
                            >
                                Drop review
                            </Text>

                            <View>
                                <Arrow />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <Toast config={toastConfig} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    shadow_box: {
      // iOS shadow properties
      shadowColor: '#9ca3af',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      // Android shadow property
      elevation: 50,
    },
  });

export default KitchenProfile;