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
import Email from '../../assets/icon/mail2.svg';
import Logo from '../../assets/images/Logo.svg';
import { getRequest, postRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { FontAwesome } from '@expo/vector-icons';

interface Properties {
    with_otp: boolean,
    getValue: (value: boolean, pin: string) => void
}

const TransactionPinPrompt: React.FC<Properties> = ({with_otp=false, getValue}) => {
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
        if(!loading && codeComplete){
            setLoading(true)
            type ApiResponse = { status: string; message: string; data:{} };
            const res = await postRequest<ApiResponse>(`${ENDPOINTS['account']['match-transaction-pin']}`, {
                'pin': code.join(''),
                'with_otp': with_otp
            }, true);
            getValue(true, code.join(''))
            setLoading(false)
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: error.data?.message || 'Unknown Error',
          visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
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
        <View className={`w-full h-full flex items-center absolute z-50`} style={{backgroundColor: '#00000080'}}>
            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-[90%] my-auto pb-10 px-3 rounded-lg`}>
                <TouchableOpacity
                onPress={()=>{if(!loading){getValue(false, '')}; }}
                className='ml-auto mb-5 mt-2'>
                    <FontAwesome 
                    name="times" 
                    size={20} 
                    color={theme === 'dark' ? '#fff' : '#4b5563'}
                    style={{ padding: 2 }}
                    />
                </TouchableOpacity>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} text-[14px] mx-auto`}
                >
                    Kindly enter your transaction pin
                </Text>

                <View className='w-full'>
                    <View className="flex-row justify-center mt-5 space-x-3">
                        {code.map((digit, index) => (
                            <TextInput
                            key={index}
                            ref={inputRefs[index]}
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} w-12 h-12 text-center text-[16px] border rounded-md  ${(focusedIndex === index)? (' border-custom-green'):('border-gray-500')}`}
                            value={digit}
                            onFocus={() => handleFocus(index)} // Handle focus event
                            onBlur={handleBlur} // Handle blur event
                            onChangeText={(text) => handleChangeText(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            secureTextEntry={true}
                            maxLength={1}
                            autoFocus={index === 0} // Autofocus the first input
                            />
                        ))}
                    </View>
                    

                    <TouchableOpacity
                    onPress={handleSubmit}
                    className={`text-center mt-10 ${(codeComplete || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-2 w-[90%] self-center flex items-center justify-around`}
                    >
                        {loading && (
                        <View className='absolute w-full top-2'>
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
            <Toast config={toastConfig} />
        </View>
    )
}

export default TransactionPinPrompt;