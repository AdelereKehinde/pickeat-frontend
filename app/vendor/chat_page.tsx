import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, Modal } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const audioRecorderPlayer = new AudioRecorderPlayer();

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>('');
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState<boolean>(false);

  // Function to send a message
  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'text', content: input, id: Date.now().toString() },
      ]);
      setInput('');
    }
  };

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
    <View style={{ flex: 1 }}>
      {/* Chat messages display */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            {item.type === 'text' && (
              <Text style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 }}>
                {item.content}
              </Text>
            )}
            {item.type === 'image' && (
              <Image source={{ uri: item.content }} style={{ width: 150, height: 150, borderRadius: 10 }} />
            )}
            {item.type === 'audio' && (
              <TouchableOpacity onPress={() => audioRecorderPlayer.startPlayer(item.content)}>
                <Ionicons name="play-circle-outline" size={40} color="blue" />
              </TouchableOpacity>
            )}
          </View>
        )}
        style={{ flex: 1, paddingHorizontal: 10 }}
      />

      {/* Input area */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => setEmojiPickerVisible(true)}>
          <Ionicons name="happy-outline" size={30} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image-outline" size={30} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording}>
          <Ionicons name="mic-outline" size={30} color="gray" />
        </TouchableOpacity>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={{ flex: 1, borderColor: '#ddd', borderWidth: 1, borderRadius: 20, padding: 10, marginHorizontal: 10 }}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={30} color="blue" />
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
    </View>
  );
};

export default ChatPage;
