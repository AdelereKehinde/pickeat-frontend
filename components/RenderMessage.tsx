import React from 'react';
import { View, Text, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Properties {
    id:number,
    text: string,
    sender: boolean,
    time: string,
    date: string,
  }

const RenderMessage: React.FC<Properties> = ({id, text, sender, time, date}) => {
  return (
    <View className="mb-3">
      {/* Message Bubble */}
      <View
        className={`px-4 py-3 rounded-xl max-w-3/4 ${
          sender ? 'self-end bg-custom-green' : 'self-start bg-gray-200'
        }`}
      >
        <Text 
        style={{fontFamily: 'Inter-Regular'}}
        className={`text-[13px] ${sender ? 'text-white' : 'text-black'}`}>
            {text}
        </Text>
        {/* Time and Date */}
        <Text
            style={{fontFamily: 'Inter-Regular'}}
            className={`text-[10px] mt-1 self-end ${
            sender ? ' text-white' : 'self-start text-gray-500'
            }`}
        >
            {time} · {date}
        </Text>
      </View>
    </View>
  );
};
export default RenderMessage