import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { TruncatedText } from './TitleCase';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { deleteRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

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
  }

const AdminProductList: React.FC<Properties> = ({image, id, name, price, category, discount, discounted_price, description, quantity_in_cart}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(''); // Error state 

    return(
        <View className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-300'} flex flex-row items-center border-b w-full p-4 h-28`}>
            <View className=''>    
                <Image 
                source={{ uri: image }}
                className='w-24 h-24 rounded-lg'
                />
            </View>

            <View className='flex justify-start ml-2'>
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[12px]`}
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
                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-[11px] -mt-1`}
                >
                    ₦{discounted_price}
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium-Italic'}}
                className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-400'} text-[12px] mt-1`}
                >
                    {TruncatedText(description, 16)}
                </Text>
            </View>

            <View className='flex ml-auto'>
                <View className='px-6 py-1 bg-custom-green rounded-md'>
                    <TouchableOpacity 
                    onPress={()=>{router.push(`/admin/meal_detail?id=${id}`)}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[11px] text-center text-white py-1`}
                        >
                            View
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AdminProductList;