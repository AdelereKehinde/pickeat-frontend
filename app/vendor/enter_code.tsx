import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Link } from "expo-router";
import TitleTag from '@/components/Title';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import Email from '../../assets/icon/mail2.svg';
import Logo from '../../assets/images/Logo.svg';
import { getRequest } from '@/api/RequestHandler';

export default function VendorEnterCode(){
    const {email, id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    const [code, setCode] = useState(['', '', '', '']); // Store entered digits
    const [codeComplete, setCodeComplete] = useState(false)
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleSubmit = async () => {
      try {
        if(!loading){
            setLoading(true)
            type DataResponse = { token: string; refresh: string; };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await getRequest<ApiResponse>(`${ENDPOINTS['vendor']['verify']}verify/${id}/${code.join('')}`);
            // alert(JSON.stringify(res))
            setLoading(false)

          Toast.show({
            type: 'success',
            text1: "Email Verified",
            // text2: res.data['message'],
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
          
          await Delay(2000)

          router.push({
            pathname: '/vendor/login',
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


    
    // Refs for each input to control focus
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleFocus = (index: number) => {
        setFocusedIndex(index); // Update the focused index
    };
    
    const handleBlur = () => {
        setFocusedIndex(null); // Reset the focused index
    };

    // Handle the change in input
    const handleChangeText = (text: string, index: number) => {
        if (text.length === 1) {
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);

            // Focus on the next input if it's not the last one
            if (index < 3 && text) {
                inputRefs[index + 1].current?.focus();
            }
        } else if (text === '') {
            // If input is empty, move focus to the previous one
            if (index >= 0) {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
                if (index !== 0){
                    inputRefs[index - 1].current?.focus();
                }
            }
        }
        if(index == 3){
            setCodeComplete(true)
        }else{
            setCodeComplete(false)
        }
    };

    // Handle the key press for backspace navigation
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && code[index] === '') {
            // Move to previous input if backspace is pressed on an empty field
            if (index > 0) {
                inputRefs[index - 1].current?.focus();
            }
        }
    };

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />

            <Toast config={toastConfig} />

            <View className='mt-5'>
              <Logo width={120} height={120} />
            </View>

            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green '
            >
              PickEAT PickIT
            </Text>

            <View
            className='mx-7 mt-10 w-full'
            >
                <Text
                style={{fontFamily: 'Inter-Bold'}}
                className={`pl-3 text-[17px] w-full text-gray-800`}
                >
                    Enter Pin
                </Text>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`pl-3 text-[11px] w-full text-gray-500`}
                >
                    To continue, kindly enter the pin sent to your email address
                </Text>
            </View>
            
            <View className={`flex-row items-center border border-custom-green rounded-md mx-7 mt-5 p-4`}>
                <View className=''>
                    <Email />
                </View>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`pl-3 text-[13px] w-full text-custom-green`}
                >
                    {email}
                </Text>
            </View>

            <View className='w-full'>
                <View className="flex-row justify-center mt-16 space-x-3">
                    {code.map((digit, index) => (
                        <TextInput
                        key={index}
                        ref={inputRefs[index]}
                        className={`w-12 h-12 text-center text-[18px] border-b-2  ${(focusedIndex === index)? (' border-custom-green'):('border-gray-700')}`}
                        value={digit}
                        onFocus={() => handleFocus(index)} // Handle focus event
                        onBlur={handleBlur} // Handle blur event
                        onChangeText={(text) => handleChangeText(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        autoFocus={index === 0} // Autofocus the first input
                        />
                    ))}
                </View>

                <Text
                style={{fontFamily: 'Inter-Regular'}}
                className='text-center text-[11px] text-gray-500 tracking-tighter mt-4'
                >
                    Enter the Four Digit code sent {'\n'}
                    to your email
                </Text>
                

                <TouchableOpacity
                onPress={handleSubmit}
                className={`text-center mt-10 ${(codeComplete || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
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
                    Done
                    </Text>
                        
                </TouchableOpacity>

            </View>
            
        </View>
    )
}