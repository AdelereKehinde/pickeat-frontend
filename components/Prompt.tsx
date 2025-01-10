import { View, TextInput, Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import Success from '../assets/icon/success.svg';
import Done from '../assets/icon/done.svg';

interface Properties {
  main_text: string,
  sub_text: string,
  estimated_time: string,
  order_id: string,
  clickFunction: () => void
}

const Prompt: React.FC<Properties> = ({main_text, sub_text, order_id, estimated_time, clickFunction}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocus] = useState(false);

  return (
    <View className="absolute mb-4 w-full h-full flex items-center justify-around bg-transparent z-10" style={{backgroundColor: '#1212122b'}}>
      <View 
      style={styles.shadow_box}
      className='w-72 h-80 bg-white flex items-center justify-around px-2 py-6 rounded-3xl shadow-2xl'>
        <Text
        style={{fontFamily: 'Inter-SemiBold'}}
        className='p-1 z-10 text-[12px] text-center'
        >
          {(main_text == '')? 'Your order was placed successfully' : main_text}
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

        <Text
        style={{fontFamily: 'Inter-Medium'}}
        className='p-1 z-10 text-custom-green text-[12px] text-center'
        >
          {(sub_text == '')? 'Screenshot and show this code to the rider' : sub_text}
        </Text>

        {(estimated_time !== '') && 
          <Text
          style={{fontFamily: 'Inter-Medium'}}
          className='p-1 z-10 text-gray-500 text-[12px] text-center'
          >
            Your order should be delivered to you {estimated_time} from now.
          </Text>
        }

        <TouchableOpacity 
          onPress={clickFunction}
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

export default Prompt