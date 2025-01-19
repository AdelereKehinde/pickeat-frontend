import { View, TextInput, Animated, Text,TouchableOpacity, StyleSheet, Modal, FlatList, Pressable} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Back from '../assets/icon/back_arrow.svg';
import Out_Of_Bound from '../assets/icon/out_of_bound.svg';

type OptionType = {
    label: string;
    value: string | number;
  };

interface Properties {
  open: boolean,
  user: string,
  getValue: (value: boolean) => void
}

const OutOfBound: React.FC<Properties> = ({open,  getValue, user='buyer'}) => {
    return (
            <Modal
            transparent={true}
            visible={open}
            animationType="slide" // Slides up from the bottom
            onRequestClose={()=>getValue(false)}
            >
                {/* Background Overlay */}
                {/* <TouchableOpacity
                className="flex-1 bg-black/40"
                onPress={()=>getValue(false)}
                /> */}
                
                {/* Modal Container */}
                <View className="bg-white h-full flex flex-col items-center">
                    <View className="w-full flex items-start bg-gray-100 px-4 py-2">
                        <Pressable 
                        onPress={()=>{getValue(false)}}
                        className="">
                            <Back />
                        </ Pressable>
                    </View>
                    <View
                    className='flex flex-col items-center my-auto'
                    >
                        <View>
                            <Out_Of_Bound />
                        </View>

                        <Text
                        className='text-custom-green text-[20px] mt-10'
                        style={{fontFamily: 'Inter-Bold'}}
                        >
                            Location Out of Bound
                        </Text>
                        <Text
                        className='text-gray-500 mt-2 text-center text-[12px] leading-4 w-[50%]'
                        style={{fontFamily: 'Inter-Medium'}}
                        >
                            {(user == 'buyer' && `We’re sorry we can’t make delivery to \n address entered`)}
                            {(user == 'vendor' && 'We’re sorry we can’t pickup from \n the address entered')}
                        </Text>
                    </View>
                </View>
            </Modal>
    );
};

export default OutOfBound