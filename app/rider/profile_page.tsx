import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest, patchRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import ToggleOn from '../../assets/icon/toggle_on.svg'
import ToggleOff from '../../assets/icon/toggle_off.svg'
import Location from '../../assets/icon/location_highlight.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from '@/components/FullScreenLoader';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { TruncatedText } from '@/components/TitleCase';
import ConnectionModal from '@/components/ConnectionModal';

export default function ProfilePage(){
    const { setUser } = useUser();
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);

    type APIResponse = {
        first_name: string; last_name: string; email: string; avatar: string; state: string; range: string; address: string; phone_number: string;
    }; 

    const [resData, setResData] = useState<APIResponse>({
        first_name: '',
        last_name: '',
        email: '',
        avatar: '',
        state: '',
        range: '',
        address: '',
        phone_number: ''
    });

    const updateKey = <K extends keyof APIResponse>(key: K, value: APIResponse[K]) => {
        setResData((prev) => ({
          ...prev,
          [key]: value,
        }));
    };

    const [firstName, setFirstName] = useState('');
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/ddl2pf4qh/image/upload/v1629388876/fintrak/FinProfile_no9nb1.png');
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('');
    const [riderState, setRiderState] = useState('');
    const [range, setRange] = useState('');

    const [activeStatus, setActiveStatus] = useState(false)
    const checkActiveStatus = async () => {
        const pushNoti = await AsyncStorage.getItem('rider_active_status');
        if (pushNoti){
            setActiveStatus(eval(pushNoti)); // Show onboarding if the key doesn't exist
        }
    };
    const ToggleActiveStatus = async () => {
        // Set a flag to indicate the user has completed onboarding
        if (activeStatus){
            await AsyncStorage.setItem('rider_active_status', 'false');
        }else{
            await AsyncStorage.setItem('rider_active_status', 'true');
        }
        setActiveStatus(!activeStatus)
        const res = await postRequest(ENDPOINTS['rider']['toggle-active-status'], {}, true);
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['rider']['profile']}`, true);
                setFirstName(response.first_name)
                setLastName(response.last_name)
                setPhoneNumber(response.phone_number)
                setEmail(response.email)
                setAvatar(response.avatar)
                setRange(response.range)
                setRiderState(response.state)

                setResData(response)
                setLoading(false) 
                // alert(JSON.stringify(response))
            } catch (error) {
                // alert(error);
                setLoading(false) 
            }
        };
    
        fetchInformation(); 
        checkActiveStatus()
    }, [isFocused]); 

    const validateInput = (field:string) =>{
        switch (field) {
            case 'first_name':
                return (firstName !== resData?.first_name)
            case 'last_name':
                return (lastName !== resData?.last_name)
            case 'phone_number':
                return (phoneNumber !== resData?.phone_number)
            default:
                return false;
        }
    }

    const handleUpdate = async (field: string) => {
        try {
          if(!loading && validateInput(field)){
            setLoading(true)
            type DataResponse = { message: string; token:string; refresh: string, name:string; };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await patchRequest<ApiResponse>(ENDPOINTS['rider']['profile'], {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
            }, true);

            setUser({
                email: resData.email,
                phone_number:  phoneNumber,
                avatar: avatar,
                first_name: firstName,
                last_name: lastName,
                full_name: "",
                store_name: ""
            })

            updateKey('first_name', firstName)
            updateKey('last_name', lastName)
            updateKey('phone_number', phoneNumber)

            setLoading(false)
            Toast.show({
              type: 'success',
              text1: "Details Updated",
              visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
          }
  
        } catch (error:any) {
          setLoading(false)
        //   alert(JSON.stringify(error))
          Toast.show({
            type: 'error',
            text1: "An error occured",
            text2: error.data?.data?.message || 'Unknown Error',
            visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
            autoHide: true,
          });
        }
    };

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
            setAvatar(result.assets[0].uri) 
            try {
                setLoading(true)

                const formData = new FormData();
                const file = {
                    uri: result.assets[0].uri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg',
                };
                if (Platform.OS === 'android') {
                    formData.append('avatar', {
                        uri: file.uri,
                        name: file.name,
                        type: file.type,
                    } as any);  
                } else {
                    formData.append('avatar', file as any);
                }

                type ApiResponse = { avatar_url: string;};
                const res = await postRequest<ApiResponse>(ENDPOINTS['account']['avatar'], formData, true, true);
                
                updateKey('avatar', res.avatar_url)
                setAvatar(res.avatar_url)
                    
                setUser({
                    email: resData.email,
                    phone_number:  resData.phone_number,
                    avatar: res.avatar_url,
                    first_name: resData.first_name,
                    last_name: resData.last_name,
                    full_name: "",
                    store_name: ""
                })

                setLoading(false)
                Toast.show({
                    type: 'success',
                    text1: "Avatar Updated",
                    visibilityTime: 6000, // time in milliseconds (5000ms = 5 seconds)
                    autoHide: true,
                });
            
            } catch (error:any) {
                setLoading(false)
                setAvatar(resData.avatar)
            //   alert(JSON.stringify(error))
                Toast.show({
                type: 'error',
                text1: "Error updating avatar",
                text2: error.data?.data?.message || 'Unknown Error',
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
                });
            }
        };
    }

    return (
        <SafeAreaView>
            {loading && 
                <FullScreenLoader />
            }

            {/* Page requires intermet connection */}
            <ConnectionModal />
            {/* Page requires intermet connection */}
            
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle="light-content"  backgroundColor={(theme == 'dark')? "#1f2937" :"#228B22"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full`}>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>

                <ScrollView className='w-full space-y-1'  contentContainerStyle={{ flexGrow: 1 }}>
                    <View className='w-full px-5 my-1'>
                        <View
                        className='flex flex-row w-full items-center'
                        >
                            <Text
                            style={{fontFamily: 'Inter-Medium'}} 
                            className={`text-custom-green text-[12px] font-medium`}
                            >
                                Active status
                            </Text>
                            <TouchableOpacity
                            onPress={ToggleActiveStatus}
                            className='ml-auto'
                            >
                                {activeStatus?
                                <ToggleOn width={40} />
                                :
                                <ToggleOff width={40} />
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>

                    
                    <View style={styles.shadow_box} className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} mx-auto mb-4 rounded-lg p-4 w-[90%] flex flex-row items-center`}>
                        <TouchableOpacity
                        onPress={()=>pickImage('avatar')}
                        className={`${theme == 'dark'? 'bg-gray-900' : ' bg-blue-100'} w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${avatar && 'border-2 border-custom-green'}`}>
                        {/* Image Preview */}
                        
                        <Image 
                        source={{ uri: avatar }} 
                        style={{ width: 100, height: 100}} />

                        </TouchableOpacity>
                        <View  className='ml-4'>
                            <Text
                            style={{fontFamily: 'Inter-Bold'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px]`}
                            >
                                {TruncatedText(`${resData.first_name} ${resData.last_name}` || "No name", 20) }
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-Bold'}}
                            className='text-[12px] text-custom-green -mt-1'
                            >
                                Rider
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[10px] mt-2`}
                            >
                                {TruncatedText(resData.email || "No email", 30) }
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-SemiBold'}}
                            className='text-[10px] text-custom-green -mt-1'
                            >
                                {TruncatedText(resData.phone_number || "No number", 20) }
                            </Text>
                        </View>
                    </View>

                    <Text
                    className='text-custom-green text-[15px] self-start pl-5 mt-8'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Personal Information
                    </Text>

                    <View className='w-[90%] mx-auto space-y-3 mb-3'>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Full Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setFirstName}
                                    defaultValue={firstName}
                                    placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                                />
                            </View>
                            <TouchableOpacity
                            className={`bg-custom-green ${(loading || resData?.first_name == firstName) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                            onPress={()=>{handleUpdate('first_name')}}
                            >
                                <Text
                                className='text-white text-[11px] self-start'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Edit
                                </Text>
                                {loading && (
                                    <View className='absolute w-full'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Last Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setLastName}
                                    defaultValue={lastName}
                                    placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                                />
                            </View>
                            <TouchableOpacity
                            className={`bg-custom-green ${(loading || resData?.last_name == lastName) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                            onPress={()=>{handleUpdate('last_name')}}
                            >
                                <Text
                                className='text-white text-[11px] self-start'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Edit
                                </Text>
                                {loading && (
                                    <View className='absolute w-full'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Email
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    onChangeText={setEmail}
                                    defaultValue={email}
                                    readOnly={true}
                                    placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                                />
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} text-[11px]`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Phone Number
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setPhoneNumber}
                                    defaultValue={phoneNumber}
                                    placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                                />
                            </View>
                            <TouchableOpacity
                            className={`bg-custom-green ${(loading || resData?.phone_number == phoneNumber) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                            onPress={()=>{handleUpdate('phone_number')}}
                            >
                                <Text
                                className='text-white text-[11px] self-start'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Edit 
                                </Text>
                                {loading && (
                                    <View className='absolute w-full'>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    

                    <TouchableOpacity 
                    onPress={()=>{router.push("/vendor/set_store_address?update=1")}}
                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full px-6 py-2 my-5`}>
                        <View className='w-full flex flex-row space-x-3 items-center'>
                            <Location />
                            <View>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-900'} text-[11px] self-start'`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {riderState}
                                </Text>

                                <View className='flex flex-row space-x-2'>
                                    <Text
                                    className='text-[11px] text-custom-green self-start'
                                    style={{fontFamily: 'Inter-Medium'}}
                                    >
                                        Apt/House
                                    </Text>
                                    <Text
                                    className='text-[11px] text-gray-500 self-start'
                                    style={{fontFamily: 'Inter-Regular'}}
                                    >
                                        {range}
                                    </Text>
                                </View>
                                
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                    // onPress={()=>{router.push("/enter_code")}}
                    onPress={handleUpdate2}
                    className={`text-center ${(validateInput2() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl mt-auto p-4 w-[90%] self-center mb-10 flex items-center justify-around`}
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
                            Save
                        </Text>
                                        
                    </TouchableOpacity> */}
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