import { View, TextInput, Animated, Text } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
  name: string,
  placeholder: string,
  border: boolean,
  focus: boolean,
  setValue?: string,
  getValue: (value: string) => void
}

const PhoneNumber: React.FC<Properties> = ({name, placeholder, border, focus, setValue, getValue}) => {
  const [inputValue, setInputValue] = useState(setValue);
  const [isFocused, setIsFocus] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    setInputValue(setValue)
  }, [setValue]); // Empty dependency array ensures this runs only once (on mount/unmount)

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
        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-900'} ${isFocused? `border-custom-green border` : `${border && ('border border-gray-300 bg-gray-100')}`} rounded-md px-3 py-2 ${(name !== "") && ('pt-7')} text-[13px]`}
        onFocus={()=>setIsFocus(true)}
        onBlur={()=>setIsFocus(false)}
        autoFocus={focus}
        onChangeText={getValue}
        keyboardType="number-pad"
        maxLength={11}
        value={inputValue}
        // defaultValue={inputValue}
        placeholder={placeholder}
        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
      />
    </View>
  );
};

export default PhoneNumber