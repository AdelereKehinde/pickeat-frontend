import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ActivityIndicator, Platform, Alert, Image, TextInput, Pressable, ScrollView  } from "react-native";
import { Link, router } from "expo-router";
import Checkbox from '../../assets/icon/checkbox.svg';
import TitleTag from '@/components/Title';
import CharFieldDropDown from '@/components/CharFieldDropdown';
import { postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Delay from '@/constants/Delay';

export default function AccountSetup3(){
    const toastConfig = {
      success: CustomToast,
      error: CustomToast,
  };
  const [openState, setOpenState] = useState({available_from:false, available_to:false, available_on_holiday: false, time_start: false, time_end: false, no_of_worker: false, terms: false})
  const [data, setData] = useState({available_from:"", time_end:"", available_on_holiday: false, time_start: '', available_to: "", no_of_worker: 0, terms: false});
  const dropdown = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednessday', value: 'wednessday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday ', value: 'sunday' },
  ]

  const availability = [
    { label: "Yes, I'm available", value: 'true' },
    { label: "No, I'm not available", value: 'false' },
  ]

  const time_start = [
    { label: "05:00 am", value: '05:00 am' },
    { label: "06:00 am", value: '06:00 am' },
    { label: "07:00 am", value: '07:00 am' },
    { label: "08:00 am", value: '08:00 am' },
    { label: "09:00 am", value: '09:00 am' },
    { label: "10:00 am", value: '10:00 am' },
    { label: "11:00 am", value: '11:00 am' },
    { label: "12:00 pm", value: '12:00 pm' },
    { label: "01:00 pm", value: '01:00 pm' },
    { label: "02:00 pm", value: '02:00 pm' },
    { label: "03:00 pm", value: '03:00 pm' },
    { label: "04:00 pm", value: '04:00 pm' },
    { label: "05:00 pm", value: '05:00 pm' },
    { label: "06:00 pm", value: '06:00 pm' },
    { label: "07:00 pm", value: '07:00 pm' },
    { label: "08:00 pm", value: '08:00 pm' },
    { label: "09:00 pm", value: '09:00 pm' },
    { label: "10:00 pm", value: '10:00 pm' },
    { label: "11:00 pm", value: '11:00 pm' },
  ]

  const time_end = [
    { label: "05:00 am", value: '05:00 am' },
    { label: "06:00 am", value: '06:00 am' },
    { label: "07:00 am", value: '07:00 am' },
    { label: "08:00 am", value: '08:00 am' },
    { label: "09:00 am", value: '09:00 am' },
    { label: "10:00 am", value: '10:00 am' },
    { label: "11:00 am", value: '11:00 am' },
    { label: "12:00 pm", value: '12:00 pm' },
    { label: "01:00 pm", value: '01:00 pm' },
    { label: "02:00 pm", value: '02:00 pm' },
    { label: "03:00 pm", value: '03:00 pm' },
    { label: "04:00 pm", value: '04:00 pm' },
    { label: "05:00 pm", value: '05:00 pm' },
    { label: "06:00 pm", value: '06:00 pm' },
    { label: "07:00 pm", value: '07:00 pm' },
    { label: "08:00 pm", value: '08:00 pm' },
    { label: "09:00 pm", value: '09:00 pm' },
    { label: "10:00 pm", value: '10:00 pm' },
    { label: "11:00 pm", value: '11:00 pm' },
  ]
  
  const workers = [
    { label: '2 people', value: '2' },
    { label: '3 people', value: '3' },
    { label: '4 people', value: '4' },
    { label: '5 people', value: '5' },
    { label: '6 people', value: '6' },
    { label: '7 people', value: '7' },
    { label: '8 people ', value: '8' },
    { label: 'more than 8 people ', value: '9' },
  ]

  const validateInput = () =>{
    if((data.available_to !== '') && (data.available_on_holiday !== false) && (data.no_of_worker !== 0) && (data.available_from !== '') && (data.terms !== false) && (data.time_end !== '') && (data.time_start !== '')){
      return true;
    }
    return false; 
  }

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state 

  const handleRequest = async () => {
    if(!loading && validateInput()){
        try {
            setLoading(true)
            const updatedProfile = await postRequest(ENDPOINTS['vendor']['availability'], data, true);
            setLoading(false)
            Toast.show({
                type: 'success',
                text1: "Profile Updated.",
                visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            await Delay(3000)
            router.replace({
                pathname: '/vendor/(tabs)/home',
            }); 
        
        } catch (error: any) {
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
    }
  };

    return (
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <TitleTag withprevious={true} title='Create Profile' withbell={false}/>
            
            <ScrollView className='w-full'>
              <View className='bg-custom-green p-2'>
                <View className='space-y-1'>
                  <View className='bg-white'>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, available_from: !openState.available_from}));}}
                    >
                      <CharFieldDropDown options={dropdown} open={openState.available_from}  placeholder="----------" focus={false} border={false} name='From' getValue={(value: string)=>{setData(prevState => ({...prevState, available_from: value,})); setOpenState(prevState => ({...prevState, available_from: false}))}}/>
                    </Pressable>
                  </View>
                  <View className='bg-white -z-20'>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, available_to: !openState.available_to}));}}
                    >
                      <CharFieldDropDown options={dropdown} open={openState.available_to}   placeholder="----------" focus={false} border={false} name='To' getValue={(value: string)=>{setData(prevState => ({...prevState, available_to: value,})); setOpenState(prevState => ({...prevState, available_to: false}))}}/>
                    </Pressable>
                  </View>
                </View>

                <View className='bg-white mt-3 -z-30'>
                  <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, available_on_holiday: !openState.available_on_holiday}));}}
                    >
                    <CharFieldDropDown options={availability} open={openState.available_on_holiday}   placeholder="----------" focus={false} border={false} name='Available during Holidays' getValue={(value: string)=>{setData(prevState => ({...prevState, available_on_holiday: eval(value),})); setOpenState(prevState => ({...prevState, available_on_holiday: false}))}}/>
                  </Pressable>
                </View>

                <View className='flex flex-row justify-between -mt-2'>
                  <View className='bg-white mt-3 w-[49%] -z-40'>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, time_start: !openState.time_start}));}}
                    >
                      <CharFieldDropDown options={time_start} open={openState.time_start}  placeholder="----------" focus={false} border={false} name='Time Start' getValue={(value: string)=>{setData(prevState => ({...prevState, time_start: value,})); setOpenState(prevState => ({...prevState, time_start: false}))}}/>
                    </Pressable>
                  </View>
                  <View className='bg-white mt-3 w-[49%] -z-40'>
                    <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, time_end: !openState.time_end}));}}
                    >
                      <CharFieldDropDown options={time_end} open={openState.time_end}  placeholder="----------" focus={false} border={false} name='Time End' getValue={(value: string)=>{setData(prevState => ({...prevState, time_end: value,})); setOpenState(prevState => ({...prevState, time_end: false}))}}/>
                    </Pressable>
                  </View>
                </View>

                <View className='bg-white mt-1 -z-50'>
                  <Pressable
                    className='w-full'
                    onPress={()=>{setOpenState(prevState => ({...prevState, no_of_worker: !openState.no_of_worker}));}}
                    >
                    <CharFieldDropDown options={workers} open={openState.no_of_worker}  placeholder="----------" focus={false} border={false} name='Total Number of Workers' getValue={(value: string)=>{setData(prevState => ({...prevState, no_of_worker: parseInt(value),})); setOpenState(prevState => ({...prevState, no_of_worker: false}))}}/>
                  </Pressable>
                </View>
                
              </View>

              <View className='flex flex-row mt-4 -z-10'>
                <Pressable
                onPress={()=>{setData(prevState => ({...prevState, terms: !openState.terms,})); setOpenState(prevState => ({...prevState, terms: !openState.terms}));}}
                className=''
                > 
                    <View className='flex flex-row mt-4 space-x-1'>
                      {openState.terms? 
                          <Checkbox/>:
                          <View className='border border-gray-300 h-5 w-5 rounded-sm'>
                      
                          </View>
                      }
                      <Text
                      style={{fontFamily: 'Inter-Regular'}}
                      className='text-center text-[11px] text-gray-500'
                      >
                        I understand and agree with the <Text style={{fontFamily: 'Inter-SemiBold'}} className='text-custom-green'>Terms and Conditions</Text> 
                      </Text>
                    </View>      
                </Pressable>
            </View>

              <View className='w-[90%] mx-auto mt-36'>
                <TouchableOpacity
                onPress={handleRequest}
                className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                >
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Done
                  </Text>
                  {loading && (
                    <View className='absolute w-full top-4'>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
    )
}