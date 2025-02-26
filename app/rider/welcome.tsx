import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Welcome from '../../assets/icon/rider-welcome.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RiderWelcome(){
    return (
      <SafeAreaView>
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='w-full'>
              <Skip next='/rider/signup' />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='w-full'>
              
              <Text
              style={{fontFamily: 'Inter-Bold'}}
              className='text-gray-700 text-lg mt-6 mx-auto text-center'
              >
                Welcome to the 
                {`\n`}PickItPickEat Team!
              </Text>

              <View className='my-auto mx-auto'>
                <Welcome />
              </View>

              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-[14px] text-gray-500 mt-auto leading-5'
              >
                Join thousands of riders delivering food and packages with ease. Earn on your schedule!
              </Text>

              <View className='w-[90%] mx-auto mb-10 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/rider/welcome2')}}
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