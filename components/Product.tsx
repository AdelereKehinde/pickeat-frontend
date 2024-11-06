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
    discounted_price: string,
    quantity_in_cart: string,
    description: string,
  }

const Product: React.FC<Properties> = ({image, name, price, discount, discounted_price, description, quantity_in_cart}) =>{
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
                    onPress={()=>{if(quantity !== 0){setQuantity(quantity-1)}}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[15px] text-gray-700' 
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
                    onPress={()=>{setQuantity(quantity+1)}}
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[15px] text-custom-green'
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