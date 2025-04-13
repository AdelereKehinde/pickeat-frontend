import React, { useState, useEffect, useContext, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity,StatusBar,ActivityIndicator, StyleSheet, Platform, Alert, Image, TextInput  } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from "expo-router";
import { useUser } from '@/context/UserProvider';
import Camera_ from '../../assets/icon/camera.svg';
import FaceCapture from '../../assets/icon/face-capture.svg';
import TitleTag from '@/components/Title';
import { TruncatedText } from '@/components/TitleCase';
import ENDPOINTS from '@/constants/Endpoint';
import { patchRequest, postRequest } from '@/api/RequestHandler';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Delay from '@/constants/Delay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import CaptureFace from '@/components/CaptureFace';
import ConnectionModal from '@/components/ConnectionModal';

export default function IdentityVerification(){
    const { user } = useUser();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    // const [description, setDescription] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [driverLicense, setDriverLicense] = useState<string | null>(null);
    const [face, setFace] = useState<string | null>(null);

    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 
    
    const validateInput = () =>{
      if(driverLicense && face && (additionalInfo !== '')){
        return true;
      }
      return false; 
    }

    const [openCamera, setOpenCamera] = useState(false);

    const pickImage = async (image: string) => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [5, 3.5],
        quality: 1,
      });
  
      if (!result.canceled) {
        (image == 'license')?
        setDriverLicense(result.assets[0].uri) 
        :
        setFace(result.assets[0].uri) 
      }
    };

    const handleRequest = async () => {
        try {
            if (validateInput()){
                setLoading(true)
                //PREPARE THE FORMDATA
                const formData = new FormData();
                const file1 = {
                uri: driverLicense,
                name: 'upload.jpg',
                type: 'image/jpeg',
                };
                const file2 = {
                uri: face,
                name: 'upload.jpg',
                type: 'image/jpeg',
                };
                if (Platform.OS === 'android') {
                formData.append('license', {
                    uri: file1.uri,
                    name: file1.name,
                    type: file1.type,
                } as any); 
                formData.append('face', {
                    uri: file2.uri,
                    name: file2.name,
                    type: file2.type,
                } as any);  
                } else {
                formData.append('license', file1 as any);
                formData.append('face', file2 as any);
                }
                formData.append('additional_info', additionalInfo);

                const updatedProfile = await postRequest(ENDPOINTS['rider']['identity'], formData, true, true);
                setLoading(false)
                Toast.show({
                type: 'success',
                text1: "Profile Updated Successfully.",
                visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
                });
                await Delay(1500)
                router.replace({
                pathname: '/rider/create_profile_2',
                }); 
            }
        } catch (error: any) {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: "An error occured",
                text2: error.data?.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
            setError(error.data?.data?.message || 'Unknown Error'); // Set error message
        }
    };

    return (
      <SafeAreaView>
        {/* Page requires intermet connection */}
        <ConnectionModal />
        {/* Page requires intermet connection */}

        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}
        >
            <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
              <TitleTag withprevious={true} title='Verify Identity' withbell={false}/>
            </View>

            <ScrollView className='px-4 w-full mt-4' contentContainerStyle={{ flexGrow: 1 }}>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 flex flex-row items-center`}>
                <TouchableOpacity
                onPress={()=>pickImage('license')}
                className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${driverLicense && 'border-2 border-custom-green'}`}>
                  {/* Image Preview */}
                  {driverLicense?
                    <Image 
                    source={{ uri: driverLicense }} 
                    style={{ width: 100, height: 100}} />
                    :
                    <View>
                      <Camera_/>
                      <Text
                      style={{fontFamily: 'Inter-SemiBold'}}
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[8px] text-center -mt-2`}
                      >
                        Choose{'\n'} Photo
                      </Text>
                    </View>
                  }
                </TouchableOpacity>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-Bold'}}
                  className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] `}
                  >
                    Upload a picture of your{`\n`}
                    Driver’s License
                  </Text>
                </View>
              </View>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 flex flex-row items-center mt-4`}>
              <TouchableOpacity
                onPress={()=>setOpenCamera(!openCamera)}
                className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${driverLicense && 'border-2 border-custom-green'}`}>
                  {/* Image Preview */}
                  {face?
                    <Image 
                    source={{ uri: face }} 
                    style={{ width: 100, height: 100}} />
                    :
                    <View className='flex flex-col items-center space-y-1'>
                      <FaceCapture />
                      <Text
                      style={{fontFamily: 'Inter-SemiBold'}}
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[8px] text-center`}
                      >
                        Take Photo
                      </Text>
                    </View>
                  }
                </TouchableOpacity>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[12px] text-custom-green'
                  >
                    Position your bare face {'\n'}
                    clearly in {'\n'}
                    the camera.
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[12px] text-gray-500'
                  >
                    No face mask or glasses
                  </Text>
                </View>
              </View>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 mt-10`}>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Additional Info
                </Text>
                <TextInput
                  onChangeText={setAdditionalInfo}
                  multiline={true}
                  numberOfLines={10}
                  style={{fontFamily: 'Inter-SemiBold'}}
                  placeholder="Please provide additional details if need be"
                  className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[12px] rounded-lg text-start`}
                  placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                />
              </View>

              
              <View className='w-[90%] mx-auto mb-10 mt-auto'>
                <TouchableOpacity
                  onPress={handleRequest}
                  className={`text-center ${(validateInput() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center mt-5 flex items-center justify-around`}
                  >
                    {loading && (
                    <View className='absolute w-full top-4'>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                    )}
                  
                    <Text
                      className='text-white'
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                      Continue
                    </Text>
                          
                </TouchableOpacity>
              </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
        {openCamera && <CaptureFace get_image={(image)=>{setFace(image)}} close={(value)=>{setOpenCamera(false)}} />}
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  shadow_box: {
    // iOS shadow properties
    shadowColor: '#1212126a',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    // Android shadow property
    elevation: 100,
  },
});