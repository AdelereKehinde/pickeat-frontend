import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ScrollView, TouchableOpacity,StatusBar,ActivityIndicator, StyleSheet, Platform, Alert, Image, TextInput  } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Link, router } from "expo-router";
import { useUser } from '@/context/UserProvider';
import Camera from '../../assets/icon/camera.svg';
import TitleTag from '@/components/Title';
import { TruncatedText } from '@/components/TitleCase';
import ENDPOINTS from '@/constants/Endpoint';
import { patchRequest } from '@/api/RequestHandler';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import Delay from '@/constants/Delay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ConnectionModal from '@/components/ConnectionModal';

export default function AccountSetup2(){
    const { user } = useUser();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [description, setDescription] = useState('')
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [document, setDocument] = useState<string | null>(null);

    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error state 
    
    const validateInput = () =>{
      if((description !== '') && (additionalInfo !== '')){
        return true;
      }
      return false; 
    }

    const pickImage = async (image: string) => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [5, 5],
        quality: 1,
      });
  
      if (!result.canceled) {
        (image == 'profile')?
        setProfilePhoto(result.assets[0].uri) 
        :
        setDocument(result.assets[0].uri) 
      }
    };

    const handleRequest = async () => {
      try {
        setLoading(true)
        //PREPARE THE FORMDATA
        const formData = new FormData();
        const file1 = {
          uri: profilePhoto,
          name: 'upload.jpg',
          type: 'image/jpeg',
        };
        const file2 = {
          uri: document,
          name: 'upload.jpg',
          type: 'image/jpeg',
        };
        if (Platform.OS === 'android') {
          formData.append('avatar', {
            uri: file1.uri,
            name: file1.name,
            type: file1.type,
          } as any); 
          formData.append('document', {
            uri: file2.uri,
            name: file2.name,
            type: file2.type,
          } as any);  
        } else {
          formData.append('avatar', file1 as any);
          formData.append('document', file2 as any);
        }
        // Append additional fields
        formData.append('description', description);
        formData.append('additional_info', additionalInfo);

        const updatedProfile = await patchRequest(ENDPOINTS['vendor']['onboard'], formData, true, true);
        setLoading(false)
        Toast.show({
          type: 'success',
          text1: "Profile Updated Successfully.",
          visibilityTime: 4000, // time in milliseconds (5000ms = 5 seconds)
          autoHide: true,
        });
        // await Delay(3000)
        router.replace({
          pathname: '/vendor/account_setup_3',
        }); 
        
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
        <View 
        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full h-full flex items-center`}
        >
            <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
            <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
              <TitleTag withprevious={true} title='Create Profile' withbell={false}/>
            </View>

            {/* Page requires intermet connection */}
            <ConnectionModal />
            {/* Page requires intermet connection */}

            <ScrollView className='px-4 w-full mt-4' contentContainerStyle={{ flexGrow: 1 }}>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 flex flex-row items-center`}>
              <TouchableOpacity
                onPress={()=>pickImage('profile')}
                className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${profilePhoto && 'border-2 border-custom-green'}`}>
                  {/* Image Preview */}
                  {profilePhoto?
                    <Image 
                    source={{ uri: profilePhoto }} 
                    style={{ width: 100, height: 100}} />
                    :
                    <View>
                      <Camera/>
                      <Text
                      style={{fontFamily: 'Inter-SemiBold'}}
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[8px] text-center -mt-2`}
                      >
                        Upload{'\n'} Profile Photo
                      </Text>
                    </View>
                  }
                </TouchableOpacity>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-Bold'}}
                  className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[10px] mt-2`}
                  >
                    {TruncatedText(user?.store_name || "No name", 20) }
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-Bold'}}
                  className='text-[12px] text-custom-green -mt-1'
                  >
                    Restaurant
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[10px] mt-2`}
                  >
                    {user?.email || "No email"}
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[10px] text-custom-green -mt-1'
                  >
                    {user?.phone_number || "No number"}
                  </Text>
                </View>
              </View>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 flex flex-row items-center mt-4`}>
              <TouchableOpacity
                onPress={()=>pickImage('document')}
                className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${profilePhoto && 'border-2 border-custom-green'}`}>
                  {/* Image Preview */}
                  {document?
                    <Image 
                    source={{ uri: document }} 
                    style={{ width: 100, height: 100}} />
                    :
                    <View>
                      <Camera/>
                      <Text
                      style={{fontFamily: 'Inter-SemiBold'}}
                      className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-700'} text-[8px] text-center -mt-2`}
                      >
                        Upload{'\n'} Document
                      </Text>
                    </View>
                  }
                </TouchableOpacity>
                <View  className='ml-4'>
                  <Text
                  style={{fontFamily: 'Inter-SemiBold'}}
                  className='text-[11px] text-custom-green'
                  >
                    Upload store cover photo
                  </Text>
                  <Text
                  style={{fontFamily: 'Inter-Medium'}}
                  className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[10px]`}
                  >
                    Allowed format{'\n'}
                    {' '} - Jpeg/jpg{'\n'}
                    {' '} - Png{'\n'}
                    {' '} - webp{'\n'}
                    Less than 5mb
                  </Text>
                </View>
              </View>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 mt-4`}>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Business Description
                </Text>
                <TextInput
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={5}
                  style={{fontFamily: 'Inter-SemiBold'}}
                  placeholder="Kindly Provide details below"
                  className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[12px] rounded-lg text-start`}
                  placeholderTextColor={(theme == 'dark')? '#9ca3af':'#1f2937'}
                />
              </View>

              <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full rounded-lg p-4 mt-4`}>
                <Text
                style={{fontFamily: 'Inter-SemiBold'}}
                className='text-[12px] text-custom-green -mt-2 border-b border-custom-green'
                >
                  Additional Info
                </Text>
                <TextInput
                  onChangeText={setAdditionalInfo}
                  multiline={true}
                  numberOfLines={5}
                  style={{fontFamily: 'Inter-SemiBold'}}
                  placeholder="Please provide additional details if need be"
                  className={`${theme == 'dark'? 'text-gray-200' : 'text-gray-900'} text-[12px] rounded-lg text-start`}
                  placeholderTextColor={(theme == 'dark')? '#9ca3af':'#1f2937'}
                />
              </View>

              
              <View className='w-[90%] mx-auto mb-16 mt-3'>
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