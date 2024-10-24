import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Platform, Alert, Image, TextInput  } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import Logo from '../assets/images/Logo.svg';


export default function Registration(){
    const [isOpen, setIsOpen] = useState(false)
    const [countryCode, setCountryCode] = useState(['+234', '+1', '+500'])
    const [selectedCountryCode, setSelectedCountry] = useState('+234')
    const [inputValue, setInputValue] = useState('');

    return (
        <View 
        className='w-full h-full bg-white flex items-center'
        >
            <View className=' mt-10'>
              <Logo width={200} height={200} />
            </View>
            <Text
            style={{fontFamily: 'Inter-Black'}}
            className='text-custom-green text-lg -mt-8'
            >
              PickEAT PickIT
            </Text>

            <View className='flex flex-row justify-around items-center w-full p-5 space-x-3 mt-20'>
                <View>
                  <View className='flex flex-row justify-between items-center bg-gray-100 p-4 rounded-xl w-24'>
                    <Text 
                    style={{fontFamily: 'Inter-Medium'}}
                    className='text-[13px] text-center'
                    >
                      {selectedCountryCode}
                    </Text>
                    
                    <TouchableOpacity
                    onPress={() => setIsOpen(!isOpen)}
                    >
                      {
                        isOpen?
                        <FontAwesome name='chevron-up' size={12} color="#4b5563" className='border'/>
                        :
                        <FontAwesome name='chevron-down' size={12} color="#4b5563" className='border'/>
                      }
                     
                    </TouchableOpacity>
                  </View>
                    
                    {isOpen && (
                        <View className="dropdown-menu absolute mt-14 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                            {countryCode.map((item, index) => {
                                return(
                                    <View key={index} className="w-full flex justify-start px-4 py-2 hover:bg-gray-100 cursor-pointer">   
                                        {
                                            <TouchableOpacity
                                            onPress={() => setSelectedCountry(item)}
                                            className="transition-all duration-300 rounded-sm flex justify-center"
                                            >
                                                <Text 
                                                style={{fontFamily: 'Inter-Medium'}}
                                                className='mr-2'
                                                >
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                )
                            })}
                        </View>
                    )}
                </View>

                <View className='grow'>
                  <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`bg-gray-100 rounded-xl p-3 text-[13px]`}
                    onChangeText={setInputValue}
                    maxLength={10}
                    keyboardType="number-pad"
                    placeholder='Phone number'
                    placeholderTextColor="black"
                  />
                </View>
            </View> 

            <View className='w-[90%] mx-auto mt-60'>
              <Text
              style={{fontFamily: 'Inter-Medium'}}
              className='text-center text-[9px] text-gray-500 tracking-tighter'
              >
                By continuing you agree to our <Text className='text-custom-green'>Terms and condition</Text> and the <Text className='text-custom-green'>privacy policy.</Text> 
              </Text>

              <Link
              href={(inputValue.length == 10) ? {pathname: "/enter_code", params: {country_code: selectedCountryCode, phone_number: inputValue}} : "/registration"}
              style={{fontFamily: 'Inter-Regular'}}
              className={`text-center ${(inputValue.length == 10)? 'bg-custom-green' : 'bg-custom-inactive-green'} rounded-xl p-4 w-[90%] self-center mt-5 text-white`}
              >
                    Continue
              </Link>
            </View>
        </View>
    )
}