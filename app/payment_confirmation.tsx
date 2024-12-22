import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, router, useGlobalSearchParams } from "expo-router";
import TitleTag from '@/components/Title';
import CartItem from '@/components/CartItem';
import { getRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useFocusEffect } from "@react-navigation/native";
import PaymentItem from '@/components/PaymentItem';
import ChevronRight from '../assets/icon/chevron_right.svg';
import PromoCode from '../assets/icon/promo_code.svg';
import { TruncatedText } from '@/components/TitleCase';
import Delay from '@/constants/Delay';
import Empty from '../assets/icon/empy_transaction.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentConfirmationPage(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const {promo_code} = useGlobalSearchParams()

    const [loading, setLoading] = useState(Boolean);
    const [EPLoading, setEPLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('')
    const [loadSignal, setLoadSignal] = useState(false)
    type ItemsArray = { id: number; category_name: string; meal_name: string; meal_id: number; quantity: number; store_name: string; thumbnail: string; discounted_price: number; deleted: boolean; discount: string; in_stock: boolean;}[];
    type ListData = { pricing: {subtotal: number; percentage_off: number; discounted_total: number; service_charge: number; delivery_fee: number}; valid_promo_code: boolean; delivery_address: string; order_id: string; cart_items: ItemsArray; };
    type MealResponse = { status: string; message: string; data: ListData;};

    const [cartItems, setCartItems] = useState<ItemsArray>([]);
    const [resData, setResData] = useState<ListData>();
    const [subTotal, setSubTotal] = useState(Number)
    const [deliveryFee, setDeliveryFee] = useState(Number)
    const [percentageOff, setPercentageOff] = useState(Number)
    const [discountedTotal, setDiscountedTotal] = useState(Number)

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true)
                const response = await getRequest<MealResponse>(`${ENDPOINTS['cart']['checkout-summary']}?promo_code=${promo_code}`, true);
                // alert(JSON.stringify(response))
                if((promo_code != '') && !response.data.valid_promo_code){
                    Toast.show({
                        type: 'error',
                        text1: "Invalid Promo Code",
                        // text2: error.data?.message || 'Unknown Error',
                        visibilityTime: 5000, // time in milliseconds (5000ms = 5 seconds)
                        autoHide: true,
                    });
                }
                setResData(response.data)
                setCartItems(response.data.cart_items)
                setSubTotal(response.data.pricing.subtotal)
                setDeliveryFee(response.data.pricing.delivery_fee)
                setPercentageOff(response.data.pricing.percentage_off)
                setDiscountedTotal(response.data.pricing.discounted_total)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                // alert(error);
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

    const handleRemoveItem = (itemId: number) => {
        // alert(itemId)
        var newCart = cartItems.filter((item)=>item.id != itemId)
        let TotalPrice = 0
        newCart.forEach((item) => {
            TotalPrice += item.discounted_price * item.quantity;
        });
        setSubTotal(TotalPrice)
        setCartItems(newCart);
    };

    const UpdateTotalPrice = (id: number, quantity: number) => {
        // alert(id)
        if(quantity == 0){
            handleRemoveItem(id)
        }else{
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
    }
    
    const handlePayment = async () => {
        try {
          if(!loading && cartItems.length !== 0){
            setLoading(true)
            setLoadSignal(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(ENDPOINTS['payment']['pay'], {}, true);
            setLoading(false)
            setLoadSignal(false)
            Toast.show({
              type: 'success',
              text1: "Order completed",
              visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
  
            await Delay(2000)
            router.replace("/(tabs)/cart")
          }
  
        } catch (error:any) {
          setLoading(false)
          setLoadSignal(false)
        //   alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: error.data?.message || "An error occured",
            text2: error.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
      };
    
    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='border-b-4 border-gray-100 w-full'>
                    <TitleTag withprevious={true} title='Payment confirmation' withbell={false} />
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className='bg-white w-full mb-5 relative flex flex-row items-start justify-center'>
                    <View className='w-full space-y-1'>
                        {(!loading && cartItems.length === 0) && (
                            <View className='flex items-center'> 
                                <Empty/>
                            </View>
                        )}
                        {(loading && cartItems.length === 0) && 
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
                    </View>
                </View>

                <View className='flex flex-row items-center justify-between w-full px-5'>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className=' text-[13px] text-gray-400'
                    >
                        Order ID: {" "} 
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className=' text-[14px] text-custom-green'
                        >
                            {resData?.order_id}
                        </Text>  
                    </Text>  
                    <Text
                    style={{fontFamily: 'Inter-Regular'}}
                    className=' text-[13px] text-custom-green'
                    >
                        just now
                    </Text>  
                </View>  
                
                <View className='space-y-1  border-b border-gray-300 w-[90%] py-2 self-center'>
                {cartItems.map((item) => (
                    <View key={item.id} className='flex flex-row mt-5 justify-between items-center'>
                        <View
                        className='w-8 h-6 rounded-md bg-gray-100 flex justify-around items-center'
                        >
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`text-[10px] text-custom-green`}
                            >
                                X{item.quantity}
                            </Text>
                        </View>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`text-[13px] grow pl-4 text-gray-400`}
                        >
                            {item.meal_name}
                        </Text>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[13px] text-custom-green'
                        >
                            ₦{item.discounted_price}
                        </Text> 
                    </View>
                ))}
                </View>

                <View className='space-y-2 mt-4'>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-gray-400'
                        >
                            Service Charges:
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-custom-green'
                        >
                            ₦{resData?.pricing.service_charge}
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-gray-400'
                        >
                            Delivery Charges:
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-custom-green'
                        >
                            ₦{deliveryFee}.00
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-gray-800'
                        >
                            Promo Code 
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium-Italic'}}
                        className=' text-[11px] text-gray-500'
                        >
                            {percentageOff}% off
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[14px] text-gray-800' 
                        >
                            Total
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[14px] text-custom-green'
                        >
                            ₦{discountedTotal + deliveryFee}.00
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className=' text-[12px] text-gray-400' 
                        >
                            DELIVER TO {"\n"}
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className=' text-[10px] text-gray-800'
                            >
                                {TruncatedText(resData?.delivery_address || '', 40) }
                            </Text> 
                        </Text>  
                        <TouchableOpacity>
                            <Text
                            style={{fontFamily: 'Inter-Medium-Italic'}} 
                            className=' text-[12px] text-custom-green'
                            >
                                Change
                            </Text>  
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='flex flex-row items-center justify-between w-full px-5 py-4 mt-5 border-t border-gray-200'>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className=' text-[16px] text-gray-600' 
                    >
                        Payment method
                    </Text>  
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className=' text-[16px] text-custom-green'
                    >
                        WALLET
                    </Text>  
                </View>

                <View className='flex items-center px-5 space-y-2 w-full my-8'>
                    <TouchableOpacity
                    onPress={handlePayment}
                    className={`text-center bg-custom-green ${(cartItems.length === 0 || loading || loadSignal) && 'bg-custom-inactive-green'} relative rounded-xl w-[80%]  p-4 self-center flex items-center justify-around`}
                    >
                        <Text
                        className='text-white'
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                        Pay now
                        </Text>
                        {(loadSignal) && (
                            <View className='absolute w-full top-4'>
                                <ActivityIndicator size="small" color="#6b7280" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{router.replace('/(tabs)/cart')}}
                    className={`text-center bg-gray-100 ${(cartItems.length === 0 || loading || loadSignal) && 'bg-gray-200'} relative rounded-xl w-[80%]  p-4 self-center flex items-center justify-around`}
                    >
                        <Text
                        className={`text-custom-green ${(cartItems.length === 0 || loading || loadSignal) && 'text-gray-500'}`}
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                        Cancel order
                        </Text>
                        {(loadSignal) && (
                            <View className='absolute w-full top-4'>
                                <ActivityIndicator size="small" color="#6b7280" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}