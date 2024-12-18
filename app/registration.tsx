import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, TouchableWithoutFeedback, Platform, Alert, Image, TextInput, ScrollView  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Registration(){
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const validateInput = () =>{
      if(email.includes(".com") && (password.length>5) && (password2.length>5) && (password.trim() == password2.trim())){
        return true;
      }
      return false;
    }
    type DataResponse = { id: number;};
    type ApiResponse = { status: string; message: string; data:DataResponse };
    const [data, setData] = useState<ApiResponse>(); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleRegistration = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          const res = await postRequest<ApiResponse>(ENDPOINTS['buyer']['signup'], {
            email: email,
            password: password,
            password2: password2,
          }, false);
          setLoading(false)
          setData(res); // Display or use response data as needed
          // alert(JSON.stringify(res))
          Toast.show({
            type: 'success',
            text1: "Otp Sent",
            text2: res.message,
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
          await Delay(3000)

          router.push({
            pathname: '/enter_code',
            params: { email: email.toLowerCase(), id: res.data.id},
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
            <View className='mx-auto'>
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
                  
                  <View className="w-full flex-row items-center relative rounded-lg">
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`bg-gray-100 rounded-xl p-3 text-[13px] w-full`}
                      onChangeText={setPassword2}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Confirm Password'
                      placeholderTextColor="black"
                      secureTextEntry={!showPassword2}
                    />
                    <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}
                    className='absolute inset-y-2 right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword2 ? 'eye-slash' : 'eye'}
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
                Already have an account? <Link href="/login" className='text-gray-800'>Signin</Link> 
              </Text>
            

            <View className='w-[90%] mx-auto mt-auto'>
              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-center text-[9px] text-gray-500 tracking-tighter'
              >
                By continuing you agree to our <Text className='text-custom-green'>Terms and condition</Text> and the <Text className='text-custom-green'>privacy policy.</Text> 
              </Text>

              <TouchableOpacity
              // onPress={()=>{router.push("/enter_code")}}
              onPress={handleRegistration}
              className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 mb-10 flex items-center justify-around`}
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
                  Continue
                </Text>
                    
              </TouchableOpacity>
              
            </View>
          </ScrollView>
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    )
}