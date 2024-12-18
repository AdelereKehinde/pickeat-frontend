import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Set from '../../assets/icon/all_set.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllSet(){
    return (
      <SafeAreaView>
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text
              style={{fontFamily: 'Inter-Bold'}}
              className='text-gray-700 text-lg mt-16 mx-auto'
              >
                You’re all set up
              </Text>

              <View className='my-auto mx-auto'>
                <Set />
              </View>

              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-[14px] text-gray-500 mt-auto leading-5'
              >
                We’ll notify you via mail or text message when your application has been approved.
              </Text>

              <View className='w-[90%] mx-auto mb-16 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/(tabs)/home')}}
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