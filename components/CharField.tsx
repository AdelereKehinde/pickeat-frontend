import { useContext } from 'react';
import { View, TextInput, Animated, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
  name: string,
  placeholder: string,
  border: boolean,
  focus: boolean,
  setValue?: string,
  readonly?: boolean,
  getValue: (value: string) => void
}

const CharField: React.FC<Properties> = ({name, placeholder, border, focus, setValue, readonly, getValue}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [inputValue, setInputValue] = useState(setValue);
  const [isFocused, setIsFocus] = useState(false);
  
  useEffect(() => {
    setInputValue(setValue)
  }, [setValue]); // Empty dependency array ensures this runs only once (on mount/unmount)
  
  return (
    <View className="">
      {/* Animated Label */}
      {(name !== "") && (
        <Text
        style={{fontFamily: 'Inter-Medium'}}
        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-400'} absolute left-2 p-1 top-1 z-10 text-[12px]`}
        >
          {name}
        </Text>
      )}

      {/* TextInput */}
      <TextInput
        style={{fontFamily: 'Inter-Regular'}}
        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-900'} ${isFocused? `border-custom-green border` : `${border && ('border border-gray-300')}`} rounded-md px-3 py-2 ${(name !== "") && ('pt-7')} text-[13px]`}
        onFocus={()=>setIsFocus(true)}
        onBlur={()=>setIsFocus(false)}
        autoFocus={focus}
        onChangeText={getValue}
        defaultValue={inputValue}
        readOnly={readonly? readonly:false}
        placeholder={placeholder}
        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
      />
    </View>
  );
};

export default CharField