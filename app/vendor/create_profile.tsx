import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../../assets/icon/profile.svg';
import Skip from '@/components/Skip';


export default function CreateProfile(){
    return (
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='w-full mt-4'>
              <Skip next='/vendor/signup' />
            </View>

            <Text
            style={{fontFamily: 'Inter-Bold'}}
            className='text-gray-700 text-lg mt-6'
            >
              Create Your Profile
            </Text>

            <View className='my-auto'>
              <Profile />
            </View>

            <Text
            style={{fontFamily: 'Inter-Medium'}}
            className='text-[14px] text-gray-500 mt-auto leading-5'
            >
              Set up your Vendor dashboard/Restaurant to showcase your menu
            </Text>

            <View className='w-[90%] mx-auto mb-16 mt-3'>
              <TouchableOpacity
              onPress={()=>{router.push('/vendor/list_services')}}
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