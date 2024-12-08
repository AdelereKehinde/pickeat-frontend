import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../../assets/images/Logo.svg';
import User from '../../assets/icon/usericon.svg';
import Locked from '../../assets/icon/locked.svg';
import Phone from '../../assets/icon/number.svg';
import Email from '../../assets/icon/mail2.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import { postRequest } from '@/api/RequestHandler';

export default function ResetPassword(){
    const {token, id, service} = useGlobalSearchParams()
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const [focus, setFocus] = useState('')

    const validateInput = () =>{
      if((password.length>5) && (password2.length>5) && (password.trim() == password2.trim())){
        return true;
      }
      return false;
    }

    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    var endpoint = '';
    var next_url = '/vendor/login';
    switch (service) {
        case 'vendor':
          endpoint = ENDPOINTS['vendor']['reset-password']
          next_url = '/vendor/login'
          break;
        case 'buyer':
          endpoint = ENDPOINTS['buyer']['reset-password']
          next_url = '/login'
          break;
        default:
          endpoint = ENDPOINTS['vendor']['reset-password']
          next_url = '/vendor/login'
          break;
    }

    const handleRequest = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          type DataResponse = { id: string; };
          type ApiResponse = { status: string; message: string; data:DataResponse };

          const res = await postRequest<ApiResponse>(`${endpoint}/${id}/${token}`, {new_password: password}, false);
          // alert(JSON.stringify(res))
          setLoading(false)
  
          Toast.show({
            type: 'success',
            text1: "Password Reset successful",
            visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
    
          await Delay(2000)
          router.push({
            pathname: next_url,
          }); 
        }

      } catch (error:any) {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.response.data['data']['message'],
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.response.data['data']['message']); // Set error message
      }
    };

    return (
        <View 
        className='w-full h-full bg-white flex items-center'
        >
            <View className='mt-10'>
              <Logo width={120} height={120} />
            </View>

            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green text -mt-8'
            >
              PickEAT PickIT
            </Text>

            <View className=' self-start pl-5 mt-4'>
              <Text
              style={{fontFamily: 'Inter-Bold'}}
              className='text-gray-800 text-[17px] '
              >
                Reset Passsword
              </Text>
              <Text
              style={{fontFamily: 'Inter-Regular'}}
              className='text-gray-500 text-[11px] '
              >
                To continue, kindly complete the following fields.
              </Text>
            </View>


            <View className='flex flex-row justify-around items-center w-full p-5 space-x-3 mt-6'>
                <View className='grow space-y-2'>
                  
                  <View className={`w-full flex-row items-center relative border ${(focus=='password')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                    <View className='absolute left-2'>
                      <Locked />
                    </View>
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`rounded-xl p-3 py-2 pl-10 text-[13px] w-full text-gray-600`}
                      onChangeText={setPassword}
                      onFocus={()=>{setFocus('password')}}
                      onBlur={()=>{setFocus('')}}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Password'
                      placeholderTextColor="black"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-1 right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={18}
                        color="#4b5563"
                        style={{ padding: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View className={`w-full flex-row items-center relative border ${(focus=='password2')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                    <View className='absolute left-2'>
                      <Locked />
                    </View>
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
                      onFocus={()=>{setFocus('password2')}}
                      onBlur={()=>{setFocus('')}}
                      onChangeText={setPassword2}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Retype Password'
                      placeholderTextColor="black"
                      secureTextEntry={!showPassword2}
                    />
                    <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}
                    className='absolute inset-y-1 right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword2 ? 'eye-slash' : 'eye'}
                        size={18}
                        color="#4b5563"
                        style={{ padding: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
            </View> 

            <View className='w-[90%] mx-auto'>

              <TouchableOpacity
              onPress={handleRequest}
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
                  Reset
                </Text>
                    
              </TouchableOpacity>
            </View>
            <Toast config={toastConfig} />
        </View>
    )
}