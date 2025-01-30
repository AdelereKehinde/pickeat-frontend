import React, { useState, useEffect, useContext } from 'react';
import { router } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageRead from '../assets/icon/message_read.svg';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

type Messages = { id: number; chat: number; text: string; time: string; date: string;}
interface Properties {
    id: number;
    image:any,
    name: string,
    time: string,
    message: string,
    messages: Messages[],
    unread: string | number,
  }

const ChatListCard: React.FC<Properties> = ({id, image, name, message, time, messages, unread}) =>{
    const { theme, toggleTheme } = useContext(ThemeContext);

    const OpenChatPage = async() =>{
        try {
            await AsyncStorage.setItem((id + ""), JSON.stringify(messages));  // Save messages for chat
            // alert(JSON.stringify(messages))
            router.push(`/vendor/chat_page?chat_id=${id}&name=${name}&avatar=${image}`)

          } catch (error) {
            console.log('Error saving messages:', error);
          }
    }
    return(
        <View className={`${theme == 'dark'? 'border-gray-800' : 'border-gray-200'} flex flex-row items-center py-3 border-b-1 w-full border-b`}>
            <TouchableOpacity
            onPress={OpenChatPage}
            className='flex flex-row items-center justify-between w-full px-4 space-x-2'
            >
                  
                    <Image 
                    source={{uri: image}}
                    className='w-14 h-14 rounded-full'
                    />

                <View className='w-[50%]'>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[12px]`}
                    >
                        {name}
                    </Text>
                    <View className='flex flex-row mt-2 items-center space-x-1'>
                        {(unread==0) && (
                            <MessageRead />
                        )}
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-gray-400'
                        >
                            {message}
                        </Text>
                    </View>
                </View>

                <View className=''>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className=' text-[11px] text-custom-green'
                    >
                        {time}
                    </Text>
                    {(unread !== 0) && (
                        <View className='w-7 h-4 mt-3 flex justify-around items-center bg-custom-green rounded-full'>
                        <Text
                        style={{fontFamily: 'Inter-Bold'}}
                        className=' text-[10px] text-white'
                        >
                            {unread}
                        </Text>
                    </View>
                    )}
                    
                </View>
            </TouchableOpacity>
            
        </View>
    )
}

export default ChatListCard;