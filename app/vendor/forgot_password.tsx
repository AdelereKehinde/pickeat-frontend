import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../../assets/images/Logo.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Locked from '../../assets/icon/locked.svg';
import Email from '../../assets/icon/mail2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import { postRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import validateEmail from '@/constants/emailValidator';

export default function ForgetPassword(){
    const {service,} = useGlobalSearchParams()
    const { theme, toggleTheme } = useContext(ThemeContext);

    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const [email, setEmail] = useState('');
    const [emailValidation, setEmailValidation] = useState({
      isValid: true,
      errors: [] as string[],
    });
    const handleEmailChange = (email: string) => {
      setEmail(email);
  
      // Validate the new password and update validation state
      const validationResult = validateEmail(email);
      setEmailValidation(validationResult);
    };

    const validateInput = () =>{
      if(emailValidation.isValid && (email.length !== 0)){
        return true;
      }
      return false;
    }

    const [focus, setFocus] = useState('')
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    var endpoint = '';
    switch (service) {
      case 'vendor':
        endpoint = ENDPOINTS['vendor']['forget-password']
        break;
      case 'buyer':
        endpoint = ENDPOINTS['buyer']['forget-password']
        break;
      case 'rider':
        endpoint = ENDPOINTS['rider']['forget-password']
        break;
      default:
        endpoint = ENDPOINTS['vendor']['forget-password']
        break;
    }

    const handleForgetPassword = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          type DataResponse = { id: string; };
          type ApiResponse = { status: string; message: string; data:DataResponse };

          const res = await postRequest<ApiResponse>(endpoint, {email: email}, false);
          // alert(JSON.stringify(res))
          setLoading(false)
  
          Toast.show({
            type: 'success',
            text1: "OTP Sent to email address",
            visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
    
          await Delay(2000)
          router.push({
            pathname: '/vendor/confirm_pin',
            params: { email: email.toLowerCase(), id: res.data.id, service: service},
          }); 
        }

      } catch (error:any) {
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

    return (
      <SafeAreaView>
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}
        >
          <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
            <View className='mt-5 mx-auto'>
              <Logo width={120} height={120} />
            </View>

            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green text-lg -mt-8 mx-auto'
            >
              PickEAT PickIT
            </Text>

            <View
            className='mx-7 mt-14 w-full'
            >
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} pl-3 text-[17px] w-full`}
                >
                    Confirm Pin
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} pl-3 text-[11px] w-full`}
                >
                    To continue, kindly enter your email address
                </Text>
            </View>

            <View className=' items-center w-full p-5 space-x-3 mt-5'>
                <View className='grow'>
                  <View className={`w-full flex-row items-center p-1 relative border ${(focus=='email')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                        <View className='absolute left-2'>
                          <Email />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-600'} rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
                            onChangeText={handleEmailChange}
                            onFocus={()=>{setFocus('email')}}
                            onBlur={()=>{setFocus('')}}
                            // maxLength={10}
                            // keyboardType="number-pad"
                            placeholder='Email address'
                            placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                        />
                    </View>
                  {/* Display validation error messages */}
                  {!(emailValidation.isValid) && (
                    <View className='mt-2 ml-2'>
                      {emailValidation.errors.map((error, index) => (
                        <Text key={index} 
                        style={{fontFamily: 'Inter-Regular'}}
                        className={`${theme == 'dark'? 'text-gray-100' : 'text-red-500'} text-[10px]`}>
                          {error}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
            </View> 

            <View className='w-[90%] mx-auto'>
              <TouchableOpacity
              onPress={handleForgetPassword}
              className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
              >
                {loading && (
                  <View className='absolute w-full top-4'>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
            
                <Text
                className='text-white'
                style={{fontFamily: 'Inter-Regular'}}
                >
                  Send One Time Pass
                </Text>
                    
              </TouchableOpacity>
            </View>

            <Text
              style={{fontFamily: 'Inter-Medium'}}
              className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-center text-[12px] mt-36`}
              >
                Don't have an account? <Link href="/registration" style={{fontFamily: 'Inter-Bold'}} className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'}`}>Sign up</Link> 
            </Text>
          </ScrollView>
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    )
}