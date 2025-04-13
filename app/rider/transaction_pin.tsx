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
import { getRequest, patchRequest, postRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ConnectionModal from '@/components/ConnectionModal';

export default function TransactionPin(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {email, id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    const [newPin, setNewPin] = useState(['', '', '', '']); // Store entered digits
    const [newPinComplete, setNewPinComplete] = useState(false)
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']); // Store entered digits
    const [confirmPinComplete, setConfirmPinComplete] = useState(false)
    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const handleSubmit = async () => {
      try {
        if(!loading && newPinComplete && confirmPinComplete){
            if(newPin.join('') == confirmPin.join('')){
                    setLoading(true)
                    type DataResponse = { token: string; refresh: string; };
                    type ApiResponse = { status: string; message: string; data:DataResponse };
                    const res = await postRequest<ApiResponse>(ENDPOINTS['account']['transaction-pin'], {
                        pin: newPin.join(''), 
                    }, true);
                    // alert(JSON.stringify(res))
                    setLoading(false)

                    Toast.show({
                        type: 'success',
                        text1: "Transaction pin created successfully",
                        // text2: res.data['message'],
                        visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                        autoHide: true,
                    });
                    await Delay(1500)
                    router.replace({
                        pathname: '/rider/all_set',
                    });  
            }else{
                Toast.show({
                    type: 'error',
                    text1: "Your new pin does not match",
                    // text2: error.data?.message || 'Unknown Error',
                    visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            }
        }

      } catch (error:any) {
        setLoading(false)
        // alert(JSON.stringify(error))
        Toast.show({
          type: 'error',
          text1: error.data?.message || 'Error resetting pin',
        //   text2: error.data?.message || 'Unknown Error',
          visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        setError(error.data?.message || 'Unknown Error'); // Set error message
      }
    };

    // Refs for each input to control focus
    const newInputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const confirmInputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const [newFocusedIndex, setNewFocusedIndex] = useState<number | null>(null);
    const [confirFocusedIndex, setConfirmFocusedIndex] = useState<number | null>(null);

    const handleFocus = (index: number, which: string) => {
        switch (which) {
            case 'new':
                setNewFocusedIndex(index); // Update the focused index
                break;
            case 'confirm':
                setConfirmFocusedIndex(index); // Update the focused index
                break;
            default:
                break;
        }
    };
    
    const handleBlur = (which: string) => {
        switch (which) {
            case 'new':
                setNewFocusedIndex(null); // Update the focused index
                break;
            case 'confirm':
                setConfirmFocusedIndex(null); // Update the focused index
                break;
            default:
                break;
        }
    };


    // Handle the change in input
    const handleNewChangeText = (text: string, index: number) => {
        if (text.length === 1) {
            const newCode = [...newPin];
            newCode[index] = text;
            setNewPin(newCode);

            // Focus on the next input if it's not the last one
            if (index < 3 && text) {
                newInputRefs[index + 1].current?.focus();
            }
        } else if (text === '') {
            // If input is empty, move focus to the previous one
            if (index >= 0) {
                const newCode = [...newPin];
                newCode[index] = '';
                setNewPin(newCode);
                if (index !== 0){
                    newInputRefs[index - 1].current?.focus();
                }
            }
        }
        if(index == 3){
            setNewPinComplete(true)
        }else{
            setNewPinComplete(false)
        }
    };

    // Handle the key press for backspace navigation
    const handleNewKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && newPin[index] === '') {
            // Move to previous input if backspace is pressed on an empty field
            if (index > 0) {
                newInputRefs[index - 1].current?.focus();
            }
        }
    };

    // Handle the change in input
    const handleConfirmChangeText = (text: string, index: number) => {
        if (text.length === 1) {
            const newCode = [...confirmPin];
            newCode[index] = text;
            setConfirmPin(newCode);

            // Focus on the next input if it's not the last one
            if (index < 3 && text) {
                confirmInputRefs[index + 1].current?.focus();
            }
        } else if (text === '') {
            // If input is empty, move focus to the previous one
            if (index >= 0) {
                const newCode = [...confirmPin];
                newCode[index] = '';
                setConfirmPin(newCode);
                if (index !== 0){
                    confirmInputRefs[index - 1].current?.focus();
                }
            }
        }
        if(index == 3){
            setConfirmPinComplete(true)
        }else{
            setConfirmPinComplete(false)
        }
    };

    // Handle the key press for backspace navigation
    const handleConfirmKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && confirmPin[index] === '') {
            // Move to previous input if backspace is pressed on an empty field
            if (index > 0) {
                confirmInputRefs[index - 1].current?.focus();
            }
        }
    };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
            <TitleTag withprevious={false} title='Set Transaction Pin' withbell={false} />
        
        {/* Page requires intermet connection */}
        <ConnectionModal />
        {/* Page requires intermet connection */}
        
        </View>
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>

                <View className='w-full mt-8'>
                    {/* <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-center text-[13px] tracking-tighter mt-4`}
                    >
                        The Transaction pin will be used {'\n'} for withdrawals
                    </Text>  */}
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-center text-[13px] tracking-tighter mt-8`}
                    >
                        Transaction Pin
                    </Text>
                    <View className="flex-row justify-center mt-2 space-x-3">
                        {newPin.map((digit, index) => (
                            <TextInput
                            key={index}
                            ref={newInputRefs[index]}
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} w-12 h-12 text-center text-[16px] border-2 rounded-md  ${(newFocusedIndex === index)? (' border-custom-green'):('border-gray-500')}`}
                            value={digit}
                            onFocus={() => handleFocus(index, 'new')} // Handle focus event
                            onBlur={()=>{handleBlur('new')}} // Handle blur event
                            onChangeText={(text) => handleNewChangeText(text, index)}
                            onKeyPress={(e) => handleNewKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry={true}
                            // autoFocus={index === 0} // Autofocus the first input
                            />
                        ))}
                    </View>

                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-700'} text-center text-[13px] tracking-tighter mt-8`}
                    >
                        Confirm Pin
                    </Text>
                    <View className="flex-row justify-center mt-2 space-x-3">
                        {confirmPin.map((digit, index) => (
                            <TextInput
                            key={index}
                            ref={confirmInputRefs[index]}
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} w-12 h-12 text-center text-[16px] border-2 rounded-md  ${(confirFocusedIndex === index)? (' border-custom-green'):('border-gray-500')}`}
                            value={digit}
                            onFocus={() => handleFocus(index, 'confirm')} // Handle focus event
                            onBlur={()=>{handleBlur('confirm')}} // Handle blur event
                            onChangeText={(text) => handleConfirmChangeText(text, index)}
                            onKeyPress={(e) => handleConfirmKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry={true}
                            // autoFocus={index === 0} // Autofocus the first input
                            />
                        ))}
                    </View>

                </View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className={`text-center mt-auto mb-10 ${(newPinComplete && confirmPinComplete )? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
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
                        Set pin
                        </Text>
                            
                    </TouchableOpacity>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}