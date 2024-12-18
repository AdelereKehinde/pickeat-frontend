import React, { useState } from 'react';
import { View, StatusBar, TextInput, ScrollView, TouchableOpacity, Text, Image, Modal } from 'react-native';
import Search from '../../../assets/icon/search.svg';
import ChatListCard from '@/components/ChatList';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatList: React.FC = () => {
  const [isFocused, setIsFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [chatFilter, setChatFilter] = useState('active');

  const Chats = [
    { id: '1', source: require('../../../assets/images/image24.jpg'), name:'Dianne Russell', time:"06:32 pm", message: 'I hope it goes well.', unread: 2 },
    { id: '2', source: require('../../../assets/images/image24.jpg'), name:'Theresa Webb', time:"06:32 pm", message: 'I hope it goes well.', unread: 1 },
    { id: '3', source: require('../../../assets/images/image24.jpg'), name:'Marvin McKinney', time:"06:32 pm", message: 'I hope it goes well.', unread: 0 },
    { id: '4', source: require('../../../assets/images/image24.jpg'), name:'Bessie Cooper', time:"06:32 pm", message: 'I hope it goes well.', unread: 0 },
    { id: '5', source: require('../../../assets/images/image24.jpg'), name:'Devon Lane', time:"06:32 pm", message: 'I hope it goes well.', unread: 0 },
    { id: '6', source: require('../../../assets/images/image24.jpg'), name:'Dianne Russell', time:"06:32 pm", message: 'I hope it goes well.', unread: 2 },
    { id: '7', source: require('../../../assets/images/image24.jpg'), name:'Theresa Webb', time:"06:32 pm", message: 'I hope it goes well.', unread: 1 },
    { id: '8', source: require('../../../assets/images/image24.jpg'), name:'Marvin McKinney', time:"06:32 pm", message: 'I hope it goes well.', unread: 2 },
    { id: '9', source: require('../../../assets/images/image24.jpg'), name:'Bessie Cooper', time:"06:32 pm", message: 'I hope it goes well.', unread: 3 },
    { id: '10', source: require('../../../assets/images/image24.jpg'), name:'Devon Lane', time:"06:32 pm", message: 'I hope it goes well.', unread: 0 },
];

  return (
    <SafeAreaView>
        <View className='bg-gray-100'>
            <StatusBar barStyle="light-content" backgroundColor="#228B22" />
            <View className='w-full px-4 py-3 relative flex flex-row items-center justify-center bg-white'>
                <View className='absolute left-6 z-10'>
                    <Search />
                </View>
                <TextInput
                    style={{fontFamily: 'Inter-Medium'}}
                    className={`w-full ${isFocused && 'border-custom-green border'} bg-gray-300 rounded-xl px-3 pl-10 py-2 text-[12px]`}
                    autoFocus={false}
                    onFocus={()=>setIsFocus(true)}
                    onBlur={()=>setIsFocus(false)}
                    onChangeText={setSearchValue}
                    defaultValue={searchValue}
                    placeholder="Search Messages"
                    placeholderTextColor=""
                />
            </View>
            <Text
            className='text-custom-green text-[16px] self-start pl-5 my-3'
            style={{fontFamily: 'Inter-SemiBold'}}
            >
                Messages
            </Text>

            <View className='flex flex-row w-full bg-blue-100'>
                <TouchableOpacity
                onPress={()=>{setChatFilter('active')}}
                className={`grow ${(chatFilter == 'active') && 'bg-custom-green'}`}
                >
                    <Text
                    className={`${(chatFilter == 'active')? 'text-white':'text-gray-500'} text-[12px] text-center p-3`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Active Bookings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{setChatFilter('pending')}}
                className={`grow ${(chatFilter == 'pending') && 'bg-custom-green'}`}
                >
                    <Text
                    className={`${(chatFilter == 'pending')? 'text-white':'text-gray-500'} text-[12px] text-center p-3`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Pending Bookings
                    </Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView className='w-full mb-48' contentContainerStyle={{ flexGrow: 1 }}>
                {Chats.map((item) => (
                    <View key={item.id} className='w-full'>
                        <ChatListCard image={item.source} name={item.name} time={item.time} message={item.message} unread={item.unread}/>
                    </View>
                ))}
            </ScrollView>
        
        </View>
    </SafeAreaView>
  );
};

export default ChatList;
