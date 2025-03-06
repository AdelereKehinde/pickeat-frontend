import React, { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, StatusBar, Pressable, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router, useGlobalSearchParams } from 'expo-router';
import { Link } from "expo-router";
import { useUser } from '@/context/UserProvider';
import TitleTag from '@/components/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import { getRequest, postRequest } from '@/api/RequestHandler';
import FullScreenLoader from '@/components/FullScreenLoader';
import ENDPOINTS from '@/constants/Endpoint';
import Location from '../../assets/icon/location_highlight.svg';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

export default function RiderDetails(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type APIResponse = {
       id: number; 
       full_name: string; 
       avatar: string; 
       vehicle_type: string; 
       first_name: string; 
       last_name: string;
       contact_mail: string; 
       phone_number: string; 
       gender: string;
       vehicle_brand: string; 
       plate_number: string; 
       licence: string; 
       face: string; 
       additional_info: string;
       guarantor_1_name: string; 
       guarantor_1_phone: string; 
       guarantor_1_relationship: string; 
       guarantor_2_name: string; 
       guarantor_2_phone: string;
       guarantor_2_relationship: string;
       previous_workplace: string; 
       work_duration: string;
       available_from: string; 
       available_to: string; 
       available_on_holiday: string;
       time_start: string;
       time_end: string;
    };

    const [loading, setLoading] = useState(true)
    const [isActive, setIsActive] = useState(true)
    const [resData, setResData] = useState<APIResponse>()

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['admin']['riders']}/${id}`, true);
                setResData(response)
                setLoading(false) 
                // alert(JSON.stringify(response))
            } catch (error) {
                // alert(error);
                // setLoading(false) 
            }
        };
    
        fetchInformation(); 
    }, []); // Empty dependency array ensures this runs once

    const handleLogin = async () => {
        try {
          if(!loading && isActive){
            setLoading(true)
            
            // const res = await postRequest(ENDPOINTS['admin']['signin'], {
            //   id: id,
            // }, true);

            setLoading(false)
            // alert(JSON.stringify(res))
            Toast.show({
              type: 'success',
              text1: "Account Suspended",
              visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            }); 

            setIsActive(false)
  
          }
  
        } catch (error:any) {
          setLoading(false)
          // alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: error.data?.data?.message || "An error occured",
            // text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
    };
    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content" backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
                    <TitleTag withprevious={true} title='Rider Management' withbell={true} />
                </View>
                {loading && (
                    <FullScreenLoader />
                )}
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-[90%] mx-auto rounded-md mt-5 py-4 relative flex items-center justify-center`}>
                        <Text
                        className={`text-custom-green text-[13px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {resData?.full_name}
                        </Text>
                        <View className='w-24 h-24 overflow-hidden rounded-full mt-2'>
                            <Image 
                            source={{uri: resData?.avatar}}
                            className='w-24 h-24'
                            />
                        </View>
                    </View>

                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} flex flex-row items-center justify-between w-[90%] mx-auto rounded-lg mt-4 py-2 px-3`}>
                        <View>
                            <Text
                            className={`text-gray-400 text-[11px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                Driver License
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                    {resData?.full_name}
                            </Text>
                        </View>
                        <TouchableOpacity
                        className='bg-custom-green rounded-md py-1 px-4'
                        >
                            <Text
                            className={`text-white text-[11px]`}
                            style={{fontFamily: 'Inter-Medium'}}
                            >
                                View
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-[90%] mx-auto space-y-3 mb-3 mt-4 rounded-md p-3`}>                    
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Rider Name
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.full_name}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Contact mail
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.contact_mail}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Vehicle Type
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.vehicle_type}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Vehincle brand
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.vehicle_brand}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Plate number
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.plate_number}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Previous Workplace
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.previous_workplace} {resData?.work_duration}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Available on holidays
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.available_on_holiday}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Available Days
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.available_from} - {resData?.available_to}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-400'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Available time
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.time_start} - {resData?.time_end}
                            </Text>
                        </View>
                    </View>

                    
                    <View className='w-[90%] mx-auto mb-10'>
                            <TouchableOpacity
                            onPress={handleLogin}
                            className={`text-center ${isActive? 'bg-red-600' : 'bg-red-300'} relative rounded-xl p-4 w-[90%] self-center flex items-center justify-around`}
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
                                Suspend Account
                            </Text>
                                        
                        </TouchableOpacity>
                    </View>
                    <Toast config={toastConfig} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}