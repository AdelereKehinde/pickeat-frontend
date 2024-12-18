import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import CreateServices from '../../assets/icon/create_services.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListServices(){
    return (
      <SafeAreaView>
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='w-full'>
              <Skip next='/vendor/signup' />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='w-full'>
              <Text
              style={{fontFamily: 'Inter-Bold'}}
              className='text-gray-700 text-lg mt-6 mx-auto'
              >
                List Your Services
              </Text>

              <View className='my-auto mx-auto'>
                <CreateServices />
              </View>

              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-[14px] text-gray-500 mt-auto leading-5'
              >
                Highlight the services you excel at – from chef to catery services
              </Text>

              <View className='w-[90%] mx-auto mb-10 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/set_availability')}}
                className={`text-center bg-custom-green relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                >
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Next
                  </Text>
                      
                </TouchableOpacity>
              </View>
            </ScrollView>
        </View>
      </SafeAreaView>
    )
}