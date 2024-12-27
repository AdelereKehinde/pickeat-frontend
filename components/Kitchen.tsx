import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import ActiveHeart from '../assets/icon/active_heart.svg';
import Time from '../assets/icon/time.svg';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';

interface Properties {
    image:any,
    kitchen_id: string,
    is_favourite: boolean,
    name: string,
    time: string,
    rating: string,
    fee: string,
  }

const KitchenCard: React.FC<Properties> = ({image, kitchen_id, is_favourite, name, time, rating, fee}) =>{
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 
    
    const [isFavourite, setIsFavourite] = useState(is_favourite)

    const FavouriteStore = async () => {
        try {
          if(!loading){
            setLoading(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(`${ENDPOINTS['buyer']['add-remove-favourite-store']}${kitchen_id}/favourite/add-remove`, {}, true);
            setIsFavourite(!isFavourite)
            // alert(JSON.stringify(res))
            setLoading(false)
          }
  
        } catch (error:any) {
          setLoading(false)
        //   alert(JSON.stringify(error))
          setError(error.data?.data?.message || 'Unknown Error'); // Set error message
        }
      };

    return(
        <View className='flex flex-row  items-center mx-3 py-2 border-b border-gray-300'>
            <View> 
                <TouchableOpacity
                onPress={()=>{router.push(`/kitchen_product?kitchen_id=${kitchen_id}`)}}
                >
                    <Image 
                    source={{uri: image}}
                    className=''
                    width={70}
                    height={55}
                    />
                </TouchableOpacity>   
            </View>

            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className=' text-[12px]'
                >
                    {name}
                </Text>
                <View className='flex flex-row items-center mt-2'>
                    <Time />
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-gray-500 text-[11px] ml-1'
                    >
                        Arrival in {time}
                    </Text>
                </View>
            </View>

            <View className='ml-auto'>
                <View className='flex flex-row justify-between'>
                    <View className='flex flex-row items-center space-x-2 py-[4px] px-3 rounded-xl bg-gray-200'>
                        <View className=''>
                            <Rating width={12} height={12} />
                        </View>
                        <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                {rating}
                        </Text>
                    </View>
                    <TouchableOpacity 
                    onPress={()=>{FavouriteStore()}}
                    className=''
                    >
                        {loading && (
                        <View className='absolute w-full top-0'>
                            <ActivityIndicator size="small" color="#000000" />
                        </View>
                        )}
                        <View className=''>
                            {isFavourite? 
                            <ActiveHeart width={20} height={20} />
                            :
                            <Heart width={20} height={20} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>

                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className='text-[10px] mt-1 text-gray-600'
                >
                    Delivery Fee - ₦{fee}
                </Text>
            </View>
        </View>
    )
}

export default KitchenCard;