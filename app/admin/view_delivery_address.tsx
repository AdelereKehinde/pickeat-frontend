import React, { useState, useEffect, useContext } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, Alert, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import RadioActive from '../../assets/icon/radio_active.svg';
import RadioInctive from '../../assets/icon/radio_inactive.svg';
import TitleTag from '@/components/Title';
import Search from '../../assets/icon/search.svg';
import LocationPicker from '@/components/LocationPicker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import Map from '../../assets/icon/map.svg';
import LocationGray from '../../assets/icon/location_gray.svg';
import Delay from '@/constants/Delay';
import * as Location from 'expo-location';
import MapView, { Marker, LatLng, MapPressEvent, PoiClickEvent} from 'react-native-maps';
import { postRequest, getRequest, patchRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharField from '@/components/CharField';
import OutOfBound from '@/components/OutOfBound';
import FullScreenLoader from '@/components/FullScreenLoader';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';

export default function ViewDeliveryAddress(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    // Get query params
    const {id} = useGlobalSearchParams()
    const [isInLagos, setIsInLagos] = useState<boolean>(true);

    const [loading, setLoading] = useState(false); // Loading state
    const [riderInstruction, setRiderInstruction] = useState('');
    const [serviceOption, setServiceOption] = useState(1);



    // State to hold the location data
    const [location, setLocation] = useState({
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Lagos'
    });

    type APIResponse = {
        id: number; 
        longitude: string; 
        latitude: string; 
        address: string; 
        building_type: string; 
        building_name: string;
        floor: string; 
        service_option: number; 
        rider_instruction: string;
    };
    const [resData, setResData] = useState<APIResponse>();
    useEffect(() => {
        const fetchInformation = async () => {
            try {
                setLoading(true)
                const response = await getRequest<APIResponse>(`${ENDPOINTS['admin']['buyers']}/${id}/delivery-address`, true);
                setResData(response)
                setLocation({
                    latitude: parseFloat(response.latitude),
                    longitude: parseFloat(response.longitude),
                    address: response.address
                })
                setServiceOption(response?.service_option)
                setRiderInstruction(response.rider_instruction)
                setLoading(false) 
                // alert(JSON.stringify(response))
            } catch (error) {
                // alert(error);
                // setLoading(false) 
            }
        };
        fetchInformation();
    }, []);
    


    return (
        <SafeAreaView>
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Delivery Address' withbell={false}/>
                </View>

                <OutOfBound open={!isInLagos} user='buyer' getValue={(value: boolean)=>{setIsInLagos(!value)}} />
                {loading && 
                  <FullScreenLoader />
                }

                <ScrollView
                className='w-full'
                contentContainerStyle={{ flexGrow: 1 }}
                >

                    <MapView
                    className="flex-1 border w-[90%] h-48 rounded-lg my-3 mx-auto"
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    >
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
                    </MapView>
                    
                    <View className='my-3 space-y-3 w-[90%] mx-auto'>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg p-2`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`text-custom-green text-[12px] ml-1`}
                            >
                                Building Type
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] ml-1`}
                            >
                            {resData?.building_type}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg p-2`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`text-custom-green text-[12px] ml-1`}
                            >
                                Apt / Suite / Floor
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] ml-1`}
                            >
                            {resData?.floor}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg p-2`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`text-custom-green text-[12px] ml-1`}
                            >
                                Business /  Building name
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] ml-1`}
                            >
                            {resData?.building_name}
                            </Text>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg p-2`}>
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`text-custom-green text-[12px] ml-1`}
                            >
                                Address
                            </Text>
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px] ml-1`}
                            >
                            {resData?.address}
                            </Text>
                        </View>
                    </View>

                    <View className='px-3 w-[90%] mx-auto mb-3 mt-4'>
                        <View
                        className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-200'} flex flex-row items-center space-x-2 border-b py-2`}
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
                        </View>
                        <View
                        className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-200'} flex flex-row items-center space-x-2 border-b py-2`}
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
                        </View>
                        <View
                        className={`${theme == 'dark'? 'border-gray-500' : ' border-gray-200'} flex flex-row items-center space-x-2 border-b py-2`}
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
                        </View>
                    </View>

                    <Text
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-900'} text-[12px] pl-5 mt-6`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Instruction for delivery person
                    </Text>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : 'bg-gray-100'} w-[90%] mx-auto px-4 py-2 mt-1 mb-10 rounded-xl`}>
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-500'} w-full rounded-lg text-[11px]`}
                        >
                            {riderInstruction}
                        </Text>
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