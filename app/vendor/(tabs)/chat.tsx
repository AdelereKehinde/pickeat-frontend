import React, { useState, useEffect } from 'react';
import { View, StatusBar, TextInput, ScrollView, TouchableOpacity, Text, Image, Modal } from 'react-native';
import Search from '../../../assets/icon/search.svg';
import Empty from '../../../assets/icon/empty_chat.svg';
import ChatListCard from '@/components/ChatList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useGlobalSearchParams } from 'expo-router';
import { getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import { useIsFocused } from '@react-navigation/native';

const ChatList: React.FC = () => {
    const [isFocused, setIsFocus] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [chatFilter, setChatFilter] = useState('all');

    const [loading, setLoading] = useState(false);
    const [ranOnce, setRanOnce] = useState(false);
    type Messages = { id: number; chat: number; text: string; time: string; date: string;};
    type ApiResponse = { id: number; avatar: string; name: string; unread: number; messages: Messages[]}[];
    const [chats, setChats] = useState<ApiResponse>([]);

    const isFocusedd = useIsFocused();
    const fetchMeals = async () => {
        try {
            setLoading(true)
            const response = await getRequest<ApiResponse>(`${ENDPOINTS['account']['chats']}`, true);
            setRanOnce(true)
            // alert(JSON.stringify(response))
            // alert('yh')
            setChats(response)
            setLoading(false) 
        } catch (error) {
            setLoading(false)
            // alert(error);
        }  
    };


    useEffect(() => {
        fetchMeals();
        const intervalId = setInterval(() => {
            fetchMeals();; // Fetch messages periodically
        }, 30000); // Poll every 5 seconds
      
        return () => clearInterval(intervalId); // Clean up on unmount
    }, [isFocusedd]); // Empty dependency array ensures this runs once

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
                onPress={()=>{setChatFilter('all')}}
                className={`grow ${(chatFilter == 'all') && 'bg-custom-green'}`}
                >
                    <Text
                    className={`${(chatFilter == 'all')? 'text-white':'text-gray-500'} text-[12px] text-center p-3`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        All Messages
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{setChatFilter('unread')}}
                className={`grow ${(chatFilter == 'unread') && 'bg-custom-green'}`}
                >
                    <Text
                    className={`${(chatFilter == 'unread')? 'text-white':'text-gray-500'} text-[12px] text-center p-3`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Unread Messages
                    </Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView className='w-full mb-80' contentContainerStyle={{ flexGrow: 1 }}>
                {(chatFilter == 'unread')?
                    (chats.filter(item => item.unread > 0).length == 0 && !loading) && (
                        <View className='mx-auto'>
                            <Empty />
                        </View>
                    )
                :
                    (chats.length == 0 && !loading) && (
                        <View className='mx-auto'>
                            <Empty />
                        </View>
                    )
                }
                
                {(chats.length == 0 && loading &&  !ranOnce) && (
                    <View className='mx-auto mt-12'>
                        <Text
                        className={`text-[12px] text-center p-3`}
                        style={{fontFamily: 'Inter-Medium-Italic'}}
                        >
                            Loading messages...
                        </Text>
                    </View>
                )}

                {(chatFilter == 'unread')?
                    chats.filter(item => item.unread > 0).map((item) => (
                        <View key={item.id} className='w-full'>
                            <ChatListCard id={item.id} image={item.avatar} name={item.name} time={item.messages[item.messages.length - 1].time} message={item.messages[item.messages.length - 1].text} messages={item.messages} unread={item.unread}/>
                        </View>
                    ))
                :
                    chats.map((item) => (
                        <View key={item.id} className='w-full'>
                            <ChatListCard id={item.id} image={item.avatar} name={item.name} time={item.messages[item.messages.length - 1].time} message={item.messages[item.messages.length - 1].text} messages={item.messages} unread={item.unread}/>
                        </View>
                    ))
                }
            </ScrollView>
        
        </View>
    </SafeAreaView>
  );
};

export default ChatList;
