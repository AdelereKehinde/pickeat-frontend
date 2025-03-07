import React, { useState, useContext, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Link } from "expo-router";
import TitleTag from '@/components/Title';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';
import { getRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function EnterCode(){
    const { theme, toggleTheme } = useContext(ThemeContext);
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
          type DataResponse = { token:string; refresh: string};
          type ApiResponse = { status: string; message: string; data:DataResponse };
          const res = await getRequest<ApiResponse>(`${ENDPOINTS['buyer']['verify']}verify/${id}/${code.join('')}`, false);
        //   alert(JSON.stringify(res))
          setLoading(false)
        //   setData(res.data); // Display or use response data as needed

          Toast.show({
            type: 'success',
            text1: "Email Verified",
            // text2: res.data['message'],
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
          await AsyncStorage.setItem('token', res.data.token);
          await AsyncStorage.setItem('refresh', res.data.refresh);

          await Delay(2000)

          router.replace({
            pathname: '/complete_profile',
          }); 
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: "An error occured",
          text2: error.data?.status?.message || "Unknown Error",
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.data?.status?.message || "Unknown Error"); // Set error message
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
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Enter code' withbell={false}/>
                </View>
                
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    
                        <View className="flex-row justify-center mt-36 space-x-3">
                            {code.map((digit, index) => (
                                <TextInput
                                key={index}
                                ref={inputRefs[index]}
                                style={{fontFamily: 'Inter-Regular'}}
                                className={`${theme == 'dark'? 'bg-gray-700 text-gray-100' : ' bg-gray-100 text-gray-900'} w-12 h-12 text-center text-[16px] rounded-md  ${(focusedIndex === index) && ('border border-custom-green')}`}
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
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-center text-[11px] tracking-tighter mt-14`}
                        >
                            Enter the four digit code sent to {'\n'} {email}
                        </Text>

                        <TouchableOpacity
                        onPress={handleSubmit}
                        className={`text-center ${(codeComplete)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${(loading) && 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[90%] self-center mt-auto flex items-center justify-around mb-10`}
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

                    
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}