import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, StyleSheet, Platform, Alert, Image, TextInput  } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../../assets/icon/profile.svg';
import Camera from '../../assets/icon/camera.svg';
import TitleTag from '@/components/Title';

export default function AccountSetup2(){
    const [description, setDescription] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    return (
        <View 
        className='w-full h-full bg-gray-100 flex items-center'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='bg-white w-full'>
              <TitleTag withprevious={true} title='Create Profile' withbell={false}/>
            </View>

            <View className='px-4 w-full mt-4'>

              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 flex flex-row items-center'>
                <View className='w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center'>
                  <Camera/>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[8px] text-gray-700 text-center -mt-2'
                  >
                    Upload{'\n'} Profile Photo
                  </Text>
                </View>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-Bold'}}
                  className='text-[12px] text-gray-800'
                  >
                    Mr. Moe’s Kitchen
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-Bold'}}
                  className='text-[12px] text-custom-green -mt-1'
                  >
                    Restaurant
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[10px] text-gray-800 mt-2'
                  >
                    Creativeomotayo@gmail.com
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[10px] text-custom-green -mt-1'
                  >
                    +234 906 3287 855
                  </Text>
                </View>
              </View>

              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 flex flex-row items-center mt-4'>
                <View className='w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center'>
                  <Camera/>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[8px] text-gray-700 text-center -mt-2'
                  >
                    Upload{'\n'} Profile Photo
                  </Text>
                </View>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[11px] text-custom-green'
                  >
                    Upload all business related{'\n'}documents
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-Medium'}}
                  className='text-[10px] text-gray-500 '
                  >
                    1. CAC registration{'\n'}
                    2. TIN{'\n'}
                    3. Business certificate{'\n'}
                    4. Others
                  </Text>
                </View>
              </View>

              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 mt-4'>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Business Description
                </Text>
                <TextInput
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={5}
                  style={{fontFamily: 'Inter-SemiBold'}}
                  placeholder="Kindly Provide details below"
                  className="text-[12px] rounded-lg text-start"
                />
              </View>

              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 mt-4'>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Additional Info
                </Text>
                <TextInput
                  onChangeText={setAdditionalInfo}
                  multiline={true}
                  numberOfLines={5}
                  style={{fontFamily: 'Inter-SemiBold'}}
                  placeholder="Please provide additional details if need be"
                  className="text-[12px] rounded-lg text-start"
                />
              </View>

              
              <View className='w-[90%] mx-auto mb-16 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/account_setup_3')}}
                className={`text-center bg-custom-green relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                >
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Continue
                  </Text>
                  
                </TouchableOpacity>
              </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  shadow_box: {
    // iOS shadow properties
    shadowColor: '#1212126a',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    // Android shadow property
    elevation: 100,
  },
});