import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Image, Platform, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest, patchRequest, postRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import RadioActive from '../assets/icon/radio_active.svg';
import RadioInctive from '../assets/icon/radio_inactive.svg';
import Location from '../assets/icon/location_highlight.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { useUser } from '@/context/UserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from '@/components/FullScreenLoader';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import * as ImagePicker from 'expo-image-picker';
import { TruncatedText } from '@/components/TitleCase';

export default function ProfilePage(){
    const { setUser } = useUser();
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(true);

    const { theme, toggleTheme } = useContext(ThemeContext);

    type APIResponse = {
        first_name: string; last_name: string; email: string; building_type: string; building_name: string; floor: string; address: string; phone_number: string; service_option: number; rider_instruction: string; avatar: string;
    };

    const [resData, setResData] = useState<APIResponse>({
        first_name: '',
        last_name: '',
        email: '',
        avatar: 'https://res.cloudinary.com/ddl2pf4qh/image/upload/v1629388876/fintrak/FinProfile_no9nb1.png',
        building_type: '',
        building_name: '',
        floor: '',
        address: '',
        phone_number: '',
        service_option: 0,
        rider_instruction: '',
    });

    const updateKey = <K extends keyof APIResponse>(key: K, value: APIResponse[K]) => {
        setResData((prev) => ({
          ...prev,
          [key]: value,
        }));
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/ddl2pf4qh/image/upload/v1629388876/fintrak/FinProfile_no9nb1.png');
    const [email, setEmail] = useState('');
    const [riderInstruction, setRiderInstruction] = useState('');
    const [address, setAddress] = useState({building_type: '', building_name: '', floor: '', address: ''})
    const [serviceOption, setServiceOption] = useState(1);

    const isFocused = useIsFocused();
    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['buyer']['information']}`, true);
                setFirstName(response.first_name)
                setLastName(response.last_name)
                setPhoneNumber(response.phone_number)
                setRiderInstruction(response.rider_instruction)
                setServiceOption(response.service_option)
                setEmail(response.email)
                setAvatar(response.avatar)

                setAddress({
                    building_type: response.building_type,
                    building_name: response.building_name,
                    floor: response.floor,
                    address: response.address
                })

                setResData(response)
                setLoading(false) 
                // alert(JSON.stringify(response))
            } catch (error) {
                // alert(error);
                setLoading(false) 
            }
        };
    
        fetchInformation(); 
    }, [isFocused]); // Empty dependency array ensures this runs once

    const validateInput = (field:string) =>{
        switch (field) {
            case 'first_name':
                return (firstName !== resData?.first_name)
            case 'last_name':
                return (lastName !== resData?.last_name)
            case 'phone_number':
                return (phoneNumber !== resData?.phone_number)
            case 'service_option':
                return (serviceOption !== resData?.service_option)
            case 'rider_instruction':
                return (riderInstruction !== resData?.rider_instruction)
            default:
                return false;
        }
    }

    const validateInput2 = () =>{
        if((resData?.service_option !== serviceOption) || (resData?.rider_instruction !== riderInstruction)){
          return true;
        }
        return false;
    }

    const handleUpdate = async (field: string) => {
        try {
          if(!loading && validateInput(field)){
            setLoading(true)
            type DataResponse = { message: string; token:string; refresh: string, name:string; };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await patchRequest<ApiResponse>(ENDPOINTS['buyer']['user-data'], {
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
                full_name: `${firstName} ${lastName}`,
                store_name: ''
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

    const handleUpdate2 = async () => {
        try {
          if(!loading && validateInput2()){
            setLoading(true)
            type DataResponse = { message: string; token:string; refresh: string, name:string; };
            type ApiResponse = { status: string; message: string; data:DataResponse };
            const res = await patchRequest<ApiResponse>(ENDPOINTS['buyer']['update-address'], {
                service_option: serviceOption,
                rider_instruction: riderInstruction
            }, true);
            
            updateKey('service_option', serviceOption)
            updateKey('rider_instruction', riderInstruction)

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
                        full_name: `${resData.first_name} ${resData.last_name}`,
                        store_name: ''
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
        <SafeAreaView className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'}`}>
            {loading && 
                <FullScreenLoader />
            }
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'}' w-full h-full flex items-center'`}>
            <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>

                <ScrollView className={`${theme == 'dark'? 'bg-gray-900' : ' bg-gray-100'} w-full space-y-1`}  contentContainerStyle={{ flexGrow: 1 }}>
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
                                User
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
                    className='text-custom-green text-[16px] self-start pl-5 mt-5'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Personal Information
                    </Text>
                    <View className='w-[90%] mx-auto space-y-3 mb-3'>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    First Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setFirstName}
                                    defaultValue={firstName}
                                    placeholderTextColor=""
                                />
                            </View>
                            <TouchableOpacity
                            className={` bg-custom-green ${(loading || resData?.first_name == firstName) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
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
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Last Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setLastName}
                                    defaultValue={lastName}
                                    placeholderTextColor=""
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
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Email
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    onChangeText={setEmail}
                                    defaultValue={email}
                                    readOnly={true}
                                    placeholderTextColor=""
                                />
                            </View>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} flex flex-row rounded-xl px-4 items-center space-x-3 py-2`}>
                            <View className='grow'>
                                <Text
                                className='text-gray-400 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Phone Number
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`${theme == 'dark'? 'text-gray-200' : ' text-black'} w-full rounded-lg text-[11px]`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setPhoneNumber}
                                    defaultValue={phoneNumber}
                                    placeholderTextColor=""
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
                    onPress={()=>{router.push("/set_delivery_address?update=1")}}
                    className={`${theme == 'dark'? 'bg-gray-800' : 'bg-white'} w-full px-6 py-2 my-5`}>
                        <View className='w-full flex flex-row space-x-3 items-center'>
                            <Location />
                            <View>
                                <Text
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-800'} text-[11px] self-start`}
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    {address.address}
                                </Text>

                                <View className='flex flex-row space-x-2'>
                                    <Text
                                    className='text-[11px] text-custom-green self-start'
                                    style={{fontFamily: 'Inter-Medium'}}
                                    >
                                        Apt/House
                                    </Text>
                                    <Text
                                    className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[11px] self-start`}
                                    style={{fontFamily: 'Inter-Regular'}}
                                    >
                                        {address.building_name} {address.building_type} {address.floor}
                                    </Text>
                                </View>
                                
                            </View>
                        </View>
                    </TouchableOpacity>
                

                    <Text
                    className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} text-[13px] self-start pl-5`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Service Options
                    </Text>
                    <View className='px-3 w-[90%] mx-auto mb-3'>
                        <TouchableOpacity
                        onPress={()=>{setServiceOption(1)}}
                        className='flex flex-row items-center space-x-2 border-b border-gray-200 py-2'
                        >
                            <View className={`flex items-center justify-around border border-custom-green ${(serviceOption !== 1) && 'border-gray-300'} p-1 rounded-full`}>
                                {(serviceOption == 1)?
                                    <RadioActive />
                                    :
                                    <RadioInctive width={6} height={6} />
                                }
                            </View>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px] self-start`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Hand it to me Directly
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{setServiceOption(2)}}
                        className={`flex flex-row items-center space-x-2 border-b border-gray-200 py-2`}
                        >
                            <View className={`flex items-center justify-around border border-custom-green ${(serviceOption !== 2) && 'border-gray-300'} p-1 rounded-full `}>
                                {(serviceOption == 2)?
                                    <RadioActive />
                                    :
                                    <RadioInctive width={6} height={6} />
                                }       
                            </View>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px] self-start`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Hand to me or who’s available
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{setServiceOption(3)}}
                        className='flex flex-row items-center space-x-2 border-b border-gray-200 py-2'
                        >
                            <View className={`flex items-center justify-around border border-custom-green ${(serviceOption !== 3) && 'border-gray-300'} p-1 rounded-full`}>
                                {(serviceOption == 3)?
                                    <RadioActive />
                                    :
                                    <RadioInctive width={6} height={6} />
                                }
                            </View>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[12px] self-start`}
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Leave it at my door
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text
                    className={`${theme == 'dark'? 'text-white' : ' text-gray-800'} text-[13px] pl-5 mt-10`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Instruction for Rider
                    </Text>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-200'} w-[90%] mx-auto px-4 py-1 rounded-xl`}>
                        <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} w-full rounded-lg text-[11px]`}
                        autoFocus={false}
                        readOnly={loading}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setRiderInstruction}
                        defaultValue={riderInstruction}
                        placeholder='e.g enter the main street, its 1st door on the right'
                        placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                        />
                    </View>

                    <TouchableOpacity
                    // onPress={()=>{router.push("/enter_code")}}
                    onPress={handleUpdate2}
                    className={`text-center ${(validateInput2() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} ${loading && ('bg-custom-inactive-green')} relative rounded-xl p-4 w-[90%] self-center my-10 flex items-center justify-around`}
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
                            Update
                        </Text>
                                        
                    </TouchableOpacity>
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