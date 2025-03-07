import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Back from '../assets/icon/back_arrow.svg';

interface Properties {
  get_image: (image: any) => void;
  close: (value: boolean) => void;
}

const CaptureFace: React.FC<Properties> = ({ get_image, close }) => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Camera permissions check
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-center pb-2">We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-500 p-2 rounded">
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Toggle camera (front/back)
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Capture the image from the camera
  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // Sending the captured image back to the parent component
        get_image(photo?.uri);
        close(true)
      } catch (error) {
        Alert.alert('Error', 'There was an error capturing the image.');
      }
    }
  };

  return (
    <View className="absolute w-full h-full flex-1 justify-center items-center">
        <View className="flex flex-row justify-between h-12 items-center bg-white w-full">
                <View className="w-6 h-6 flex items-end justify-around ml-5">
                    <Pressable 
                    onPress={()=>{close(true)}}
                    className="">                
                        <Back />     
                    </ Pressable>
                </View>

                <Text
                style={{fontFamily: 'Inter-SemiBold'}} 
                className={`text-gray-700 text-[14px] `}
                >
                    Face Capture
                </Text>
                
                <View className="mr-5 w-6 h-6 flex items-end justify-around">
                </View>
        </View>
      <CameraView
        style={{ flex: 1, width: '100%' }} // Ensures camera takes up full screen
        facing={facing}
        ref={cameraRef}
      >
        <View className="absolute bottom-10 w-full flex-row justify-between px-4">
          <TouchableOpacity
            className='p-2 bg-gray-300 rounded-lg'
            onPress={toggleCameraFacing}
          >
            <Text 
            style={{fontFamily: 'Inter-Medium'}}
            className="text-gray-800 text-[14px]">
                Flip Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='py-2 px-4 rounded-lg bg-custom-green'
            onPress={captureImage}
          >
            <Text 
            style={{fontFamily: 'Inter-SemiBold'}} 
            className="text-white text-[14px]">Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CaptureFace;
