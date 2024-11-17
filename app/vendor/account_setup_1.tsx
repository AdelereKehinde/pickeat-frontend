import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity,StatusBar, ScrollView, Platform, Alert, Image, TextInput  } from "react-native";
import { Link, router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Notice from '../../assets/icon/notice.svg';
import Checkbox from '../../assets/icon/checkbox.svg';
import Skip from '@/components/Skip';
import CharField from '@/components/CharField';
import CharFieldDropDown from '@/components/CharFieldDropdown';
import TitleTag from '@/components/Title';


export default function AccountSetup1(){
    const [firstName, setFirstName] = useState('')
    const [terms, setTerms] = useState(false)

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
        className='w-full h-full bg-white flex items-center'
        >
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />

            <TitleTag withprevious={false} title='Create Profile' withbell={false}/>

            <ScrollView className='pl-3 pr-4'>
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
                className='flex w-full mt-3 space-y-2'
                >
                    <View>
                        <CharField  placeholder="Business Name*" focus={true} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                        <CharField  placeholder="How do you want to address?" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                        <CharField  placeholder="Full Name*" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                        <CharFieldDropDown options={dropdown}  placeholder="Years of Experience" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                </View>

                <View
                className='w-full flex flex-row items-center p-3 mt-5 rounded-lg bg-blue-100'
                >
                    <Notice/>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-custom-green ml-2 text-[11px]'
                    >
                    All necessary info will be sent to business contact provided below
                    </Text>
                </View>

                <View
                className='flex w-full mt-3 space-y-1'
                >   
                    <View>
                        <CharField  placeholder="Business mail*" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                        <CharField  placeholder="Selected Country Region(Nigeria)" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View className='flex flex-row'>
                        <View className='rounded-md w-12 bg-gray-100 h-12 flex items-center justify-around mr-2 border border-gray-300'>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className='text-gray-600 text-[11px] text-center'
                            >
                                +234
                            </Text>
                        </View>
                        <View className='grow'>
                            <CharField  placeholder="Business Phone Number" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                        </View>
                    </View>
                </View>

                <View
                className='w-full flex flex-row items-center p-3 mt-5 rounded-lg bg-blue-100'
                >
                    <Notice/>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-custom-green ml-2 text-[11px]'
                    >
                    All details you provided must be true, accurate and non-misleading. In the event you provided wrong information, you shall be held liable for such misconduct
                    </Text>
                </View>

                <View
                className='flex w-full mt-3 space-y-1'
                >   
                    <View>
                        <CharFieldDropDown options={dropdown}  placeholder="Profession*" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                        <CharFieldDropDown options={dropdown}  placeholder="Category*" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                    <View>
                        <CharFieldDropDown options={dropdown}  placeholder="You work alone?" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
                    </View>
                </View>


                <View
                className='w-full flex flex-row items-center p-3 mt-5 rounded-lg bg-blue-100'
                >
                    <Notice/>
                    <Text
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-custom-green ml-2 text-[11px]'
                    >
                    In order to make points and benefits from PickEat {'\n'}PickIt please enter your membership ID
                    </Text>
                </View>

                <View
                className='flex w-full mt-3 space-y-1'
                >   
                    <View>
                        <CharField  placeholder="Membership ID/Promo Code" focus={false} border={true} name='' getValue={(value: string)=>setFirstName(value)}/>
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
                        I understand and agree with the <Link href="/registration" style={{fontFamily: 'Inter-SemiBold'}} className='text-gray-800'>Terms and Conditions</Link> 
                    </Text>
                </View>

                <View className='w-[90%] mx-auto mb-16 mt-3'>
                <TouchableOpacity
                onPress={()=>{router.push('/vendor/account_setup_2')}}
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
            </ScrollView>
        </View>
    )
}