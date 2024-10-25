import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';


export default function EnterCode(){
    const {country_code, phone_number} = useGlobalSearchParams()
 
    const [code, setCode] = useState(['', '', '', '']); // Store entered digits
    const [codeComplete, setCodeComplete] = useState(false)
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
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag href='/registration' title='Enter code'/>
            
            <View className='w-full'>
                <View className="flex-row justify-center mt-36 space-x-3">
                    {code.map((digit, index) => (
                        <TextInput
                        key={index}
                        ref={inputRefs[index]}
                        className={`w-12 h-12 text-center text-[18px] rounded-md bg-gray-100  ${(focusedIndex === index) && ('border border-custom-green')}`}
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
                className='text-center text-[11px] text-gray-500 tracking-tighter mt-14'
                >
                    Enter the four digit code sent to {'\n'} {country_code}{phone_number}
                </Text>

                <TouchableOpacity
                onPress={()=>{codeComplete? router.replace('/complete_profile'):''}}
                className={`text-center ${codeComplete? 'bg-custom-green' : 'bg-custom-inactive-green'} rounded-xl p-4 w-[85%] mt-80 self-center `}
                >
                    <Text
                    style={{fontFamily: 'Inter-Regular'}}
                    className='text-white m-auto'
                    >
                        Continue
                    </Text>
                </TouchableOpacity>

            </View>
            
        </View>
    )
}