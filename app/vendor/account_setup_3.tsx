import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../../assets/icon/profile.svg';
import Skip from '@/components/Skip';
import Checkbox from '../../assets/icon/checkbox.svg';
import TitleTag from '@/components/Title';
import CharFieldDropDown from '@/components/CharFieldDropdown';


export default function AccountSetup3(){
  const [terms, setTerms] = useState(false)
  const [startDate, setStartDate] = useState('')
  const dropdown = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednessday', value: 'wednessday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday ', value: 'sunday' },
  ]
    return (
        <View 
        className='w-full h-full bg-white flex items-center px-4'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <TitleTag withprevious={true} title='Create Profile' withbell={false}/>
            
            <View className='bg-custom-green p-2'>
              <View className='space-y-1'>
                <View className='bg-white -z-10'>
                  <CharFieldDropDown options={dropdown}  placeholder="----------" focus={false} border={false} name='From' getValue={(value: string)=>setStartDate(value)}/>
                </View>
                <View className='bg-white -z-10'>
                  <CharFieldDropDown options={dropdown}  placeholder="----------" focus={false} border={false} name='To' getValue={(value: string)=>setStartDate(value)}/>
                </View>
              </View>

              <View className='bg-white mt-3 -z-10 '>
                <CharFieldDropDown options={dropdown}  placeholder="----------" focus={false} border={false} name='Available during Holidays' getValue={(value: string)=>setStartDate(value)}/>
              </View>

              <View className='flex flex-row justify-between -mt-2'>
                <View className='bg-white mt-3 w-[49%] -z-10'>
                  <CharFieldDropDown options={dropdown}  placeholder="----------" focus={false} border={false} name='Time Start' getValue={(value: string)=>setStartDate(value)}/>
                </View>
                <View className='bg-white mt-3 w-[49%] -z-10'>
                  <CharFieldDropDown options={dropdown}  placeholder="----------" focus={false} border={false} name='Time End' getValue={(value: string)=>setStartDate(value)}/>
                </View>
              </View>

              <View className='bg-white mt-1 -z-10'>
                <CharFieldDropDown options={dropdown}  placeholder="----------" focus={false} border={false} name='Total Number of Workers' getValue={(value: string)=>setStartDate(value)}/>
              </View>
              
            </View>

            <View className='flex flex-row mt-4'>
              <TouchableOpacity
              onPress={()=>{setTerms(!terms)}}
              className='mr-1'
              >
                  {terms? 
                      <Checkbox/>:
                      <View className='border border-gray-300 h-5 w-5 rounded-sm'>
                  
                      </View>
                  }
                        
              </TouchableOpacity>
              <Text
              style={{fontFamily: 'Inter-Regular'}}
              className='text-center text-[11px] text-gray-500'
              >
                I understand and agree with the <Link href="/registration" style={{fontFamily: 'Inter-SemiBold'}} className='text-custom-green'>Terms and Conditions</Link> 
              </Text>
          </View>

            <View className='w-[90%] mx-auto mb-16 mt-auto'>
              <TouchableOpacity
              onPress={()=>{router.push('/vendor/all_set')}}
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
        </View>
    )
}