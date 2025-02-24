import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Image } from "react-native";
import { router } from 'expo-router'
import { getRequest } from '@/api/RequestHandler';
import Empty from '../../../assets/icon/Empty2.svg';
import ENDPOINTS from '@/constants/Endpoint';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from '@/components/Pagination';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ArrowRightCircle from '../../../assets/icon/arrow-right-circle.svg';
import Warning from '../../../assets/icon/warning.svg';

function AdminContent(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const { theme, toggleTheme } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);

    const [kilometer, setKilometer] = useState('')
    const [prize, setPrize] = useState('');
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('');

    const onRefresh = async () => {
        setRefreshing(true);
    
      // await fetchMeals()

      setRefreshing(false); // Stop the refreshing animation
  };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <ScrollView 
                  refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  className='w-full flex p-2 mb-[10px]' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='flex flex-row justify-start my-4'>
                        <Warning />
                        <Text className='text-[#228B22] text-[12px] ml-2' style={{fontFamily: 'Inter-Bold'}}>
                            update support mail address and whatsapp contact
                        </Text>
                    </View>
                    <View className='px-5'>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'bg-gray-800 text-[#767676]' : ' bg-white text-[#767676]'} rounded-xl p-3 text-[13px] border border-[#767676] h-[50px]`}
                            onChangeText={setKilometer}
                            // maxLength={10}
                            keyboardType="number-pad"
                            placeholder='Enter Kilometers'
                            placeholderTextColor={(theme == 'dark')? '#fff':'#767676'}
                        />
                        <View className='flex flex-row justify-between items-center w-full mt-2'>
                            <View className='w-[20%]'>
                                <View>
                                    <TextInput
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'bg-gray-800 text-[#767676]' : ' bg-white text-[#767676]'} rounded-xl p-3 text-[13px] border border-[#767676] h-[50px] mt-1`}
                                        onChangeText={setStartTime}
                                        // maxLength={10}
                                        keyboardType="number-pad"
                                        placeholder='+234'
                                        placeholderTextColor={(theme == 'dark')? '#fff':'#767676'}
                                    />
                                </View>
                            </View>
                            <View className='w-[78%]'>
                                <View>
                                    <TextInput
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'bg-gray-800 text-[#767676]' : ' bg-white text-[#767676]'} rounded-xl p-3 text-[13px] border border-[#767676] h-[50px] mt-1`}
                                        onChangeText={setEndTime}
                                        // maxLength={10}
                                        keyboardType="number-pad"
                                        placeholder='9012456789'
                                        placeholderTextColor={(theme == 'dark')? '#fff':'#767676'}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity className='text-center bg-custom-green relative p-4 w-[80%] self-center mt-5 flex items-center justify-around rounded-[10px]'>
                    
                        <Text
                        className='text-white'
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                            Save
                        </Text>
                            
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}

export default AdminContent;