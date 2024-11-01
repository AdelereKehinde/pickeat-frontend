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
    <View className="mb-4">
      
      <View>
        <Success/>
      </View>

      <Text
      style={{fontFamily: 'Inter-Medium'}}
      className='absolute left-2 p-1 top-1 z-10 text-gray-400 text-[13px]'
      >
        {main_text}
      </Text>

      <Text
      style={{fontFamily: 'Inter-Medium'}}
      className='absolute left-2 p-1 top-1 z-10 text-gray-400 text-[13px]'
      >
        {sub_text}
      </Text>

      <TouchableOpacity 
        onPress={()=>{}}
        className='flex flex-row items-center px-4 py-2 rounded-lg bg-gray-100 my-auto'>
            <Text
            className='text-custom-green text-[11px]'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                OK
            </Text>
        </TouchableOpacity>
    </View>
  );
};

export default Prompt