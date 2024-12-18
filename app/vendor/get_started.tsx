import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import GetStart from '../../assets/icon/get_started.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GetStarted(){
    return (
      <SafeAreaView>
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='w-full'>
              <Skip next='/vendor/signup' />
            </View>

            <ScrollView className='w-full' contentContainerStyle={{ flexGrow: 1 }}>
              <Text
              style={{fontFamily: 'Inter-Bold'}}
              className='text-gray-700 text-lg mt-6 mx-auto'
              >
                Get Started
              </Text>

              <View className='my-auto'>
                <GetStart />
              </View>

              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-[14px] text-gray-500 mt-auto leading-5'
              >
                You're one step away from taking orders and growing your business. Let's get started
              </Text>

              <View className='w-[90%] mx-auto mb-10 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/signup')}}
                className={`text-center bg-custom-green relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                >
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Done
                  </Text>
                      
                </TouchableOpacity>
              </View>
            </ScrollView>
        </View>
      </SafeAreaView>
    )
}