import React, { useState, useEffect, useContext } from 'react';
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
import * as Device from "expo-device";
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import validatePassword from '@/constants/passwordValidator';
import validateEmail from '@/constants/emailValidator';
import ConnectionModal from '@/components/ConnectionModal';

export default function Registration(){
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

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

    const deviceName = Device.modelName; // e.g., "iPhone 12"
    const deviceType = Device.deviceType === 1 ? "Mobile" : "Desktop";
    const validateInput = () =>{
      if(emailValidation.isValid && (email.length != 0) && (pswdValidation.isValid) && (password.trim() == password2.trim())){
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
            device_name: deviceName,
            device_type: deviceType,
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
          text1: error.data?.message || "An error occured",
          // text2: error.data?.data?.message || 'Unknown Error',
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
          {/* Page requires intermet connection */}
          <ConnectionModal />
          {/* Page requires intermet connection */}

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
                <View className='grow'>
                  <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'bg-gray-800 text-gray-200' : ' bg-gray-100 text-gray-700'} rounded-xl p-3 text-[13px]`}
                    onChangeText={handleEmailChange}
                    // maxLength={10}
                    // keyboardType="number-pad"
                    placeholder='Email address'
                    placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                  />

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

                  <View className="w-full flex-row items-center relative rounded-lg mt-2">
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`${theme == 'dark'? 'bg-gray-800 text-gray-200' : ' bg-gray-100 text-gray-700'}  rounded-xl p-3 text-[13px] w-full`}
                      onChangeText={handlePasswordChange}
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
                        size={20}
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
                  
                  <View className="w-full flex-row items-center relative rounded-lg mt-2">
                    <TextInput
                      style={{fontFamily: 'Inter-Medium'}}
                      className={`${theme == 'dark'? 'bg-gray-800 text-gray-200' : ' bg-gray-100 text-gray-700'} rounded-xl p-3 text-[13px] w-full`}
                      onChangeText={setPassword2}
                      // maxLength={10}
                      // keyboardType="number-pad"
                      placeholder='Confirm Password'
                      placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                      secureTextEntry={!showPassword2}
                    />
                    <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}
                    className='absolute right-2 my-auto'
                    >
                      <FontAwesome
                        name={showPassword2 ? 'eye-slash' : 'eye'}
                        size={20}
                        color={(theme == 'dark')? '#fff':'#4b5563'}
                        style={{ padding: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                  {(password != password2) && (
                    <Text
                      style={{fontFamily: 'Inter-Regular'}}
                      className={`${theme == 'dark'? 'text-gray-100' : 'text-red-500'} text-[10px] ml-2`}>
                        password does not match
                      </Text>
                  )}

                </View>
            </View> 

            
              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-center text-[12px] pt-2`}
              >
                Already have an account? <Link href="/login" className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'}`}>Sign In</Link> 
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