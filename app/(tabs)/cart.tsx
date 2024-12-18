import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import CartItem from '@/components/CartItem';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Empty from '../../assets/icon/empy_transaction.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useFocusEffect } from "@react-navigation/native";
import Delay from '@/constants/Delay';
import { postRequest } from '@/api/RequestHandler';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cart(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);

    type ItemsArray = { id: number; category_name: string; meal_name: string; meal_id: number; quantity: number; store_name: string; thumbnail: string; discounted_price: number; deleted: boolean; discount: string; in_stock: boolean;}[];
    type ListData = { total_price: number; cart_items: ItemsArray; };
    type MealResponse = { status: string; message: string; data: ListData;};

    const [cartItems, setCartItems] = useState<ItemsArray>([]);
    const [resData, setResData] = useState<ListData>();
    const [totalPrice, setTotalPrice] = useState(Number)
    const [loadSignal, setLoadSignal] = useState(false)

    const isFocused = useIsFocused();
    const [ranOnce, setRanOnce] = useState(false)
    useEffect(() => {
        if(isFocused){
            const fetchMeals = async () => {
                try {
                    if(ranOnce){
                        setLoading(true)
                    }else{
                        setRanOnce(true)
                        setLoading(true)
                    }
                    setLoading(true)
                    const response = await getRequest<MealResponse>(`${ENDPOINTS['cart']['list']}`, true);
                    // alert(JSON.stringify(response.data))
                    setResData(response.data)
                    setCartItems(response.data.cart_items)
                    setTotalPrice(response.data.total_price)
                    setLoading(false)
                } catch (error) {
                    alert(error);
                }
            }
            fetchMeals();
        }
    }, [isFocused]); // Empty dependency array ensures this runs once

    const handleCheckout = async () => {
      try {
        if(!loading && !loadSignal){
          setLoading(true)
          setLoadSignal(true)
          const res = await postRequest(ENDPOINTS['cart']['checkout'], {}, true);
          setLoading(false)
          setLoadSignal(false)
          router.push('/payment')
        }
      } catch (error:any) {
        setLoading(false)
        setLoadSignal(false)
        Toast.show({ 
            type: 'error',
            text1: "An error occured",
            text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
        });
      }
    };

    const handleSetLoading = (value: boolean) =>{
        // alert(`${loading} - ${loadSignal}`)
        if (value == true){
            setLoading(true)
        }else{
            setLoading(false)
        }
        return value
    }

    const UpdateTotalPrice = (id: number, quantity: number) => {
        // alert(id)
        var newCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: quantity } : item
          );
        setCartItems(newCart); 
        let TotalPrice = 0
        newCart.forEach((item) => {
            TotalPrice += item.discounted_price * item.quantity;
        });
        setTotalPrice(TotalPrice)
    }

    const handleRemoveItem = (itemId: number) => { 
        // alert(itemId)
        var newCart = cartItems.filter((item)=>item.id != itemId)
        let TotalPrice = 0
        newCart.forEach((item) => {
            TotalPrice += item.discounted_price * item.quantity;
        });
        setTotalPrice(TotalPrice)
        setCartItems(newCart); 
    };
    
    
    return (
        <SafeAreaView>
            <View className=' bg-gray-50 w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-gray-100 w-full'>
                    <TitleTag withprevious={false} title='Cart' withbell={true} />
                </View>

                <View className='bg-white w-full relative flex flex-row justify-center mt-3 h-[550px]'>
                    {(!loading && cartItems.length == 0) && (
                        <View className='flex items-center w-full'> 
                            <Empty/>
                        </View>
                    )}
                    <ScrollView className='w-full space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                        {(cartItems.length === 0 && loading) && 
                            <View className='flex space-y-2 w-screen px-2 overflow-hidden'>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <View key={index} className='border-b border-gray-300'>
                                        <ContentLoader
                                        width="100%"
                                        height={100}
                                        backgroundColor="#f3f3f3"
                                        foregroundColor="#ecebeb"
                                        >
                                            {/* Add custom shapes for your skeleton */}
                                            <Rect x="5" y="0" rx="5" ry="5" width="100" height="70" />
                                            <Rect x="230" y="10" rx="5" ry="5" width="90" height="25" />
                                            <Rect x="120" y="10" rx="5" ry="5" width="80" height="10" />
                                            <Rect x="120" y="50" rx="5" ry="5" width="80" height="10" />
                                        </ContentLoader>
                                    </View> 
                                ))}
                            </View>
                        }
                        {cartItems.map((item) => (
                            <View key={item.id} className=''>
                                <CartItem 
                                quantity_in_cart={item.quantity}
                                image={item.thumbnail}
                                kitchen={item.store_name}
                                cart_id={item.id}
                                meal_name={item.meal_name} 
                                meal_id={item.meal_id}
                                price={item.discounted_price} 
                                date="Sep 4, 2021 at 12:14 am"
                                items={['rice', 'milk shake', 'chicken']}
                                parentLoadSignal={loadSignal}
                                onRemove={handleRemoveItem}
                                onUpdate={UpdateTotalPrice}
                                onLoading={handleSetLoading}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View className='flex flex-row items-center px-5 w-full'>
                    <View className=''>
                        <Text
                            className='text-gray-500'
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                            Total: 
                        </Text>
                        <Text
                            className='text-custom-green text-[16px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                            ${totalPrice}
                        </Text>
                        </View>
                    <TouchableOpacity
                    onPress={handleCheckout}
                    className={`text-center bg-custom-green ${(cartItems.length == 0 || (loading && !ranOnce) || loadSignal) && 'bg-custom-inactive-green'} relative rounded-xl w-[60%] ml-auto p-4 self-center flex items-center justify-around`}
                    >
                        <Text
                        className='text-white'
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                        Checkout
                        </Text>
                        {(loadSignal) && (
                            <View className='absolute w-full top-4'>
                                <ActivityIndicator size="small" color="#000000" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}