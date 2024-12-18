import { View, TextInput, Animated, Text,TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

type OptionType = {
    label: string;
    value: string | number;
  };

interface Properties {
  name: string,
  placeholder: string,
  border: boolean,
  focus: boolean,
  options: OptionType[],
  setValue?: string,
  open: boolean,
  getValue: (value: string) => void
}

const CharFieldDropDown: React.FC<Properties> = ({name, placeholder, border, options, focus, setValue, open,  getValue}) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocus] = useState(false);

    const [isVisible, setIsVisible] = useState(open);
    const [selectedOption, setSelectedOption] = useState(''); 
    useEffect(() => {
        for(var i=0; i<options.length; i++){
            if(options[i].value == setValue){
                setInputValue(options[i].label + "")
                break
            }
        }
      }, [setValue]); // Empty dependency array ensures this runs only once (on mount/unmount)
    
    const handleSelect = (option:string, value:string|number) => {
        setSelectedOption(option);
        setIsVisible(false);
        setInputValue(option)
        getValue(""+value);
    };
    return (
        <View className="">
        {/* Animated Label */}
        {(name !== "") && (
            <Text
            style={{fontFamily: 'Inter-Medium'}}
            className='absolute left-2 p-1 top-0 -z-10 text-gray-400 text-[11px]'
            >
            {name}
            </Text>
        )}
            <View className='flex flex-row'>
                
                {/* TextInput */}
                <TextInput
                    style={{fontFamily: 'Inter-Regular'}}
                    className={`w-full pr-9 ${isFocused? 'border-custom-green border bg-white': `${border && ('border border-gray-300 bg-gray-100')}`} text-black rounded-xl px-3 py-2 ${(name !== "") && ('pt-4')} text-[14px]`}
                    onFocus={()=>setIsFocus(true)}
                    onBlur={()=>setIsFocus(false)}
                    autoFocus={focus}
                    onChangeText={getValue}
                    defaultValue={inputValue}
                    placeholder={placeholder}
                    placeholderTextColor="black"
                    readOnly={true}
                />
                <View 
                    // onPress={() => setIsVisible(!isVisible)} 
                    className={`absolute right-4 ${(name=='')? 'inset-y-4': 'inset-y-5'}  text-gray-400 w-5 h-5`}
                >   
                    <FontAwesome 
                    name={open ? 'chevron-up' : 'chevron-down'} 
                    size={14} 
                    color="#9ca3af" 
                    />
                </View>
            </View>
        
        {/* Dropdown list */}
        {open && (
            <GestureHandlerRootView style={styles.shadow_box} 
            className="absolute w-full top-10 z-50 border border-gray-300 rounded-md bg-white mt-2"
            >
                    <ScrollView
                    nestedScrollEnabled={false} 
                    showsVerticalScrollIndicator={true} 
                    // style={{ maxHeight: 200 }} 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    className='max-h-44'
                    >
                        {options.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleSelect(item.label, item.value)}
                                className="p-3 border-b border-gray-100"
                            >
                                <Text 
                                style={{fontFamily: 'Inter-Medium'}}
                                className="text-[12px] text-gray-600"
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
            </GestureHandlerRootView>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    shadow_box: {
      backgroundColor: 'white',
      // iOS shadow properties
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      // Android shadow property
      elevation: 50,
    },
  });

export default CharFieldDropDown