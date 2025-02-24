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

function AdminReportAnalytics(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };

    const { theme, toggleTheme } = useContext(ThemeContext);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
    
      // await fetchMeals()

      setRefreshing(false); // Stop the refreshing animation
  };

    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'custom-gray-1'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <ScrollView 
                  refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  className='w-full flex p-2 mb-[10px]' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='w-full p-2'>
                      <View className='flex flex-row justify-between items-center w-full p-2'>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-[#1E1E1E]'} text-[18px]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              Revenue
                          </Text>
                          <Text
                          className={`${theme == 'dark'? 'text-gray-100' : 'text-white'} text-[12px] mt-2 py-2 px-4 rounded bg-[#228B22]`}
                          style={{fontFamily: 'Inter-SemiBold'}}
                          >
                              $1200.87
                          </Text>
                      </View>
                    </View>
                    
                    <View className='bg-white rounded w-full p-2 mt-2'>
                        <View className='flex flex-row justify-between items-center w-full p-2'>
                        <View>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#3D4857]'} text-[14px]`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                August 2023
                            </Text>
                        </View>
                        <View className='flex flex-row px-2 rounded-2xl items-center space-x-4 ml-auto'>
                            <TouchableOpacity>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#767676]'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >D</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#767676]'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >W</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#767676]'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold', backgroundColor: '#F5F5F5', color: '#228B22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5}}
                                >M</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : 'text-[#767676]'} text-[14px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >Y</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>

                    <View className='bg-white rounded w-full p-2 mt-2'>
                        <View className='flex flex-row justify-center mb-4'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#3D4857]'} text-[14px]`}
                            style={{fontFamily: 'Inter'}}
                            >
                                Monthly user engagement report
                            </Text>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text className='text-[#3D4857]'>Jacob Jones</Text>
                                <Text className='text-[#8492A4]'>29 orders</Text>
                            </View>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text className='text-[#3D4857]'>Jacob Jones</Text>
                                <Text className='text-[#8492A4]'>29 orders</Text>
                            </View>
                        </View>
                    </View>

                    <View className='bg-white rounded p-2 mt-4 mx-2'>
                        <View className='flex flex-row justify-center mb-4'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-100' : 'text-[#3D4857]'} text-[14px]`}
                            style={{fontFamily: 'Inter'}}
                            >
                                Order insight
                            </Text>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text className='text-[#3D4857]'>Jacob Jones</Text>
                                <Text className='text-[#228B22]' style={{fontFamily: 'Inter-Bold'}}>29 orders</Text>
                            </View>
                        </View>
                        <View className='flex flex-row justify-start my-2'>
                            <View>
                                <Image source={require("../../../assets/images/image22.jpg")} className='w-10 h-10 rounded-md'/>
                            </View>
                            <View className='ml-2'>
                                <Text className='text-[#3D4857]'>Jacob Jones</Text>
                                <Text className='text-[#228B22]' style={{fontFamily: 'Inter-Bold'}}>29 orders</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}

export default AdminReportAnalytics;