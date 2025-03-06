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

export default function UserDetails(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const {id} = useGlobalSearchParams()
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    type APIResponse = {
       id: number; first_name: string; last_name: string; email: string; building_type: string; building_name: string; floor: string; address: string; phone_number: string; avatar: string;
    };

    const [loading, setLoading] = useState(true)
    const [isActive, setIsActive] = useState(true)
    const [resData, setResData] = useState<APIResponse>()

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['admin']['buyers']}/${id}`, true);
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
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full py-4 relative flex items-center justify-center`}>
                        <View className='w-24 h-24 overflow-hidden rounded-full'>
                            <Image 
                            source={{uri: resData?.avatar}}
                            className='w-24 h-24'
                            />
                        </View>
                        <Text
                        className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} text-2xl`}
                        style={{fontFamily: 'Inter-SemiBold'}}
                        >
                            {resData?.first_name} {resData?.last_name}
                        </Text>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[13px]`}
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {resData?.email || "No email"}
                        </Text>
                        <Text
                        className='text-[12px] text-custom-green'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {resData?.phone_number || "No number"}
                        </Text>
                    </View>
                    
                    <Text
                    className='text-custom-green text-[16px] self-start pl-5 mt-5'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Personal Information
                    </Text>
                    <View className='w-[90%] mx-auto space-y-3 mb-3'>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    First Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={true}
                                    // onChangeText={setFirstName}
                                    defaultValue={resData?.first_name}
                                    placeholderTextColor=""
                                />
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Last Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={true}
                                    // onChangeText={setLastName}
                                    defaultValue={resData?.last_name}
                                    placeholderTextColor=""
                                />
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Email
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    // onChangeText={setEmail}
                                    defaultValue={resData?.email}
                                    readOnly={true}
                                    placeholderTextColor=""
                                />
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Phone Number
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={true}
                                    // onChangeText={setPhoneNumber}
                                    defaultValue={resData?.phone_number}
                                    placeholderTextColor=""
                                />
                            </View>
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