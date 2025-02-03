import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, Modal, StyleSheet, StatusBar } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import { router, useGlobalSearchParams } from 'expo-router'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
const audioRecorderPlayer = new AudioRecorderPlayer();
import Arrow from '../../assets/icon/arrow_left.svg';
import RenderMessage from '@/components/RenderMessage';
import GetCurrentDateTime from '@/components/CurrentDateTime';
import { postRequest, getRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

const ChatPage: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {kitchen_id, name, avatar, chat_id} = useGlobalSearchParams()
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>('');
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState<boolean>(false);

  const [chatId, setChatId] = useState(Array.isArray(chat_id) ? ( chat_id[0]? chat_id[0]: 0) : (chat_id? chat_id : 0) )

  // Function to send a message
  const sendMessage = async() => {
    const randomDigit = Math.floor(Math.random() * 10);
    const inputHere = input
    if (input.trim()) {
      const { time, date } = GetCurrentDateTime();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: randomDigit, sender: true, text: input, time: time, date: date },
      ]);
      setInput('');

      if(chatId==0){
        type ApiResponse = {chat_id: number;}
        const response = await postRequest<ApiResponse>(`${ENDPOINTS['account']['chats-create']}`, {
          kitchen_id: kitchen_id,
          message: inputHere,
        }, true)
        setChatId(response.chat_id)
      }else{
        type ApiResponse = {chat_id: number;}
        const response = await postRequest<ApiResponse>(`${ENDPOINTS['account']['send-message']}`, {
          chat_id: chatId,
          message: inputHere,
        }, true)
      }
      
    }
  };

  const fetchMessagesFromBackend = async () => {
    try {
    const response = await getRequest<any>(`${ENDPOINTS['account']['chats']}/${chatId}/message`, true);
    // alert(JSON.stringify(response))
    await AsyncStorage.setItem((chatId + ""), JSON.stringify(response))
    setMessages(response)
    } catch (error) {
      // alert(error);
    } 
  };

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem((chatId + ""));
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));  // Set the cached messages
      }
    } catch (error) {
      console.log('Error retrieving messages:', error);
    }

    // Fetch real messages from the backend after initial load
    fetchMessagesFromBackend();
  };

  useEffect(() => {
    // alert(chatId)
    if (chatId != 0){
      loadMessages() 
      const intervalId = setInterval(() => {
        loadMessages();; // Fetch messages periodically
      }, 30000); // Poll every 5 seconds
  
      return () => clearInterval(intervalId); // Clean up on unmount
      
    }
  }, []); // Empty dependency array ensures this runs once

  // Function to pick an image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'image', content: result.assets[0].uri, id: Date.now().toString() },
      ]);
    }
  };

  // Function to handle recording
  const startRecording = async () => {
    try {
      await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording', e);
        return;
      });
    } catch (error) {
      console.log('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'audio', content: result, id: Date.now().toString() },
      ]);
    } catch (error) {
      console.log('Error stopping recording:', error);
    }
  };

  return (
    <SafeAreaView className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'}`} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
      <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-custom-green'} px-5 flex flex-row items-center py-2 space-x-3`}>
        <TouchableOpacity
        onPress={()=>{router.back()}}
        >
          <Arrow />
        </TouchableOpacity>
        <View className='w-12 h-22 overflow-hidden rounded-full'>
          <Image 
          source={{ uri: Array.isArray(avatar) ? avatar[0] : avatar }}
          className='w-12 h-12'
          />
        </View>
        <View className=''>
          <Text
          style={{fontFamily: 'Inter-Medium'}}
          className='text-white text-[13px]'
          >
            {name}
          </Text>
          <Text
          style={{fontFamily: 'Inter-Regular'}}
          className='text-white text-[11px]'
          >
            Last Seen: Online
          </Text>
        </View>
      </View>
      {/* Chat messages display */}

      <FlatList 
      data={messages}
      className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} pb-2 pt-2 px-4 mb-3`}
      renderItem={({item}) =>  (
        <RenderMessage id={item.id} sender={item.sender} text={item.text} time={item.time} date={item.date} /> 
      )}
      keyExtractor={item => item.id}
      />
      {/* {messages.map((item)=>(
        <RenderMessage id={item.id} sender={item.sender} text={item.text} time={item.time} date={item.date} /> 
      ))} */}

      {/* Input area */}
      <View
      className='flex flex-row items-center w-[90%] mx-auto mb-5'
      >
        <View 
        style={styles.shadow_box}
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} flex flex-row items-center px-2 rounded-2xl w-[85%]`}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="write a message..."
            style={{fontFamily: 'Inter-Medium', flex: 1, padding: 10, marginHorizontal: 10 }}
            className={`${theme == 'dark'? 'text-gray-100' : ' text-black'}`}
            placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
          />
          <TouchableOpacity onPress={() => setEmojiPickerVisible(true)}>
            <Ionicons name="happy-outline" size={30} color="gray" />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image-outline" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording}>
            <Ionicons name="mic-outline" size={30} color="gray" />
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity 
        className='ml-auto'
        onPress={sendMessage}>
          <Ionicons name="send" size={30} color="#228b22" />
        </TouchableOpacity>
      </View>

      {/* Emoji Picker */}
      <Modal visible={isEmojiPickerVisible} animationType="slide">
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setInput((prev) => prev + emoji);
            setEmojiPickerVisible(false);
          }}
          showSearchBar={true}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    shadow_box: {
      // iOS shadow properties
      shadowColor: '#6b7280',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      // Android shadow property
      elevation: 50,
    },
  });

export default ChatPage;
