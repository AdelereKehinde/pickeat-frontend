import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../../assets/images/Logo.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Locked from '../../assets/icon/locked.svg';
import Email from '../../assets/icon/mail2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';


export default function ForgetPassword(){
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const validateInput = () =>{
      if(email.includes(".com")){
        return true;
      }
      return false;
    }

    const [focus, setFocus] = useState('')
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleForgetPassword = async () => {
      try {
        if(!loading && validateInput()){
            router.push({
                pathname: '/vendor/confirm_pin',
                params: { email: email.toLowerCase() },
              }); 
        //   setLoading(true)
        //   const res = await axios.post(ENDPOINTS['signin'], {
        //     email: email,
        //     password: password,
        //     password2: password2,
        //   }); 
        //   setLoading(false)
        //   setData(res.data); // Display or use response data as needed

        //   Toast.show({
        //     type: 'success',
        //     text1: "Welcome back",
        //     visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
        //     autoHide: true,
        //   });
        //   await Delay(3000)

        //   router.push({
        //     pathname: '/complete_profile_2',
        //   }); 
        }

      } catch (error:any) {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.response?.data?.data?.message || 'Unknown Error',
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.response.data?.data?.message || 'Unknown Error'); // Set error message
      }
    };

    return (
        <View 
        className='w-full h-full bg-white flex items-center'
        >
            <Toast config={toastConfig} />

            <View className='mt-5'>
              <Logo width={120} height={120} />
            </View>

            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green text-lg -mt-8'
            >
              PickEAT PickIT
            </Text>

            <View
            className='mx-7 mt-14 w-full'
            >
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`pl-3 text-[17px] w-full text-gray-800`}
                >
                    Confirm Pin
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`pl-3 text-[11px] w-full text-gray-500`}
                >
                    To continue, kindly enter your email address
                </Text>
            </View>

            <View className='flex flex-row justify-around items-center w-full p-5 space-x-3 mt-5'>
                <View className='grow space-y-5'>
                <View className={`w-full flex-row items-center p-1 relative border ${(focus=='email')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                        <View className='absolute left-2'>
                          <Email />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={` rounded-xl p-3 py-2 pl-10 text-[13px] w-full text-gray-600`}
                            onChangeText={setEmail}
                            onFocus={()=>{setFocus('email')}}
                            onBlur={()=>{setFocus('')}}
                            // maxLength={10}
                            // keyboardType="number-pad"
                            placeholder='Email address'
                            placeholderTextColor="black"
                        />
                    </View>
                
                </View>
            </View> 

            <View className='w-[90%] mx-auto'>
              <TouchableOpacity
              onPress={handleForgetPassword}
              className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
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
              className='text-center text-[12px] text-gray-500  mt-36'
              >
                Don't have an account? <Link href="/registration" style={{fontFamily: 'Inter-Bold'}} className='text-gray-800'>Sign up</Link> 
              </Text>
        </View>
    )
}