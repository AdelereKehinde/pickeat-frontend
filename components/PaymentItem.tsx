import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { postRequest, deleteRequest } from '@/api/RequestHandler';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import Remove from '../assets/icon/remove.svg';
import { TruncatedText } from './TitleCase';

interface Properties {
    image: any,
    quantity_in_cart: number,
    kitchen: string;
    meal_name: string,
    meal_id: number,
    cart_id: number,
    items: string[],
    date: string,
    price: number,
    parentLoadSignal: boolean,
    onRemove: (value: number) => void,
    onUpdate: (id: number, quantity: number) => void
    onLoading: (value: boolean) => void
  }

const PaymentItem: React.FC<Properties> = ({meal_name, quantity_in_cart,meal_id, kitchen, image, cart_id, date, price, items,parentLoadSignal, onRemove, onUpdate, onLoading}) =>{
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [quantity, setQuantity] = useState(quantity_in_cart)
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 
    
    const AddToCart = async (increase:boolean) => {
        try {
          if(!loading && (quantity != 0 || increase  && !parentLoadSignal)){
            setLoading(true)
            onLoading(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(`${ENDPOINTS['cart']['add']}?meal=${meal_id}`, {quantity: increase? (quantity+1): (quantity-1)}, true);
            // alert(JSON.stringify(res))
            setQuantity(increase? (quantity+1): (quantity-1))
            if(quantity==0){
                onRemove(cart_id)
            }else{
                onUpdate(cart_id, increase? (quantity+1): (quantity-1))
            }
            Toast.show({
                type: 'success',
                text1: res.message,
                visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
              });
            onLoading(false)
            setLoading(false)
          }
  
        } catch (error:any) {
            onLoading(false)
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

      const RemoveFromCart = async () => {
        try {
          if(!loading && !parentLoadSignal){
            setLoading(true)
            onLoading(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await deleteRequest<ApiResponse>(`${ENDPOINTS['cart']['remove']}?cart_id=${cart_id}`, true)
            // alert(JSON.stringify(res))
            onRemove(cart_id)
            onLoading(false)
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
            onLoading(false)
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
        <View className='flex items-center justify-between border-b border-gray-300 w-full h-28 py-3 px-6'>
            <View className='w-full flex flex-row'>
                <View className=''>    
                    <Image 
                    source={{uri: image}}
                    className='w-20 h-20 rounded-lg'
                    />
                </View>
                
                <View className='grow ml-2 flex flex-row items-center'>
                    <View className='flex grow'>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className=' text-[14px] text-gray-700 mr-auto'
                        >
                            {meal_name}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className=' text-[12px] text-custom-green mt-4'
                        >
                            ${price * quantity}
                        </Text>
                    </View>

                    <View className='flex items-end justify-between mb-2'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[13px] text-gray-800'
                        >
                            X{quantity}
                        </Text>
                        <View className='flex flex-row justify-between mt-4'>
                            
                            <TouchableOpacity
                            className='w-7 h-7 rounded-md bg-gray-100 flex justify-around items-center'
                            onPress={()=>{AddToCart(false)}}
                            >   
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`text-[15px] text-custom-green ${loading && 'text-gray-300'}`}
                                >
                                    -
                                </Text>
                                {(loading || parentLoadSignal) && (
                                <View className='absolute w-full top-1'>
                                    <ActivityIndicator size="small" color="#6b7280" />
                                </View>
                                )}
                            </TouchableOpacity>
                            <View className='w-7 h-7 mx-2 rounded-md flex justify-around items-center'>
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
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`text-[15px] text-custom-green ${loading && 'text-gray-300'}`}
                                >
                                    +
                                </Text>
                                {(loading || parentLoadSignal) && (
                                <View className='absolute w-full top-1'>
                                    <ActivityIndicator size="small" color="#6b7280" />
                                </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PaymentItem;