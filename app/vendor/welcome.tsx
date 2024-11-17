import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import WelcomeCats from '../../assets/icon/welcome_cats.svg';
import Skip from '@/components/Skip';


export default function VendorWelcome(){
    return (
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='w-full mt-4'>
              <Skip next='/vendor/(tabs)/order' />
            </View>

            <Text
            style={{fontFamily: 'Inter-Bold'}}
            className='text-gray-700 text-lg mt-6'
            >
              Welcome
            </Text>

            <View className='my-auto'>
              <WelcomeCats />
            </View>

            <Text
            style={{fontFamily: 'Inter-Medium'}}
            className='text-[14px] text-gray-500 mt-auto leading-5'
            >
              Welcome to your PickitPickEat for vendor expertise. Join us and start your journey today
            </Text>

            <View className='w-[90%] mx-auto mb-16 mt-3'>
              <TouchableOpacity
              // onPress={()=>{router.push("/vendor/create_profile")}}
              onPress={()=>{router.push("/vendor/account_setup_1")}}
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
        </View>
    )
}