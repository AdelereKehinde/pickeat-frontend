import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TouchableOpacity,ActivityIndicator, ScrollView, StatusBar, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import ChevronNext from '../../assets/icon/chevron-next.svg';
import Delete from '../../assets/icon/delete.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postRequest } from '@/api/RequestHandler';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Device from "expo-device";
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleTag from '@/components/Title';
import DeleteAccountModal from '@/components/DeleteAccountModal';

export default function RiderSettings(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { setUser } = useUser();
    const [openDeleteModal, setOpenDeleteModal] = useState(false); 

    return (
      <SafeAreaView>
        <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
            <TitleTag withprevious={true} title='Settings' withbell={false} />
        </View>
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}
        >
            <DeleteAccountModal open={openDeleteModal} getValue={(value: boolean)=>{setOpenDeleteModal(value)}}/>

            <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>

                <View className='flex flex-col px-5 mt-5 w-full'>
                    <TouchableOpacity
                    onPress={()=>{router.push({pathname: '/rider/handbook'});}}
                    className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-500'} border-b py-3 flex flex-row items-center justify-between`}
                    >   
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] `}
                        >
                            Riders Handbook
                        </Text>

                        <ChevronNext />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{router.push({pathname: '/rider/reset_transaction_pin'});}}
                    className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-500'} border-b py-3 flex flex-row items-center justify-between`}
                    >   
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] `}
                        >
                            Reset PIN
                        </Text>

                        <ChevronNext />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{setOpenDeleteModal(true)}}
                    className={`${theme == 'dark'? 'border-gray-600' : ' border-gray-500'} border-b py-3 flex flex-row items-center justify-between`}
                    >   
                        <Text
                        style={{fontFamily: 'Inter-SemiBold'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] `}
                        >
                            Delete Account
                        </Text>

                        <Delete />
                    </TouchableOpacity>
                    
                </View>

            </ScrollView>
        </View>
      </SafeAreaView>
    )
}