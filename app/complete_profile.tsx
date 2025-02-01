import React, { useState, useContext, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';

import ENDPOINTS from '@/constants/Endpoint';
import Delay from '@/constants/Delay';

import TitleTag from '@/components/Title';
import CharField from '@/components/CharField';
import PhoneNumber from '@/components/NumberField';
import { postRequest, patchRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function CompleteProfile(){
    const { theme, toggleTheme } = useContext(ThemeContext);
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
            const res = await patchRequest(ENDPOINTS['buyer']['user-data'], {
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber
            }, true);
            setLoading(false)
            Toast.show({
              type: 'success',
              text1: "Address Created",
              visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });

            await Delay(1000)
            router.push({
              pathname: '/complete_profile_2',
            }); 
          }
  
        } catch (error:any) {
            setLoading(false)
            // alert(JSON.stringify(error))
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
        <SafeAreaView>
          <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
              <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
              <TitleTag withprevious={true} title='Complete profile' withbell={false}/>

              <ScrollView className='w-full p-5' contentContainerStyle={{ flexGrow: 1 }}>
                {/* <View className='w-full p-5'> */}
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
                          <PhoneNumber border={false}  placeholder="Enter Phone Number" focus={false} name='Phone Number' getValue={(value: string)=>setPhoneNumber(value)}/>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                    onPress={handleSubmit}
                    className={`text-center ${(ValidateFormContent())? 'bg-custom-green' : 'bg-custom-inactive-green'} ${(loading) && 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[85%] self-center mt-auto mb-5 flex items-center justify-around`}
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
                {/* </View> */}
              </ScrollView>
              <Toast config={toastConfig} />
          </View>
        </SafeAreaView>
    )
}