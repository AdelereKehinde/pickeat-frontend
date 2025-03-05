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

function AdminPages(){
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
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-gray-100'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <ScrollView 
                  refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  className='w-full flex mb-[10px]' contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='space-y-2 mt-2'>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} flex flex-row justify-between items-center w-full px-5 py-4`}>
                            <View>
                                <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-gray-900'} text-[14px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                    Users
                                </Text>
                            </View>
                            <View className='px-2'>
                                <TouchableOpacity
                                onPress={()=>{}}
                                >
                                    <ArrowRightCircle />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} flex flex-row justify-between items-center w-full px-5 py-4`}>
                            <View>
                                <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-gray-900'} text-[14px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                    Vendors
                                </Text>
                            </View>
                            <View className='px-2'>
                                <TouchableOpacity
                                onPress={()=>{}}
                                >
                                    <ArrowRightCircle />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} flex flex-row justify-between items-center w-full px-5 py-4`}>
                            <View>
                                <Text className={`${theme == 'dark'? 'text-gray-100' : 'text-gray-900'} text-[14px]`}
                                style={{fontFamily: 'Inter-Bold'}}>
                                    Riders
                                </Text>
                            </View>
                            <View className='px-2'>
                                <TouchableOpacity
                                onPress={()=>{}}
                                >
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

export default AdminPages;