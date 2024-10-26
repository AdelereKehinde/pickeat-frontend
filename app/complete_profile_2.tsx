import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';
import Search from '../assets/icon/search.svg';


export default function CompleteProfile2(){
    const {country_code, phone_number} = useGlobalSearchParams()

    const [address, setAddress] = useState('')

    const ValidateFormContent = ():boolean =>{
        if((address !== '')){
            return true
        }
        return false
    }
    const [isFocused, setIsFocus] = useState(false);

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <TitleTag title='Complete profile' withbell={false}/>

            <View className='mt-5 w-full px-4 relative flex flex-row items-center justify-center'>
                <View className='absolute left-6 z-10'>
                    <Search />
                </View>
                <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[14px]`}
                    autoFocus={false}
                    onFocus={()=>setIsFocus(true)}
                    onBlur={()=>setIsFocus(false)}
                    onChangeText={setAddress}
                    defaultValue={address}
                    placeholder="Enter a new address"
                    placeholderTextColor=""
                />
            </View>
            <View className='w-full p-5'> 
                
                <Link
                href={ValidateFormContent()? '/dashboard':'/complete_profile_2'}
                className={`text-center ${ValidateFormContent()? 'bg-custom-green' : 'bg-custom-inactive-green'} rounded-xl p-4 w-[85%] mt-72 self-center `}
                >
                    <Text
                    style={{fontFamily: 'Inter-Regular'}}
                    className='text-white m-auto'
                    >
                        Select
                    </Text>
                </Link>

            </View>
        </View>
    )
}