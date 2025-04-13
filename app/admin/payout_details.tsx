import React, { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, StatusBar, Pressable, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { Link } from "expo-router";
import { useUser } from '@/context/UserProvider';
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { getRequest, postRequest } from '@/api/RequestHandler';
import FullScreenLoader from '@/components/FullScreenLoader';
import ENDPOINTS from '@/constants/Endpoint';
import Location from '../../assets/icon/location_highlight.svg';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import RNPickerSelect from 'react-native-picker-select';
import TransactionPinModal from '@/components/SetTransactionPinModal';
import TransactionPinPrompt from '@/components/TransactionPinPrompt';
import OTPPrompt from '@/components/OPTPrompt';

export default function PayoutDetails(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type BankDetails = {
        id: number; bank_name: string; bank_code: string; acc_number: string; acc_name: string; 
     };

    type APIResponse = {
       id: number; amount: string; status: string; date_requested: string; processed_date: string; payment_details: BankDetails; withdrawable_balance: string; email: string;
    };

    const [loading, setLoading] = useState(true)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [isActive, setIsActive] = useState(true)
    const [bankDetail, setBankDetails] = useState<BankDetails>()
    const [resData, setResData] = useState<APIResponse>()
    const [status, setStatus] = useState('pending')
    const [action, setAction] = useState('')

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setFetchLoading(true)
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['payment']['admin-withdrawal']}/${id}`, true);
                setResData(response)
                setBankDetails(response.payment_details)
                setStatus(response.status)
                setLoading(false) 
                setFetchLoading(false)
                // alert(JSON.stringify(response))
            } catch (error) {
                setLoading(false) 
                Toast.show({
                    type: 'error',
                    text1: "An error occured",
                    // text2: error.data?.data?.message || 'Unknown Error',
                    visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
                router.back()
            }
        };
    
        fetchInformation(); 
    }, []); // Empty dependency array ensures this runs once

    const handleRequest = async (action: string, otp: string) => {
        try {
          if(!loading){
            if (action == 'approve'){
                if(status !== 'success'){
                    setLoading(true)
                    const res = await postRequest(`${ENDPOINTS['payment']['approve-withdrawal']}/${id}`, {
                        'otp': otp,
                        'pin': transactionPin
                    }, true);
                    setStatus('success') 
                    Toast.show({
                        type: 'success',
                        text1: "Withdrawal request approved",
                        visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                        autoHide: true,
                    });
                }
            }
            if (action == 'decline'){
                if(status === 'pending'){
                    setLoading(true)
                    const res = await postRequest(`${ENDPOINTS['payment']['decline-withdrawal']}/${id}`, {
                        'otp': OTP,
                        'pin': transactionPin
                    }, true);
                    setStatus('failed') 
                    Toast.show({
                        type: 'success',
                        text1: "Withdrawal request declined",
                        visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                        autoHide: true,
                    });
                }
            } 
            setLoading(false)
          }
  
        } catch (error:any) {
          setLoading(false)
          Toast.show({
            type: 'error',
            text1: error.data?.message || "An error occured",
            // text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
    };

    const [showTransactionPinPrompt, setShowTransactionPinPrompt] = useState(false);
    const [transactionPinCorrect, setTransactionPinCorrect] = useState(false);
    const [transactionPin, setTransactionPin] = useState('');
    const [showTransactionPinModal, setShowTransactionPinModal] = useState(false);
    const [OTP, setOTP] = useState('');
    const [showOTPPromt, setShowOTPPromt] = useState(false);
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


    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content" backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={true} title='Payout Details' withbell={true} />
                </View>
                {(fetchLoading || loading) && (
                    <FullScreenLoader />
                )}

                {showTransactionPinPrompt && (
                    <TransactionPinPrompt 
                    with_otp={true} 
                    getValue={(value, pin)=>{setTransactionPinCorrect(value); setTransactionPin(pin); setShowTransactionPinPrompt(false); if(value == true){setShowOTPPromt(true)}; setLoading(false);}}/>
                )}

                {showOTPPromt && (
                    <OTPPrompt 
                    getValue={(value, pin)=>{setOTP(pin); handleRequest(action, pin); setShowOTPPromt(false)}}/>
                )}

                <TransactionPinModal 
                open={showTransactionPinModal}
                getValue={(value)=>{setShowTransactionPinModal(value)}}
                />
                <ScrollView
                className='w-full px-5' contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[15px] mt-10`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Withdrawal request review
                    </Text>

                                        
                    <Text
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[12px] mt-5`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        {resData?.email}
                    </Text>
            
                    <Text
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[12px] mt-5`}
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                        Account details
                    </Text>
                
                    <View
                    className={`${(theme == 'dark')? "bg-gray-800" :"bg-gray-100"} rounded-lg flex flex-col items-center w-full mt-1 mx-auto py-4 space-y-4`}
                    >
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Account number
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {bankDetail?.acc_number}
                            </Text>
                        </View>
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Recipent name
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {bankDetail?.acc_name}
                            </Text>
                        </View>
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Bank name
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {bankDetail?.bank_name}
                            </Text>
                        </View>
                    </View>

                    <Text
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[12px] mt-5`}
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                        Payment details
                    </Text>
                
                    <View
                    className={`${(theme == 'dark')? "bg-gray-800" :"bg-gray-100"} rounded-lg flex flex-col items-center w-full mt-1 mx-auto py-4 space-y-4`}
                    >
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Amount
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                ₦{resData?.amount}
                            </Text>
                        </View>
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Available balance
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {resData?.withdrawable_balance}
                            </Text>
                        </View>
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Date requested
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {resData?.date_requested}
                            </Text>
                        </View>
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Status
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {resData?.status}
                            </Text>
                        </View>
                        <View className='w-[90%] mx-auto'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[13px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Processed date
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} text-[11px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {resData?.processed_date}
                            </Text>
                        </View>
                    </View>
                                        
                    <View className='mt-3 mb-8'>
                        <TouchableOpacity
                        onPress={()=>{setAction('approve'); getPinStatus()}}
                        className={`text-center ${(loading || (status == 'success'))? 'bg-custom-inactive-green' : 'bg-custom-green'} relative rounded-xl p-2 w-full self-center mt-2 flex items-center justify-around`}
                        >
                            {loading && (
                                <View className='absolute w-full top-2'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                                            
                            <Text
                            className={'text-white'}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Approve
                            </Text>     
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{setAction('decline'); getPinStatus();}}
                        className={`text-center ${(loading || (status !== 'pending'))? 'bg-red-300' : 'bg-red-500'} relative rounded-xl p-2 w-full self-center mt-2 flex items-center justify-around`}
                        >
                            {loading && (
                                <View className='absolute w-full top-2'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                                            
                            <Text
                            className={'text-white'}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Decline
                            </Text>     
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}