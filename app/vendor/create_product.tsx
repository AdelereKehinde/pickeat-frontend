import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, StyleSheet, Platform, Alert, Image, TextInput  } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../../assets/icon/profile.svg';
import Camera from '../../assets/icon/camera.svg';
import TitleTag from '@/components/Title';
import Notice from '../../assets/icon/notice.svg';
import CharField from '@/components/CharField';
import CharFieldDropDown from '@/components/CharFieldDropdown';

export default function CreateProduct(){
    const [description, setDescription] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [firstName, setFirstName] = useState('')

    const dropdown = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 },
        { label: 'Option 4', value: 4 },
        { label: 'Option 5', value: 5 },
        { label: 'Option 6', value: 6 },
        { label: 'Option 7', value: 7 },
        { label: 'Option 8', value: 8 },
        { label: 'Option 9', value: 9 },
        { label: 'Option 10', value: 10 },
    ]
    return (
        <View 
        className='w-full h-full bg-gray-100 flex items-center'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='bg-white w-full'>
              <TitleTag withprevious={true} title='Menu' withbell={false}/>
            </View>

            <View className='px-4 w-full mt-4'>
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
                    Upload all meal related {'\n'}informations and pricing
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-Medium'}}
                  className='text-[10px] text-gray-400 '
                  >
                    1. Meal Photo{'\n'}
                    2. Pricing{'\n'}
                    3. Category{'\n'}
                    4. Description
                  </Text>
                </View>
              </View>

              <View
                className='w-full mt-3 flex flex-row items-center p-3 rounded-lg bg-blue-100'
                >
                <Notice/>
                <Text
                style={{fontFamily: 'Inter-Medium'}}
                className='text-custom-green ml-2 text-[11px]'
                >
                    Please Kindly provide the correct info below
                </Text>
              </View>

              <View
                className='flex w-full mt-3 space-y-1'
                >   
                <View>
                    <CharField  placeholder="Meal Name*" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                </View>
                <View>
                    <CharField  placeholder="Enter Meal Price*" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                </View>
                <View>
                    <CharFieldDropDown options={dropdown}  placeholder="Category?" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                </View>
            </View>

              <View style={styles.shadow_box} className='bg-white w-full rounded-lg p-4 mt-4'>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Meal Description
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
              
              <View className='w-[90%] mx-auto mb-16 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/account_setup_3')}}
                className={`text-center bg-custom-green relative rounded-xl p-4 w-full self-center mt-5 flex items-center justify-around`}
                >
                  <Text
                  className='text-white'
                  style={{fontFamily: 'Inter-Regular'}}
                  >
                    Save
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