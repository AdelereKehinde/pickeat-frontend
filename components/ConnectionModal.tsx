// src/components/ConnectionModal.tsx
import React from 'react';
import { Modal, View, Text } from 'react-native';
import { ConnectionContext } from '@/context/ConnectionProvider';// Import context
import Out_Of_Bound from '../assets/icon/out_of_bound.svg';

const ConnectionModal: React.FC = () => {
  const { isConnected } = React.useContext(ConnectionContext);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isConnected === false} // Only visible when disconnected
    >
      <View className="flex-1 bg-white justify-center items-center">
        <View>
          <Out_Of_Bound />
        </View>
        <View className="bg-gray-100 rounded-xl items-center">
          <Text 
          style={{fontFamily: 'Inter-Medium'}}
          className=" text-gray-800 p-4">
            {isConnected === null ? "🤔 Checking connection..." : "🚫 No internet connection"}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ConnectionModal;
