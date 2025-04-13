import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from "react-native";
import { router } from 'expo-router'
import { getRequest, patchRequest, postRequest } from '@/api/RequestHandler';
import Notice from '../../../assets/icon/notice.svg';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ArrowRightCircle from '../../../assets/icon/arrow-right-circle.svg';
import Warning from '../../../assets/icon/warning.svg';
import CharField from '@/components/CharField';
import PhoneNumber from '@/components/NumberField';
import FullScreenLoader from '@/components/FullScreenLoader';
import Delay from '@/constants/Delay';
import ConnectionModal from '@/components/ConnectionModal';

function AdminContent(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const { theme, toggleTheme } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);
    const [fetchloading, setFetchLoading] = useState(true); // Loading state

    type ApiRes = { email: string; whatsapp: string;};
    const [resData, setResData] = useState<ApiRes>();
    const [data, setData] = useState({
        email:'', 
        whatsapp: ''
    });

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                setFetchLoading(true)
                type ApiRes = { email: string; whatsapp: string;};
                const response = await getRequest<ApiRes>(ENDPOINTS['account']['support'], true); // Authenticated
                setData(response)
                
                setFetchLoading(false)
            } catch (error) {
                // alert(error);
            }
        };
    
        fetchProfessions();
    }, []); // Empty dependency array ensures this runs once


    const validateInput = () =>{
        if((data.email !== '') && (data.whatsapp !== '')){
            if ((data.email !== resData?.email) || (data.whatsapp !== resData?.whatsapp)){
                return true
            }
          return false;
        }
        return false; 
    }    

    const handleRequest = async () => {
        if(!fetchloading && validateInput()){
            try {
                setFetchLoading(true)
                const updatedProfile = await patchRequest(ENDPOINTS['admin']['update-support'], {
                    email: data.email,
                    whatsapp: `${data.whatsapp}`
                }, true);
                setResData({
                    email: data.email,
                    whatsapp: data.whatsapp
                })
                setFetchLoading(false)
                Toast.show({
                    type: 'success',
                    text1: "Support details updated.",
                    visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
                await Delay(1500)
                router.back()
            
            } catch (error: any) {
                setFetchLoading(false)
                // alert(JSON.stringify(error))
                Toast.show({
                    type: 'error',
                    text1: "An error occured",
                    text2: error.data?.message || 'Unknown Error',
                    visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            }
        }
    };


    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                {fetchloading && (
                    <FullScreenLoader />
                )}
                
                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}

                <ScrollView
                className='w-full flex p-2' contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full mb-5 mt-3 flex flex-row items-center p-3 rounded-lg`}
                    >
                        <Notice/>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-custom-green ml-2 text-[11px]'
                        >
                        Update support mail address and whatsapp contact
                        </Text>
                    </View>
                    <View className='mx-4 mb-4'>
                        {
                            (data.email !== "" ) && (
                                <Text
                                style={{fontFamily: 'Inter-Medium'}}
                                className='text-[12px] text-custom-green ml-1 mt'
                                >
                                Email
                                </Text>
                            )
                        }
                        <CharField  placeholder="Email*" focus={false} border={true} name='' setValue={data.email} getValue={(value: string)=>setData(prevState => ({...prevState, email: value}))}/>
                    </View>

                    {
                        (data.whatsapp !== "" ) && (
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className='text-[12px] text-custom-green ml-4'
                            >
                            WhatsApp number
                            </Text>
                        )
                    }
                    <View className='flex flex-row items-center mx-4'>
                        <View className={`${theme == 'dark'? 'bg-gray-700' : ' bg-gray-100'} rounded-md w-11 h-11 flex items-center justify-around mr-2 border border-gray-300`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-white' : ' text-gray-600'} text-[11px] text-center`}
                            >
                                +234
                            </Text>
                        </View>
                        <View className='grow'>
                            <PhoneNumber  placeholder="WhatsApp  Number*" focus={false} border={true} name='' setValue={data.whatsapp} getValue={(value: string)=>setData(prevState => ({...prevState, whatsapp: value}))}/>
                        </View>
                    </View>


                    <View className='w-[90%] mx-auto'>
                        <TouchableOpacity
                        onPress={handleRequest}
                        className={`text-center ${(validateInput())? 'bg-custom-green' : 'bg-custom-inactive-green'} ${fetchloading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 mb-10 flex items-center justify-around`}
                        >
                   
                            <Text
                            className='text-white'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                            Save
                            </Text>
                                        
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <Toast config={toastConfig} />
        </SafeAreaView>
    )

}

export default AdminContent;