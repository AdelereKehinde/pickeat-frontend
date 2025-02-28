import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Approval from '../../assets/icon/rider-approval.svg';
import Skip from '@/components/Skip';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RiderWelcome3(){
    const completeOnboarding = async () => {
        // Set a flag to indicate the user has completed onboarding
        await AsyncStorage.setItem('riderHasVisitedOnboarding', 'true');
        router.replace('/rider/signup');
    };
    return (
      <SafeAreaView>
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            {/* <View className='w-full'>
              <Skip next='/rider/signup' />
            </View> */}

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='w-full'>
              
              <Text
              style={{fontFamily: 'Inter-Bold'}}
              className='text-gray-700 text-lg mt-14 mx-auto text-center'
              >
                Verification & Approval
              </Text>

              <View className='my-auto mx-auto'>
                <Approval />
              </View>

              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-[14px] text-gray-500 mt-auto leading-5'
              >
                Submit your documents for verification. Our team will review and notify you once approved.
              </Text>

              <View className='w-[90%] mx-auto mb-10 mt-3'>
                <TouchableOpacity
                onPress={completeOnboarding}
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