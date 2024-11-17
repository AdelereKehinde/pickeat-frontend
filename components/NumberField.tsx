import { View, TextInput, Animated, Text } from 'react-native';
import React, { useState, useRef } from 'react';

interface Properties {
  name: string,
  placeholder: string,
  focus: boolean,
  getValue: (value: string) => void
}

const PhoneNumber: React.FC<Properties> = ({name, placeholder, focus, getValue}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocus] = useState(false);

  return (
    <View className="mb-4">
      {/* Animated Label */}
      <Text
      style={{fontFamily: 'Inter-Medium'}}
      className='absolute left-2 p-1 top-1 z-10 text-gray-400 text-[13px]'
      >
        {name}
      </Text>

      {/* TextInput */}
      <TextInput
        style={{fontFamily: 'Inter-Regular'}}
        className={`${isFocused? 'border-custom-green border bg-white': 'border-gray-300 bg-gray-100'} rounded-xl px-3 py-2 pt-7 text-[14px]`}
        onFocus={()=>setIsFocus(true)}
        onBlur={()=>setIsFocus(false)}
        autoFocus={focus}
        onChangeText={getValue}
        defaultValue={inputValue}
        placeholder={placeholder}
        maxLength={11}
        keyboardType="number-pad"
        placeholderTextColor="black"
      />
    </View>
  );
};

export default PhoneNumber