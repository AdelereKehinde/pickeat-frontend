import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';
import CharField from '@/components/CharField';


export default function CompleteProfile(){
    const {country_code, phone_number} = useGlobalSearchParams()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    const ValidateFormContent = ():boolean =>{
        if((firstName !== '') && (lastName !== '') && (email !== '')){
            return true
        }
        return false
    }

    const [code, setCode] = useState(['', '', '', '']); // Store entered digits

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag href='/registration' title='Complete profile'/>
            
            <View className='w-full p-5'>
                <Text 
                style={{fontFamily: 'Inter-Regular'}}
                className='text-gray-400 text-[13px]'>
                    Let us know how to properly address you
                </Text>    

                <View className='mt-10'>
                    <CharField  placeholder="Enter first name" focus={true} name='First name' getValue={(value: string)=>setFirstName(value)}/>
                    <CharField  placeholder="Enter last name" focus={false} name='Last name' getValue={(value: string)=>setLastName(value)}/>
                    <CharField  placeholder="Enter last name" focus={false} name='Last name' getValue={(value: string)=>setEmail(value)}/>
                </View>
                
                <Link
                href={ValidateFormContent()? '/complete_profile_2':'/complete_profile'}
                className={`text-center ${ValidateFormContent()? 'bg-custom-green' : 'bg-custom-inactive-green'} rounded-xl p-4 w-[85%] mt-72 self-center `}
                >
                    <Text
                    style={{fontFamily: 'Inter-Regular'}}
                    className='text-white m-auto'
                    >
                        Continue
                    </Text>
                </Link>

            </View>
        </View>
    )
}