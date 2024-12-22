import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import CartItem from '@/components/CartItem';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useFocusEffect } from "@react-navigation/native";
import PaymentItem from '@/components/PaymentItem';
import ChevronRight from '../assets/icon/chevron_right.svg';
import PromoCode from '../assets/icon/promo_code.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentPage(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(Boolean);
    const [isFocused, setIsFocus] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [loadSignal, setLoadSignal] = useState(false)
    type ItemsArray = { id: number; category_name: string; meal_name: string; meal_id: number; quantity: number; store_name: string; thumbnail: string; discounted_price: number; deleted: boolean; discount: string; in_stock: boolean;}[];
    type ListData = { pricing: {subtotal: number; delivery_fee: number}; cart_items: ItemsArray; };
    type MealResponse = { status: string; message: string; data: ListData;};

    const [cartItems, setCartItems] = useState<ItemsArray>([]);
    const [resData, setResData] = useState<ListData>();
    const [subTotal, setSubTotal] = useState(Number)
    const [deliveryFee, setDeliveryFee] = useState(Number)

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await getRequest<MealResponse>(`${ENDPOINTS['cart']['checkout-summary']}`, true);
                setResData(response.data)
                setCartItems(response.data.cart_items)
                setSubTotal(response.data.pricing.subtotal)
                setDeliveryFee(response.data.pricing.delivery_fee)
            } catch (error) {
                alert(error);
            }
        };
    
        fetchMeals();
    }, []); // Empty dependency array ensures this runs once

    const handleSetLoading = (value: boolean) =>{
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
        setSubTotal(TotalPrice)
    }

    const handleRemoveItem = (itemId: number) => {
        var newCart = cartItems.filter((item)=>item.id != itemId)
        let TotalPrice = 0
        newCart.forEach((item) => {
            TotalPrice += item.discounted_price * item.quantity;
        });
        setSubTotal(TotalPrice)
        setCartItems(newCart);
    };
    
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='border-b-4 border-gray-100 w-full'>
                    <TitleTag withprevious={true} title='Payment' withbell={false} />
                </View>
                
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='bg-white w-full border-b-2 border-gray-200 mb-5 relative flex flex-row items-start justify-center h-80'>
                        <ScrollView className='w-full space-y-1' contentContainerStyle={{ flexGrow: 1 }}>
                            {(cartItems.length === 0) && 
                                <View className='flex space-y-2 w-screen px-2 mt-2 overflow-hidden'>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <View key={index} className='border-b border-gray-300'>
                                            <ContentLoader
                                            width="100%"
                                            height={100}
                                            backgroundColor="#f3f3f3"
                                            foregroundColor="#ecebeb"
                                            >
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
                                    <PaymentItem 
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

                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className=' text-[14px] text-gray-800 self-start ml-5'
                    >
                        Payment Summary
                    </Text>         
                    <View className='bg-white w-full my-3 px-4 relative flex flex-row items-center justify-center'>
                        <View className='absolute left-6 z-10'>
                            <PromoCode />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-9 py-2 text-[11px]`}
                            autoFocus={false}
                            onFocus={()=>setIsFocus(true)}
                            onBlur={()=>setIsFocus(false)}
                            onChangeText={setPromoCode}
                            value={promoCode}
                            placeholder="Enter your promo code"
                            placeholderTextColor=""
                        />
                        <TouchableOpacity 
                        onPress={()=>{}}
                        className='flex flex-row items-center px-2 absolute inset-y-0 space-x-1 top-2 right-7 rounded-lg h-8 bg-gray-100 my-auto'>
                            <View className=''>
                                <ChevronRight width={15} height={15} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    <View className='space-y-2'>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className=' text-[13px] text-gray-400'
                            >
                                Subtotal
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[13px] text-gray-700'
                            >
                                ${subTotal}.00
                            </Text>  
                        </View>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className=' text-[13px] text-gray-400'
                            >
                                Coupon discount
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[13px] text-gray-700'
                            >
                                -$5.58
                            </Text>  
                        </View>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className=' text-[14px] text-gray-400'
                            >
                                Delivery fee
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[13px] text-gray-700'
                            >
                                ${deliveryFee}.00
                            </Text>  
                        </View>
                        <View className='flex flex-row items-center justify-between w-full px-5'>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className=' text-[14px] text-gray-700'
                            >
                                Total Amount
                            </Text>  
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[14px] text-custom-green'
                            >
                                ${subTotal + deliveryFee}.00
                            </Text>  
                        </View>
                    </View>

                    <View className='flex flex-row items-center px-5 space-x-2 w-full mt-8'>
                        <TouchableOpacity
                        onPress={()=>{router.replace('/kitchen_page')}}
                        className={`text-center  border border-custom-green ${(cartItems.length === 0 || loading || loadSignal) && 'border-gray-400'} relative rounded-xl grow  p-4 self-center flex items-center justify-around`}
                        >
                            {(loadSignal) && (
                                <View className='absolute w-full top-4'>
                                    <ActivityIndicator size="small" color="#000000" />
                                </View>
                            )}
                            <Text
                            className={`${(cartItems.length === 0 || loading) && 'text-gray-400'}`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                            Add to cart
                            </Text>
                                
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{!(cartItems.length === 0 || loading || loadSignal) && router.push(`/payment_confirmation?promo_code=${promoCode}`)}} 
                        className={`text-center bg-custom-green ${(cartItems.length === 0 || loading || loadSignal) && 'bg-custom-inactive-green'} relative rounded-xl grow  p-4 self-center flex items-center justify-around`}
                        >
                            {(loadSignal) && (
                                <View className='absolute w-full top-4'>
                                    <ActivityIndicator size="small" color="#000000" />
                                </View>
                            )}
                            <Text   
                            className='text-white'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                            Checkout
                            </Text>
                                
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}