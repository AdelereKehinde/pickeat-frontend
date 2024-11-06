import { View, TextInput, Animated, Text, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import Success from '../assets/icon/success.svg';

interface Properties {
  main_text: string,
  sub_text: string,
  clickFunction: () => void
}

const Prompt: React.FC<Properties> = ({main_text, sub_text, clickFunction}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocus] = useState(false);

  return (
    <View className="absolute mb-4 w-full h-full flex items-center justify-around bg-transparent z-10" style={{backgroundColor: '#1212122b'}}>
      <View className='w-72 h-72 bg-white flex items-center justify-around px-2 py-4 rounded-3xl shadow-2xl'>
        <View>
          <Success/>
        </View>

        <Text
        style={{fontFamily: 'Inter-SemiBold'}}
        className='p-1 z-10 text-[15px] text-center'
        >
          {main_text}
        </Text>

        <Text
        style={{fontFamily: 'Inter-Medium'}}
        className='p-1 z-10 text-gray-400 text-[12px] text-center'
        >
          {sub_text}
        </Text>

        <TouchableOpacity 
          onPress={()=>{clickFunction()}}
          className='flex flex-row items-center px-8 py-2 rounded-lg bg-custom-green mt-5'>
            <Text
            className='text-white text-[12px] items-center'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Ok
            </Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default Prompt