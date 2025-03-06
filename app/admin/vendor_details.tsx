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

export default function VendorDetails(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type APIResponse = {
       id: number; 
       avatar: string; 
       profession: string; 
       category: string; 
       document: string; 
       business_name: string; 
       experience: string; 
       business_mail: string; 
       business_number: string; 
       work_alone: string;
       terms: string; 
       description: string; 
       additional_info: string; 
       available_from: string; 
       available_to: string;
       available_on_holiday: string; 
       time_start: string; 
       time_end: string; 
       no_of_worker: string; 
       latitude: string;
       longitude: string; 
       address: string; 
       profession_category: string;
       building_name: string;
       building_type: string;
       floor: string;
    };

    const [loading, setLoading] = useState(true)
    const [isActive, setIsActive] = useState(true)
    const [resData, setResData] = useState<APIResponse>()

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['admin']['vendors']}/${id}`, true);
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
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-50'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <TitleTag withprevious={false} title='User Management' withbell={false} />
                {loading && (
                    <FullScreenLoader />
                )}
                <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-[90%] mx-auto rounded-md mt-5 py-4 relative flex items-center justify-center`}>
                        <Text
                        className={`text-custom-green text-[13px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {resData?.business_name}
                        </Text>
                        <View className='w-24 h-24 overflow-hidden rounded-full mt-2'>
                            <Image 
                            source={{uri: resData?.avatar}}
                            className='w-24 h-24'
                            />
                        </View>
                    </View>
                    
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} w-[90%] mx-auto space-y-3 mb-3 mt-4 rounded-md p-3`}>                    
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Business Name
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.business_name}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Business mail
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.business_mail}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Business Phone
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.business_number}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Profession
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.profession}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Category
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.category}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
                            <Text
                            className='text-custom-green text-[11px]'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Number of workers
                            </Text>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[11px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                {resData?.no_of_worker}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
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
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
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
                        <View className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-500'} w-full border-b pb-2`}>
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

                    <TouchableOpacity 
                    onPress={()=>{router.push("/set_delivery_address?update=1")}}
                    className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} w-full px-6 py-2 my-5`}>
                        <View className='w-full flex flex-row space-x-3 items-center'>
                            <Location />
                            <View>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[11px] self-start`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {resData?.address}
                                </Text>

                                <View className='flex flex-row space-x-2'>
                                    <Text
                                    className='text-[11px] text-custom-green self-start'
                                    style={{fontFamily: 'Inter-Medium'}}
                                    >
                                        Apt/House
                                    </Text>
                                    <Text
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px] self-start`}
                                    style={{fontFamily: 'Inter-Regular'}}
                                    >
                                        {resData?.building_name} {resData?.building_type} {resData?.floor}
                                    </Text>
                                </View>
                                
                            </View>
                        </View>
                    </TouchableOpacity>
                    
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