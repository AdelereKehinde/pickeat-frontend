import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';


export default function Login(){
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const validateInput = () =>{
      if(email.includes(".com") && (password.length>5)){
        return true;
      }
      return false;
    }

    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleLogin = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          const res = await axios.post(ENDPOINTS['signin'], {
            email: email,
            password: password,
            password2: password2,
          }); 
          setLoading(false)
          setData(res.data); // Display or use response data as needed

          Toast.show({
            type: 'success',
            text1: "Welcome back",
            visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
          await Delay(3000)

          router.push({
            pathname: '/complete_profile_2',
          }); 
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

            <View className='mt-10'>
              <Logo width={200} height={200} />
            </View>

            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green text-lg -mt-8'
            >
              PickEAT PickIT
            </Text>

            <View className='flex flex-row justify-around items-center w-full p-5 space-x-3 mt-10'>
                <View className='grow space-y-5'>
                  <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`bg-gray-100 rounded-xl p-3 text-[13px]`}
                    onChangeText={setEmail}
                    // maxLength={10}
                    // keyboardType="number-pad"
                    placeholder='Email address'
                    placeholderTextColor="black"
                  />
                  <View className="w-full flex-row items-center relative rounded-lg">
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`bg-gray-100 rounded-xl p-3 text-[13px] w-full text-gray-600`}
                      onChangeText={setPassword}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Password'
                      placeholderTextColor="black"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-2 right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="#4b5563"
                        style={{ padding: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
            </View> 

            <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-center text-[12px] text-gray-500'
              >
                Don't have an account? <Link href="/registration" className='text-custom-green'>Register</Link> 
              </Text>

            <View className='w-[90%] mx-auto mt-52'>
              <TouchableOpacity
              onPress={handleLogin}
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
                  Login
                </Text>
                    
              </TouchableOpacity>
            </View>
        </View>
    )
}