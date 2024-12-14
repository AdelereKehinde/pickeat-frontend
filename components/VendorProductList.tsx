import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { TruncatedText } from './TitleCase';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { deleteRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';

interface Properties {
    image:any,
    id: number,
    name: string,
    price: string,
    discount: string,
    category: string,
    discounted_price: string,
    quantity_in_cart: string,
    description: string,
    onRemove: (value: number) => void,
  }

const VendorProductList: React.FC<Properties> = ({image, id, name, price, category, discount, discounted_price, description, quantity_in_cart, onRemove}) =>{
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(''); // Error state 

    const handleDeletion = async () => {
      try {
        if(!loading){
            setLoading(true)
            type DataResponse = { onboarded: string; message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await deleteRequest<ApiResponse>(`${ENDPOINTS['inventory']['delete-meal']}/${id}`, true);
            setLoading(false)
            
            onRemove(id)
            Toast.show({
                type: 'success',
                text1: "Meal Removed",
                visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.data?.data?.message || 'Unknown Error',
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.data?.data?.message || 'Unknown Error'); // Set error message
      }
    };
    return(
        <View className='flex flex-row items-center border-b border-gray-300 w-full p-4 h-28'>
            <View className=''>    
                <Image 
                source={{ uri: image }}
                className='w-24 h-24 rounded-lg'
                />
            </View>

            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className=' text-[12px] text-gray-700'
                >
                    {TruncatedText(name, 16)}
                </Text>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className=' text-[11px] text-custom-green mt-2'
                >
                    {category} 
                </Text>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className=' text-[11px] -mt-1 text-gray-700 '
                >
                    ${discounted_price}
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium-Italic'}}
                className='text-[12px] text-gray-400 mt-1'
                >
                    {TruncatedText(description, 16)}
                </Text>
            </View>

            <View className='flex h-full justify-between ml-auto'>
                <View className='px-6 py-1 bg-custom-green rounded-md'>
                    <TouchableOpacity 
                    onPress={()=>{router.push({pathname:'/vendor/create_product', params: { id: id},})}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[11px] text-center text-white py-1`}
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className='px-6 py-1 bg-blue-100 rounded-md'>
                    <TouchableOpacity
                    className='flex items-center'
                    onPress={handleDeletion}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[11px] text-center text-custom-green py-1`}
                        >
                            Remove
                        </Text>
                        {(loading) && (
                            <View className='absolute w-full top-[4px] '>
                                <ActivityIndicator size="small" color="#6b7280" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default VendorProductList;