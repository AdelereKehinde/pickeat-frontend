import { View, TextInput, Animated, Text,TouchableOpacity, StyleSheet, Modal, FlatList, Pressable, Image} from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Back from '../assets/icon/back_arrow.svg';
import Arrow from '../assets/icon/arrow_left.svg';
import ImageViewer from 'react-native-image-zoom-viewer';
import Out_Of_Bound from '../assets/icon/out_of_bound.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

type OptionType = {
    label: string;
    value: string | number;
  };

interface Properties {
  open: boolean,
  full_name: any,
  license: any,
  face: any,
  getValue: (value: boolean) => void
}

const LicenseModal: React.FC<Properties> = ({open,  getValue, full_name, license, face}) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

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
                <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} h-full flex flex-col items-center`}>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full flex items-start px-4 py-2`}>
                        <Pressable 
                        onPress={()=>{getValue(false)}}
                        className="">
                            {(theme == 'dark')?
                            <Arrow />
                            :
                            <Back />
                            }
                        </ Pressable>
                        
                    </View>
                    <View
                    className='flex flex-col items-center w-[100%] my-4'
                    >
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full py-2`}>
                            <Text 
                            className='text-custom-green text-[13px] mx-auto' 
                            style={{fontFamily: 'Inter-Bold'}}>
                               Driver's License
                            </Text>
                        </View>
                        <View className='overflow-hidden mt-2'>
                            <Image 
                            source={{uri: (license !== '')? license : license}}
                            className='w-40 h-40'
                            />
                        </View>
                        
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full py-2 mt-3`}>
                            <Text 
                            className='text-custom-green text-[13px] mx-auto' 
                            style={{fontFamily: 'Inter-Bold'}}>
                               Rider Face
                            </Text>
                        </View>
                        <View className='overflow-hidden mt-2'>
                            <Image 
                            source={{uri: (face !== '')? face : face}}
                            className='w-40 h-40'
                            />
                        </View>
                    </View>
                </View>
            </Modal>
    );
};

export default LicenseModal;