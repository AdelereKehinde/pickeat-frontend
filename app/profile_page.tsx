import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest, patchRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import RadioActive from '../assets/icon/radio_active.svg';
import RadioInctive from '../assets/icon/radio_inactive.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Delay from '@/constants/Delay';

export default function ProfilePage(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);

    type APIResponse = { first_name: string; last_name: string; email: string; phone_number: string; service_option: number; rider_instruction: string;};

    const [resData, setResData] = useState<APIResponse>();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('');
    const [riderInstruction, setRiderInstruction] = useState('');
    const [serviceOption, setServiceOption] = useState(1);

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['buyer']['information']}`, true);
                setFirstName(response.first_name)
                setLastName(response.last_name)
                setPhoneNumber(response.phone_number)
                setRiderInstruction(response.rider_instruction)
                setServiceOption(response.service_option)
                setEmail(response.email)

                setResData(response)
                setLoading(false)
                // alert(JSON.stringify(response))
            } catch (error) {
                alert(error);
            }
        };
    
        fetchInformation(); 
    }, []); // Empty dependency array ensures this runs once

    const validateInput = (field:string) =>{
        switch (field) {
            case 'first_name':
                return (firstName !== resData?.first_name)
            case 'last_name':
                return (lastName !== resData?.last_name)
            case 'phone_number':
                return (phoneNumber !== resData?.phone_number)
            case 'service_option':
                return (serviceOption !== resData?.service_option)
            case 'rider_instruction':
                return (riderInstruction !== resData?.rider_instruction)
            default:
                return false;
        }
      }

    const handleUpdate = async (field: string) => {
        try {
          if(!loading && validateInput(field)){
            setLoading(true)
            type DataResponse = { message: string; token:string; refresh: string, name:string; };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await patchRequest<ApiResponse>(ENDPOINTS['buyer']['information'], {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                service_option: serviceOption,
                rider_instruction: riderInstruction
            }, true);
            
            setLoading(false)
            Toast.show({
              type: 'success',
              text1: "Details Updated",
              visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
          }
  
        } catch (error:any) {
          setLoading(false)
          alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: "An error occured",
            text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
      };

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <View className='bg-gray-100 w-full'>
                <TitleTag withprevious={true} title='' withbell={false} />
            </View>

            <ScrollView className='w-full space-y-1'>
                <Text
                className='text-custom-green text-[16px] self-start pl-5 mt-5'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Personal Information
                </Text>
                <View className='w-[90%] mx-auto space-y-3 mb-3'>
                    <View className='flex flex-row bg-gray-100 rounded-xl px-4 items-center space-x-3 py-2'>
                        <View className='grow'>
                            <Text
                            className='text-gray-400 text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                First Name
                            </Text>
                            <TextInput
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`w-full rounded-lg text-[11px] text-black`}
                                autoFocus={false}
                                readOnly={loading}
                                onChangeText={setFirstName}
                                defaultValue={firstName}
                                placeholderTextColor=""
                            />
                        </View>
                        <TouchableOpacity
                        className={` bg-custom-green ${(loading || resData?.first_name == firstName) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                        onPress={()=>{handleUpdate('first_name')}}
                        >
                            <Text
                            className='text-white text-[11px] self-start'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Edit
                            </Text>
                            {loading && (
                                <View className='absolute w-full'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View className='flex flex-row bg-gray-100 rounded-xl px-4 items-center space-x-3 py-2'>
                        <View className='grow'>
                            <Text
                            className='text-gray-400 text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Last Name
                            </Text>
                            <TextInput
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`w-full rounded-lg text-[11px] text-black`}
                                autoFocus={false}
                                readOnly={loading}
                                onChangeText={setLastName}
                                defaultValue={lastName}
                                placeholderTextColor=""
                            />
                        </View>
                        <TouchableOpacity
                        className={`bg-custom-green ${(loading || resData?.last_name == lastName) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                        onPress={()=>{handleUpdate('last_name')}}
                        >
                            <Text
                            className='text-white text-[11px] self-start'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Edit
                            </Text>
                            {loading && (
                                <View className='absolute w-full'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View className='flex flex-row bg-gray-100 rounded-xl px-4 items-center space-x-3 py-2'>
                        <View className='grow'>
                            <Text
                            className='text-gray-400 text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Email
                            </Text>
                            <TextInput
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`w-full rounded-lg text-[11px] text-black`}
                                autoFocus={false}
                                onChangeText={setEmail}
                                defaultValue={email}
                                readOnly={true}
                                placeholderTextColor=""
                            />
                        </View>
                    </View>
                    <View className='flex flex-row bg-gray-100 rounded-xl px-4 items-center space-x-3 py-2'>
                        <View className='grow'>
                            <Text
                            className='text-gray-400 text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Phone Number
                            </Text>
                            <TextInput
                                style={{fontFamily: 'Inter-Medium'}}
                                className={`w-full rounded-lg text-[11px] text-black`}
                                autoFocus={false}
                                readOnly={loading}
                                onChangeText={setPhoneNumber}
                                defaultValue={phoneNumber}
                                placeholderTextColor=""
                            />
                        </View>
                        <TouchableOpacity
                        className={`bg-custom-green ${(loading || resData?.phone_number == phoneNumber) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                        onPress={()=>{handleUpdate('phone_number')}}
                        >
                            <Text
                            className='text-white text-[11px] self-start'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Edit 
                            </Text>
                            {loading && (
                                <View className='absolute w-full'>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>


                <Text
                className='text-[13px] self-start pl-5'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Service Options
                </Text>
                <View className='px-3 w-[90%] mx-auto mb-3'>
                    <TouchableOpacity
                    onPress={()=>{setServiceOption(1)}}
                    className='flex flex-row items-center space-x-2 border-b border-gray-200 py-2'
                    >
                        <View className={`flex items-center justify-around border border-custom-green ${(serviceOption !== 1) && 'border-gray-300'} p-1 rounded-full`}>
                            {(serviceOption == 1)?
                                <RadioActive />
                                :
                                <RadioInctive width={6} height={6} />
                            }
                        </View>
                        <Text
                        className='text-[12px] self-start text-gray-500'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Hand it to me Directly
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{setServiceOption(2)}}
                    className={`flex flex-row items-center space-x-2 border-b border-gray-200 py-2`}
                    >
                        <View className={`flex items-center justify-around border border-custom-green ${(serviceOption !== 2) && 'border-gray-300'} p-1 rounded-full `}>
                            {(serviceOption == 2)?
                                <RadioActive />
                                :
                                <RadioInctive width={6} height={6} />
                            }       
                        </View>
                        <Text
                        className='text-[12px] self-start text-gray-500'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Hand to me or who’s available
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{setServiceOption(3)}}
                    className='flex flex-row items-center space-x-2 border-b border-gray-200 py-2'
                    >
                        <View className={`flex items-center justify-around border border-custom-green ${(serviceOption !== 3) && 'border-gray-300'} p-1 rounded-full`}>
                            {(serviceOption == 3)?
                                <RadioActive />
                                :
                                <RadioInctive width={6} height={6} />
                            }
                        </View>
                        <Text
                        className='text-[12px] self-start text-gray-500'
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            Leave it at my door
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text
                className='text-[13px] pl-5 mt-10'
                style={{fontFamily: 'Inter-SemiBold'}}
                >
                    Instruction for Rider
                </Text>
                <View className='w-[90%] mx-auto'>
                    <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`w-full rounded-lg text-[11px] text-gray-500`}
                    autoFocus={false}
                    readOnly={loading}
                    onChangeText={setRiderInstruction}
                    defaultValue={riderInstruction}
                    placeholder='e.g enter the main street, its 1st door on the right'
                    placeholderTextColor=""
                    />
                </View>
            </ScrollView>
        </View>
    )
}