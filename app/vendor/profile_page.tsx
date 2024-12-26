import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import TitleTag from '@/components/Title';
import ServicesLayout from '@/components/Services';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import { getRequest, patchRequest } from '@/api/RequestHandler';
import ENDPOINTS from '@/constants/Endpoint';
import RadioActive from '../../assets/icon/radio_active.svg';
import RadioInctive from '../../assets/icon/radio_inactive.svg';
import Location from '../../assets/icon/location_highlight.svg';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Delay from '@/constants/Delay';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    const [loading, setLoading] = useState(false);

    type APIResponse = {
        first_name: string; full_name: string; email: string; building_type: string; building_name: string; floor: string; address: string; phone_number: string; service_option: number; rider_instruction: string; };

    const [resData, setResData] = useState<APIResponse>({
        first_name: '',
        full_name: '',
        email: '',
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
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('');
    const [riderInstruction, setRiderInstruction] = useState('');
    const [address, setAddress] = useState({building_type: '', building_name: '', floor: '', address: ''})
    const [serviceOption, setServiceOption] = useState(1);

    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['vendor']['information']}`, true);
                setFirstName(response.first_name)
                setFullName(response.full_name)
                setPhoneNumber(response.phone_number)
                setRiderInstruction(response.rider_instruction)
                setServiceOption(response.service_option)
                setEmail(response.email)

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
                alert(error);
            }
        };
    
        fetchInformation(); 
    }, []); 

    const validateInput = (field:string) =>{
        switch (field) {
            case 'full_name':
                return (fullName !== resData?.full_name)
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
        if((resData?.rider_instruction !== riderInstruction)){
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
            const res = await patchRequest<ApiResponse>(ENDPOINTS['vendor']['user-data'], {
                first_name: firstName,
                full_name: fullName,
                phone_number: phoneNumber,
            }, true);
            
            updateKey('first_name', firstName)
            updateKey('full_name', fullName)
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
            const res = await patchRequest<ApiResponse>(ENDPOINTS['vendor']['update-address'], {
                rider_instruction: riderInstruction
            }, true);
            
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

    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <View className='bg-gray-100 w-full'>
                    <TitleTag withprevious={true} title='' withbell={false} />
                </View>

                <ScrollView className='w-full space-y-1'  contentContainerStyle={{ flexGrow: 1 }}>
                    <Text
                    className='text-custom-green text-[16px] self-start pl-5 mt-5'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Personal Information
                    </Text>
                    <View className='w-[90%] mx-auto space-y-3 mb-3'>
                        <View className='flex flex-row bg-blue-100 rounded-xl px-4 items-center space-x-3 py-2'>
                            <View className='grow'>
                                <Text
                                className='text-gray-500 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Full Name
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`w-full rounded-lg text-[11px] text-black`}
                                    autoFocus={false}
                                    readOnly={loading}
                                    onChangeText={setFullName}
                                    defaultValue={fullName}
                                    placeholderTextColor=""
                                />
                            </View>
                            <TouchableOpacity
                            className={`bg-custom-green ${(loading || resData?.full_name == fullName) && 'bg-gray-400'} px-4 py-[2px] rounded-lg flex items-center justify-around`}
                            onPress={()=>{handleUpdate('full_name')}}
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
                        <View className='flex flex-row bg-blue-100 rounded-xl px-4 items-center space-x-3 py-2'>
                            <View className='grow'>
                                <Text
                                className='text-gray-500 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Email
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`w-full rounded-lg text-[11px] text-black`}
                                    autoFocus={false}
                                    onChangeText={setEmail}
                                    defaultValue={email}
                                    readOnly={true}
                                    placeholderTextColor=""
                                />
                            </View>
                        </View>
                        <View className='flex flex-row bg-blue-100 rounded-xl px-4 items-center space-x-3 py-2'>
                            <View className='grow'>
                                <Text
                                className='text-gray-500 text-[11px]'
                                style={{fontFamily: 'Inter-SemiBold'}}
                                >
                                    Phone Number
                                </Text>
                                <TextInput
                                    style={{fontFamily: 'Inter-Medium'}}
                                    className={`w-full rounded-lg text-[11px] text-black`}
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
                    

                    <View className='bg-white w-full px-6 py2 my-5'>
                        <View className='w-full flex flex-row space-x-3'>
                            <Location />
                            <View>
                                <Text
                                className='text-[11px] self-start'
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
                                    className='text-[11px] text-gray-500 self-start'
                                    style={{fontFamily: 'Inter-Regular'}}
                                    >
                                        {address.building_name} {address.building_type} {address.floor}
                                    </Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>

                    <Text
                    className='text-[13px] pl-5 mt-10'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Instruction for Rider
                    </Text>
                    <View className='w-[90%] mx-auto bg-gray-100 px-4 py-1 rounded-xl'>
                        <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`w-full rounded-lg text-[11px] text-gray-500`}
                        autoFocus={false}
                        readOnly={loading}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setRiderInstruction}
                        defaultValue={riderInstruction}
                        placeholder='e.g enter the main street, its 1st door on the right'
                        placeholderTextColor=""
                        />
                    </View>

                    <TouchableOpacity
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
                                        
                    </TouchableOpacity>
                </ScrollView>
                <Toast config={toastConfig} />
            </View>
        </SafeAreaView>
    )
}