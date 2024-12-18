import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import SetAvail from '../../assets/icon/set_availability.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetAvailability(){
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
                Set Your Availability
              </Text>

              <View className='my-auto mx-auto'>
                <SetAvail />
              </View>

              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-[14px] text-gray-500 mt-auto leading-5'
              >
                Choose when you're available to take on orders and deliver to clients
              </Text>

              <View className='w-[90%] mx-auto mb-10 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/receive_food_order')}}
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