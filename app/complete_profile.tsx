import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import GetToken from '@/constants/FetchToken';
import Delay from '@/constants/Delay';

import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';
import CharField from '@/components/CharField';
import PhoneNumber from '@/components/NumberField';



export default function CompleteProfile(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const ValidateFormContent = ():boolean =>{
        if((firstName !== '') && (lastName !== '') && (phoneNumber !== '')){
            return true
        }
        return false
    }

    const handleSubmit = async () => {
        try {
          if(!loading && ValidateFormContent()){
            //Activate the Activity indication
            setLoading(true)
            //Fetch token
            const token = (await AsyncStorage.getItem('token'))?.trim();
            //Send request
            const res = await axios.patch(ENDPOINTS['buyer']['user-data'], {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });
            //Activate the Activity indication
            setLoading(false)
            // Display or use response data as needed
            setData(res.data); 
           
            Toast.show({
              type: 'success',
              text1: "Details Updated",
              // text2: res.data['message'],
              visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
  
            await Delay(1000)
  
            router.push({
              pathname: '/complete_profile_2',
            }); 
          }
  
        } catch (error:any) {
            // alert(JSON.stringify(error.response))
          if (error.response?.status === 401){
            router.push({
              pathname: '/login',
              params: { next: 'complete_profile' },
            });
          }else{
            setLoading(false)
            Toast.show({
              type: 'error',
              text1: "An error occured",
              text2: error.response?.data?.message || "Unknown Error",
              visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
            setError(error.response?.data?.message || "Unknown Error"); // Set error message
          }
        }
      };


    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={true} title='Complete profile' withbell={false}/>
            <Toast config={toastConfig} />
            <View className='w-full p-5'>
                <Text 
                style={{fontFamily: 'Inter-Regular'}}
                className='text-gray-400 text-[13px]'>
                    Let us know how to properly address you
                </Text>    

                <View className='mt-10 space-y-3'>
                    <View>
                      <CharField  placeholder="Enter first name" focus={true} border={false} name='First name' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                      <CharField  placeholder="Enter last name" focus={false} border={false} name='Last name' getValue={(value: string)=>setLastName(value)}/>
                    </View>
                    <View>
                      <PhoneNumber  placeholder="Enter Phone Number" focus={false} name='Phone Number' getValue={(value: string)=>setPhoneNumber(value)}/>
                    </View>
                </View>
                
                <TouchableOpacity
                onPress={handleSubmit}
                className={`text-center ${(ValidateFormContent() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[85%] self-center mt-72 flex items-center justify-around`}
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
        </View>
    )
}