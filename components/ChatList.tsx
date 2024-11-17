import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity } from "react-native";
import Rating from '../assets/icon/rating.svg';
import Heart from '../assets/icon/heart.svg';
import Time from '../assets/icon/time.svg';
import MessageRead from '../assets/icon/message_read.svg';

interface Properties {
    image:any,
    name: string,
    time: string,
    message: string,
    unread: string | number,
  }

const ChatListCard: React.FC<Properties> = ({image, name, message, time, unread}) =>{
    return(
        <View className='flex flex-row items-center py-3 border-b-1 border-gray-200 bg-white w-full border'>
            <TouchableOpacity
            onPress={()=>{}}
            className='flex flex-row w-full px-2'
            >
                <View className='rounded-full overflow-hidden w-[50px] h-[50px]'>    
                    <Image 
                    source={image}
                    className=''
                    width={100}
                    />
                </View>

                <View className='flex justify-start ml-4 w-[45%]'>
                    <Text
                    style={{fontFamily: 'Inter-Bold'}}
                    className=' text-[12px] text-gray-800'
                    >
                        {name}
                    </Text>
                    <View className='flex flex-row mt-2 items-center'>
                        {(unread==0) && (
                            <MessageRead />
                        )}
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className=' text-[11px] text-gray-400 ml-2'
                        >
                            {message}
                        </Text>
                    </View>
                </View>

                <View className='flex justify-start items-end ml-auto'>
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