import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import TitleTag from '@/components/Title';
import Search from '../assets/icon/search.svg';
import LocationPicker from '@/components/LocationPicker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import Map from '../assets/icon/map.svg';
import Delay from '@/constants/Delay';
import * as Location from 'expo-location';



export default function CompleteProfile2(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    const [showMap, setShowMap] = useState(false)

    const [address, setAddress] = useState('')
    const [lat, setLat] = useState<number>(0)
    const [long, setLong] = useState<number>(0)

    const [data, setData] = useState(null); // To store the API data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 

    const ValidateFormContent = ():boolean =>{
        if((address !== '') && ((lat !== 0) && (long !== 0))){
            return true
        }
        return false
    }
    const [isFocused, setIsFocus] = useState(false);
    
    // This function will be called when a location is selected in LocationPicker
    const handleLocationSelected = async (location: { latitude: number; longitude: number }) => {
        // Send the selected location to your backend
        setLat(location.latitude)
        setLong(location.longitude)
    };

    const handleSubmit = async () => {
        try {
          if(!loading && ValidateFormContent()){
            //Activate the Activity indication
            setLoading(true)
            //Fetch token
            const token = (await AsyncStorage.getItem('token'))?.trim();
            //Send request
            const res = await axios.post(ENDPOINTS['create-address'], {
                latitude: lat,
                longitude: long,
                address: address,
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
              text1: "Address Created",
              // text2: res.data['message'],
              visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
  
            await Delay(1000)
  
            router.push({
              pathname: '/dashboard',
            }); 
          }
  
        } catch (error:any) {
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
      };

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={true} title='Complete profile' withbell={false}/>

            <Toast config={toastConfig} />

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

            <View className='flex flex-row items-center w-[90%] px-5 my-4 border-b border-gray-400 py-2'>
                <View>
                    <Map />
                </View>
                <Pressable
                onPress={()=>{setShowMap(!showMap)}}
                className='ml-4'
                >
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-custom-green m-auto text-[12px]'
                    >
                        {showMap? 'Hide map':'Choose from map'}
                    </Text>
                </Pressable>
            </View>

            {showMap && (
                <View className='w-[90%] h-[400px]'>
                    <LocationPicker getAddress={(value: string)=>setAddress(value)} onLocationSelected={handleLocationSelected}/>
                </View>
            )}

            <TouchableOpacity
            onPress={handleSubmit}
            className={`text-center ${(ValidateFormContent() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[85%] self-center mt-auto mb-8 flex items-center justify-around`}
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
                Select
                </Text>     
            </TouchableOpacity>
        </View>
    )
}