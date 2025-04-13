import React, { useState, useEffect, useContext } from 'react';
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
import RoundToDecimalPlace from '@/components/RoundToDecimalPlace';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TransactionPinPrompt from '@/components/TransactionPinPrompt';
import TransactionPinModal from '@/components/SetTransactionPinModal';
import FullScreenLoader from '@/components/FullScreenLoader';

export default function PaymentConfirmationPage(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const {promo_code} = useGlobalSearchParams()

    const [loading, setLoading] = useState(true);
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
    const [serviceCharge, setServiceCharge] = useState(0)
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
                setServiceCharge(response.data.pricing.service_charge)
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
        var newCart = cartItems.filter((item)=>item.id != itemId)
        setCartItems(newCart); 
    };

    const UpdateTotalPrice = (id: number, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, quantity: quantity } : item
            )
        );
    }

    // Calculate total price
    const CalcSubTotal = cartItems.reduce(
        (sum, item) => sum + item.discounted_price * item.quantity,
        0
    );


    const [showTransactionPinPrompt, setShowTransactionPinPrompt] = useState(false);
    const [transactionPinCorrect, setTransactionPinCorrect] = useState(false);
    const [transactionPin, setTransactionPin] = useState('');
    const [showTransactionPinModal, setShowTransactionPinModal] = useState(false);
    const getPinStatus = async() =>{
        type PinApiResponse = {
            status: string; 
            message: string; 
            data: {
                status: boolean;
            }
        }
        setLoading(true)
        const response = await getRequest<PinApiResponse>(`${ENDPOINTS['account']['transaction-pin']}`, true); // Authenticated
        if (response.data.status == true){
            setShowTransactionPinPrompt(response.data.status)
        }else{
            setShowTransactionPinModal(true)
        }
        
        setLoading(false)
    }

    
    const handlePayment = async (pin: string) => {
        try {
          if(!loading && cartItems.length !== 0){
            setLoading(true)
            setLoadSignal(true)
            type DataResponse = { message: string; token:string; refresh: string };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await postRequest<ApiResponse>(ENDPOINTS['payment']['pay'], {
                'pin': pin
            }, true);
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
            // text2: error.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
    };

    const CalcTotal = () => {
        var total = cartItems.reduce((sum, item) => sum + item.discounted_price * item.quantity, 0);
        total = total + serviceCharge + deliveryFee
        return (total - (total * percentageOff / 100))
    }
    
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
                    <TitleTag withprevious={true} title='Payment confirmation' withbell={false} />
                </View>

                {loading && (
                    <FullScreenLoader />
                )}

                {showTransactionPinPrompt && (
                    <TransactionPinPrompt 
                    with_otp={false}
                    getValue={(value, pin)=>{setTransactionPinCorrect(value); setTransactionPin(pin); setShowTransactionPinPrompt(false); if(value == true){handlePayment(pin)}else{setLoadSignal(false)};}}/>
                )}


                <TransactionPinModal 
                open={showTransactionPinModal}
                getValue={(value)=>{setShowTransactionPinModal(value)}}
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full mb-5 relative flex flex-row items-start justify-center`}>
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
                                        backgroundColor={(theme == 'dark')? '#111827':'#f3f3f3'}
                                        foregroundColor={(theme == 'dark')? '#4b5563':'#ecebeb'}
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
                        className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-8 h-6 rounded-md flex justify-around items-center`}
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
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-400'} text-[13px] grow pl-4`}
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
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-400'} text-[11px]`}
                        >
                            Service Charges:
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-custom-green'
                        >
                            ₦{serviceCharge}
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-400'} text-[11px]`}
                        >
                            Delivery Charges:
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-custom-green'
                        >
                            ₦{deliveryFee}
                        </Text>  
                    </View> 
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[11px]`}
                        >
                            Promo Code 
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium-Italic'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px]`}
                        >
                            {percentageOff}% off
                        </Text>  
                    </View>
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-800'} text-[14px]`}
                        >
                            Total
                        </Text>  
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[14px] text-custom-green'
                        >
                            ₦{RoundToDecimalPlace(CalcTotal(), 2)}
                        </Text>  
                    </View> 
                    <View className='flex flex-row items-center justify-between w-full px-5'>
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-400'} text-[12px]`}
                        >
                            DELIVER TO {"\n"}
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-800'} text-[10px]`}
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
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} text-[16px]`}
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
                    onPress={getPinStatus}
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
                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
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
                                <ActivityIndicator size="small" color={(theme=='dark')? "#fff" : "#4b5563"} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
            <Toast config={toastConfig} />
        </SafeAreaView>
    )
}