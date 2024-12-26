import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, TouchableWithoutFeedback, Platform, Alert, Image, TextInput, ScrollView  } from "react-native";
import { Link, router, useGlobalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import { postRequest } from '@/api/RequestHandler';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login(){
    const {next} = useGlobalSearchParams()
    const { setUser } = useUser();
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const [password, setPassword] = useState('')
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
          type DataResponse = { message: string; token:string; refresh: string, name:string; email:string; avatar:string; first_name:string; full_name:string; phone_number:string; buyer_address:string; latitude:string; longitude:string; delivery_address: boolean };
          type ApiResponse = { status: string; message: string; data:DataResponse };
          const res = await postRequest<ApiResponse>(ENDPOINTS['buyer']['signin'], {email: email,password: password}, false);
          
          await AsyncStorage.setItem('token', res.data.token);
          await AsyncStorage.setItem('refresh', res.data.refresh);
          setLoading(false)
          setUser({
            email: res.data.email,
            phone_number:  res.data.phone_number,
            avatar: res.data.avatar,
            first_name: res.data.first_name,
            full_name: res.data.full_name,
            store_name: ''
          })
          Toast.show({
            type: 'success',
            text1: "Welcome back",
            visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });

          await Delay(2000)
          router.replace({
            pathname: (res.data.first_name == '')?'/complete_profile': (res.data.delivery_address)?'/dashboard': (res.data.buyer_address == '')? '/complete_profile_2' : `/set_delivery_address`,
            params: { name: res.data.name, longitude: res.data.longitude, latitude: res.data.latitude, address: res.data.buyer_address},
          }); 
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.data?.data?.message || 'Unknown Error',
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.data?.data?.message || 'Unknown Error'); // Set error message
      }
    };

    return (
      <SafeAreaView>
        <View 
        className='w-full h-full bg-white flex items-center'
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className='mt-10 mx-auto'>
              <Logo width={200} height={200} />
            </View>

            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green text-lg -mt-8 mx-auto'
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

            <Link 
            href="/vendor/forgot_password?service=buyer" 
            style={{fontFamily: 'Inter-Medium'}} 
            className='text-gray-500 text-[12px] ml-auto mr-5'>
               Forget Password?
            </Link> 

            <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-center text-[12px] text-gray-500 mt-auto'
              >
                Don't have an account? <Link href="/registration" style={{fontFamily: 'Inter-Bold'}} className='text-gray-800'>Sign up</Link> 
              </Text>

            <View className='w-[90%] mx-auto mb-10'>
              <TouchableOpacity
              onPress={handleLogin}
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
                  Sign In
                </Text>
                    
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    )
}