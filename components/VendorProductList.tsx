import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import Time from '../assets/icon/time.svg';

interface Properties {
    image:any,
    name: string,
    price: string,
    discount: string,
    category: string,
    discounted_price: string,
    quantity_in_cart: string,
    description: string,
  }

const VendorProductList: React.FC<Properties> = ({image, name, price, category, discount, discounted_price, description, quantity_in_cart}) =>{
    const [quantity, setQuantity] = useState(parseInt(quantity_in_cart))
    return(
        <View className='flex flex-row items-center border-b border-gray-300 w-full p-4 h-28'>
            <View className=''>    
                <Image 
                source={image}
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
                    {description}
                </Text>
            </View>

            <View className='flex h-full justify-between ml-auto'>
                <View className='px-6 py-1 bg-custom-green rounded-md'>
                    <TouchableOpacity
                    onPress={()=>{router.push('/vendor/create_product')}}
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
                    onPress={()=>{router.push('/vendor/create_product')}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[11px] text-center text-custom-green py-1`}
                        >
                            Remove
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default VendorProductList;