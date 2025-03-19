import { View, TextInput, Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react';
import Success from '../assets/icon/success.svg';
import Done from '../assets/icon/done.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

interface Properties {
  order_id: string,
  clickFunction: () => void
}

const RiderCompleteOrderPrompt: React.FC<Properties> = ({order_id, clickFunction}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocus] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View className="absolute mb-4 w-full h-full flex items-center justify-around  z-10" style={{backgroundColor: '#00000080'}}>
      <View 
      style={styles.shadow_box}
      className={`${theme == 'dark'? 'bg-gray-700' : ' bg-white'} w-72 h-80 flex items-center justify-around px-2 py-6 rounded-3xl shadow-2xl`}>
        <Text
        style={{fontFamily: 'Inter-SemiBold'}}
        className={`${theme == 'dark'? 'text-white' : ' text-black'} p-1 z-10 text-[12px] text-center`}
        >
            This action can only be done by the buyer
        </Text>

        <View>
          <Success/>
        </View>

        {(order_id !== '') && 
          <Text
          style={{fontFamily: 'Inter-Bold'}}
          className='p-1 z-10 text-custom-green text-[18px] text-center'
          >
            {order_id}
          </Text>
        }

        {/* <Text
        style={{fontFamily: 'Inter-Medium'}}
        className='p-1 z-10 text-custom-green text-[12px] text-center'
        >
          This action can only be done by the buyer
        </Text> */}

        <Text
        style={{fontFamily: 'Inter-Medium'}}
        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} p-1 z-10 text-[12px] text-center`}
        >
            Kindly ensure that the buyer complete this order on delivery in other to get the delivery fee allocated to you.
        </Text>

        <TouchableOpacity 
          onPress={clickFunction}
          className='flex flex-row items-center px-8 py-2 rounded-lg bg-custom-green mt-5'>
            <Text
            className='text-white text-[12px] items-center'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Got it?
            </Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
    shadow_box: {
      // iOS shadow properties
      shadowColor: '#1212126a',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      // Android shadow property
      elevation: 10,
    },
});

export default RiderCompleteOrderPrompt