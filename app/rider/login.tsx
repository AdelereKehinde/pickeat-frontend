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
import validatePassword from '@/constants/passwordValidator';
import validateEmail from '@/constants/emailValidator';
import ConnectionModal from '@/components/ConnectionModal';


export default function RiderLogin(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();

    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };

    const deviceName = Device.modelName; // e.g., "iPhone 12"
    const deviceType = Device.deviceType === 1 ? "Mobile" : "Desktop";

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false)

    const [pswdValidation, setPswdValidation] = useState({
      isValid: true,
      errors: [] as string[],
    });
    const [emailValidation, setEmailValidation] = useState({
      isValid: true,
      errors: [] as string[],
    });

    const handlePasswordChange = (pswd: string) => {
      setPassword(pswd);
  
      // Validate the new password and update validation state
      const validationResult = validatePassword(pswd);
      setPswdValidation(validationResult);
    };

    const handleEmailChange = (email: string) => {
      setEmail(email);
  
      // Validate the new password and update validation state
      const validationResult = validateEmail(email);
      setEmailValidation(validationResult);
    };

    const validateInput = () =>{
      if(emailValidation.isValid && (email.length != 0) && (pswdValidation.isValid) && (password.length != 0)){
        return true;
      }
      return false;
    }

    const [focus, setFocus] = useState('')
    const [data, setData] = useState({}); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleLogin = async () => {
      try {
        if(!loading && validateInput()){
          setLoading(true)
          type DataResponse = { 
            message: string; 
            token:string; 
            refresh: string; 
            email:string; 
            avatar:string; 
            first_name:string; 
            last_name:string; 
            phone_number:string; 
            set_availability:boolean; 
            set_identity: boolean; 
            set_profile_1: boolean;
            set_profile_2: boolean;
            set_profile_3: boolean;
            active_status: boolean;
            set_pin: boolean;
          };
          type ApiResponse = { status: string; message: string; data:DataResponse };
          const res = await postRequest<ApiResponse>(ENDPOINTS['rider']['signin'], {
            email: email,
            password: password,
            device_name: deviceName,
            device_type: deviceType,
          }, true);

          await AsyncStorage.setItem('token', res.data.token);
          await AsyncStorage.setItem('refresh', res.data.refresh);
          await AsyncStorage.setItem('service', 'rider');
          await AsyncStorage.setItem('rider_active_status', `${res.data.active_status}`);
          
          setLoading(false)
          setUser({
            email: res.data.email,
            phone_number:  res.data.phone_number,
            avatar: res.data.avatar,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            full_name: "",
            store_name: ""
          })
          setData(res); // Display or use response data as needed
          // alert(JSON.stringify(res))
          Toast.show({
            type: 'success',
            text1: "Welcome back",
            visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });  

          await Delay(1500)
          router.push({
            pathname: res.data.set_profile_1? res.data.set_identity? res.data.set_profile_2? res.data.set_profile_3? res.data.set_availability? res.data.set_pin? '/rider/(tabs)/home' : '/rider/transaction_pin' : '/rider/availability' : '/rider/create_profile_3' : '/rider/create_profile_2' : '/rider/identity_verification' : '/rider/create_profile'
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
        <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
        
        {/* Page requires intermet connection */}
        <ConnectionModal />
        {/* Page requires intermet connection */}

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
                    Login Information
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} pl-3 text-[11px] w-full`}
                >
                    To continue, kindly provide the following details
                </Text>
            </View>

            <View className='flex flex-row justify-around items-center w-full p-5 space-x-3 mt-5'>
                <View className='grow space-y-2'>
                <View className={`w-full flex-row items-center relative border ${(focus=='email')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                        <View className='absolute left-2'>
                          <Email />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-600'} rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
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
                
                  <View className={`w-full flex-row items-center relative border ${(focus=='password')? 'border-custom-green':'border-gray-300'}  rounded-md`}>
                    <View className='absolute left-2'>
                      <Locked />
                    </View>
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-600'} rounded-xl p-3 py-2 pl-10 text-[13px] w-full`}
                      onChangeText={handlePasswordChange}
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
                  {/* Display validation error messages */}
                  {!(pswdValidation.isValid) && (
                    <View className='mt-2 ml-2'>
                      {pswdValidation.errors.map((error, index) => (
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

            <Link 
            href="/vendor/forgot_password?service=rider" 
            style={{fontFamily: 'Inter-Medium'}} 
            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px] ml-auto mr-5 mb-10`}>
               Forget Password?
            </Link> 

            <Text
              style={{fontFamily: 'Inter-Medium'}}
              className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-center text-[12px] mt-auto`}
              >
                Don't have an account? <Link href="/rider/signup" style={{fontFamily: 'Inter-Bold'}} className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'}`}>Sign Up</Link> 
              </Text>

            <View className='w-[90%] mx-auto'>
              <TouchableOpacity
              onPress={handleLogin}
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