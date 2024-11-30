import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { postRequest } from '@/api/RequestHandler';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';

interface Properties {
    image:any,
    meal_id: string,
    name: string,
    price: string,
    discount: string,
    discounted_price: string,
    quantity_in_cart: string,
    description: string,
  }

const Product: React.FC<Properties> = ({image, meal_id, name, price, discount, discounted_price, description, quantity_in_cart}) =>{
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [quantity, setQuantity] = useState(parseInt(quantity_in_cart))
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 
    
    const AddToCart = async (increase:boolean) => {
        try {
          if(!loading && (quantity != 0 || increase)){
            setLoading(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(`${ENDPOINTS['cart']['add']}?meal=${meal_id}`, {quantity: increase? (quantity+1): (quantity-1)}, true);
            // alert(JSON.stringify(res))
            setQuantity(increase? (quantity+1): (quantity-1))
            Toast.show({
                type: 'success',
                text1: res.message,
                visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
              });
            setLoading(false)
          }
  
        } catch (error:any) {
            setLoading(false)
            // alert(JSON.stringify(error))
            Toast.show({
                type: 'error',
                text1: "An error occured",
                text2: error.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            setError(error.data?.message || 'Unknown Error'); // Set error message
            }
      };

    return(
        <View className='flex flex-row items-center border-b border-gray-300 w-full p-4 h-28'>
            <View className=''>    
                <Image 
                source={{uri: image}}
                className='w-24 h-24 rounded-lg'
                />
            </View>

            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className=' text-[12px] text-gray-700'
                >
                    {name}
                </Text>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className=' text-[11px] text-custom-green mt-2'
                >
                    {discount}% OFF
                </Text>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className=' text-[11px] -mt-1 text-gray-700'
                >
                    <Text className='line-through'>${price}</Text> | ${discounted_price}
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium-Italic'}}
                className='text-[12px] text-gray-400 mt-1'
                >
                    {description}
                </Text>
            </View>

            <View className='flex h-full justify-between ml-auto'>
                <View className='flex flex-row justify-between'>
                    
                    <TouchableOpacity
                    className='w-7 h-7 rounded-md bg-gray-100 flex justify-around items-center'
                    onPress={()=>{AddToCart(false)}}
                    >   
                        {loading && (
                        <View className='absolute w-full top-1'>
                            <ActivityIndicator size="small" color="#000000" />
                        </View>
                        )}
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[15px] text-gray-700 ${loading && 'text-gray-300'}`}
                        >
                            -
                        </Text>
                    </TouchableOpacity>
                    <View className='w-7 h-7 rounded-md flex justify-around items-center'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[15px]'
                        >
                            {quantity}
                        </Text>
                    </View>
                    <TouchableOpacity
                    className='w-7 h-7 rounded-md bg-gray-100 flex justify-around items-center'
                    onPress={()=>{AddToCart(true)}}
                    >
                        {loading && (
                        <View className='absolute w-full top-1'>
                            <ActivityIndicator size="small" color="#000000" />
                        </View>
                        )}
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[15px] text-gray-700 ${loading && 'text-gray-300'}`}
                        >
                            +
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className=''>
                    <TouchableOpacity
                    onPress={()=>{router.push('/confirm_order')}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[11px] text-center ${(quantity>0)? 'text-white bg-custom-green': ' text-custom-green bg-gray-100' } px-2 py-1 rounded-md`}
                        >
                            Order Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Product;