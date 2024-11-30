import { View, TextInput, Animated, Text } from 'react-native';
import React, { useState, useRef } from 'react';

interface Properties {
  name: string,
  placeholder: string,
  border: boolean,
  focus: boolean,
  getValue: (value: string) => void
}

const CharField: React.FC<Properties> = ({name, placeholder, border, focus, getValue}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocus] = useState(false);

  return (
    <View className="">
      {/* Animated Label */}
      {(name !== "") && (
        <Text
        style={{fontFamily: 'Inter-Medium'}}
        className='absolute left-2 p-1 top-1 z-10 text-gray-400 text-[13px]'
        >
          {name}
        </Text>
      )}

      {/* TextInput */}
      <TextInput
        style={{fontFamily: 'Inter-Regular'}}
        className={`${isFocused? 'border-custom-green border bg-white': `${border && ('border border-gray-300 bg-gray-100')}`} rounded-md px-3 py-2 ${(name !== "") && ('pt-7')} text-[14px]`}
        onFocus={()=>setIsFocus(true)}
        onBlur={()=>setIsFocus(false)}
        autoFocus={focus}
        onChangeText={getValue}
        keyboardType="number-pad"
        maxLength={11}
        defaultValue={inputValue}
        placeholder={placeholder}
        placeholderTextColor="black"
      />
    </View>
  );
};

export default CharField