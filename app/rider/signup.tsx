import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, ScrollView, StatusBar, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../assets/images/Logo.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Locked from '../../assets/icon/locked.svg';
import Email from '../../assets/icon/mail2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import { postRequest } from '@/api/RequestHandler';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Device from "expo-device";
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';


export default function RiderSignUp(){
  const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();

    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };

    const deviceName = Device.modelName; // e.g., "iPhone 12"
    const deviceType = Device.deviceType === 1 ? "Mobile" : "Desktop";

    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const validateInput = () =>{
      if(email.includes(".com") && (password.length>5) && (password.trim() == password2.trim())){
        return true;
      }
      return false;
    }

    const [focus, setFocus] = useState('')
    const [data, setData] = useState({}); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleRegistration = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          type DataResponse = { id: string; };
          type ApiResponse = { status: string; message: string; data:DataResponse };
          var request_body = {
            email: email,
            password: password,
            password2: password2,
            device_name: deviceName,
            device_type: deviceType,
          }
          const res = await postRequest<ApiResponse>(ENDPOINTS['rider']['signup'], request_body, false);
          setLoading(false)

          Toast.show({
            type: 'success',
            text1: "Otp Sent",
            text2: res.message,
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
          await Delay(3000)
          router.push({
            pathname: '/rider/verification_code',
            params: { email: email.toLowerCase(), id: res.data.id},
          }); 
        }

      } catch (error:any) {
        setLoading(false)
        alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.data?.data?.message || "Unknown Error",
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.data?.data?.message || "Unknown Error"); // Set error message
      }
    };

    return (
      <SafeAreaView>
        <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
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
                className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} pl-3 text-[17px] w-full`}
                >
                    Create Rider's Account
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} pl-3 text-[11px] w-full`}
                >
                    To continue, kindly provide the following details
                </Text>
            </View>

            <View className='flex flex-col justify-around items-center w-full p-5 space-x-3 mt-5'>
                <View className='grow space-y-5'>
                  <View className={`w-full flex-row items-center relative border ${(focus=='email')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                    <View className='absolute left-2'>
                      <Email />
                    </View>
                    <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-600'} rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
                        onChangeText={setEmail}
                        onFocus={()=>{setFocus('email')}}
                        onBlur={()=>{setFocus('')}}
                        // maxLength={10}
                        // keyboardType="number-pad"
                        placeholder='Email address'
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                      />
                  </View>
                
                  <View className={`w-full flex-row items-center relative border ${(focus=='password')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                    <View className='absolute left-2'>
                      <Locked />
                    </View>
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-600'} rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
                      onChangeText={setPassword}
                      onFocus={()=>{setFocus('password')}}
                      onBlur={()=>{setFocus('')}}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Password'
                      placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                    className='absolute right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={18}
                        color={(theme == 'dark')? '#fff':'#4b5563'}
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
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-600'} rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
                      onChangeText={setPassword2}
                      onFocus={()=>{setFocus('password2')}}
                      onBlur={()=>{setFocus('')}}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Confirm Password'
                      placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                    className='absolute right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={18}
                        color={(theme == 'dark')? '#fff':'#4b5563'}
                        style={{ padding: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                
            </View>
             

            {/* <Link 
            href="/vendor/forgot_password?service=vendor" 
            style={{fontFamily: 'Inter-Medium'}} 
            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px] ml-auto mr-5 mb-10`}>
               Forget Password?
            </Link>  */}

            <Text
              style={{fontFamily: 'Inter-Medium'}}
              className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-center text-[12px] mt-auto`}
              >
                Already have an account? <Link href="/rider/login" style={{fontFamily: 'Inter-Bold'}} className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'}`}>Sign In</Link> 
              </Text>

            <View className='w-[90%] mx-auto'>
              <TouchableOpacity
              onPress={handleRegistration}
              className={`text-center ${(validateInput())? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 mb-10 flex items-center justify-around`}
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
                  Create
                </Text>
                    
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    )
}