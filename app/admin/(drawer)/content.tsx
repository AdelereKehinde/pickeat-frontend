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
import ArrowRight from '../../../assets/icon/arrow_right.svg';

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
                    <View className='flex flex-row justify-center my-4'>
                        <Text className='text-[#228B22] text-[16px]' style={{fontFamily: 'Inter-Bold'}}>
                            Daily Rider Game Target
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
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'bg-gray-800 text-[#767676]' : ' bg-white text-[#767676]'} rounded-xl p-3 text-[13px] border border-[#767676] h-[50px] mt-2`}
                            onChangeText={setPrize}
                            // maxLength={10}
                            keyboardType="number-pad"
                            placeholder='Enter prize'
                            placeholderTextColor={(theme == 'dark')? '#fff':'#767676'}
                        />
                        <View className='flex flex-row justify-between items-center w-full mt-2'>
                            <View className='w-[49%]'>
                                <View className='ml-5'>
                                    <Text className='text-[#228B22] text-[12px]'>Start</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'bg-gray-800 text-[#767676]' : ' bg-white text-[#767676]'} rounded-xl p-3 text-[13px] border border-[#767676] h-[50px] mt-1`}
                                        onChangeText={setStartTime}
                                        // maxLength={10}
                                        keyboardType="number-pad"
                                        placeholder='Enter Start Time'
                                        placeholderTextColor={(theme == 'dark')? '#fff':'#767676'}
                                    />
                                </View>
                            </View>
                            <View className='w-[49%]'>
                                <View className='ml-5'>
                                    <Text className='text-[#228B22] text-[12px]'>End</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={{fontFamily: 'Inter-Medium'}}
                                        className={`${theme == 'dark'? 'bg-gray-800 text-[#767676]' : ' bg-white text-[#767676]'} rounded-xl p-3 text-[13px] border border-[#767676] h-[50px] mt-1`}
                                        onChangeText={setEndTime}
                                        // maxLength={10}
                                        keyboardType="number-pad"
                                        placeholder='Enter End Time'
                                        placeholderTextColor={(theme == 'dark')? '#fff':'#767676'}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='flex flex-row justify-between items-center w-full p-5'>
                        <View>
                            <Text className='text-[#228B22] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>
                                Save new
                            </Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRight />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className='p-5'>
                        <View style={{borderBottomWidth: 2, borderBottomColor:'#228B22', paddingBottom: 10}}>
                            <Text className='text-[#228B22] text-[14px]'>New notification</Text>
                        </View>
                        <View className='mt-[10px]'>
                            <Text className='text-[#7A7A7A] text-[14px]'>Kindly Provide details below</Text>
                        </View>
                    </View>
                    <View className='flex flex-row justify-between items-center w-full p-5'>
                        <View>
                            <Text className='text-[#228B22] text-[14px]' style={{fontFamily: 'Inter-Bold'}}>
                                Save new notification
                            </Text>
                        </View>
                        <View className='px-2'>
                            <TouchableOpacity>
                                <ArrowRight />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className='bg-white rounded w-full p-2 mt-1'>
                        <View className='bg-white rounded w-full py-4 mt-1'>
                            <View className='flex flex-row justify-between items-center w-full'>
                                <View className='flex flex-row justify-start'>
                                    <Text className='text-[#000000] text-[12px] mr-1' style={{fontFamily: 'Inter-Bold'}}>
                                        View rider game history
                                    </Text>
                                    <Text className='text-[#228B22] text-[12px]' style={{fontFamily: 'Inter-Bold'}}>(5)</Text>
                                </View>
                                <View className='px-2'>
                                    <TouchableOpacity>
                                        <ArrowRightCircle />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View className='bg-white rounded w-full py-4 mt-1'>
                            <View className='flex flex-row justify-between items-center w-full'>
                                <View className='flex flex-row justify-start'>
                                    <Text className='text-[#000000] text-[12px] mr-1' style={{fontFamily: 'Inter-Bold'}}>
                                        View all available notification
                                    </Text>
                                    <Text className='text-[#228B22] text-[12px]' style={{fontFamily: 'Inter-Bold'}}>(5)</Text>
                                </View>
                                <View className='px-2'>
                                    <TouchableOpacity>
                                        <ArrowRightCircle />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-row justify-between items-center w-full py-4'>
                            <View>
                                <Text className='text-[#000000] text-[12px]' style={{fontFamily: 'Inter-Bold'}}>
                                    Banner
                                </Text>
                            </View>
                            <View className='px-2'>
                                <TouchableOpacity>
                                    <ArrowRightCircle />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}

export default AdminContent;