import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, Alert, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import RadioActive from '../assets/icon/radio_active.svg';
import RadioInctive from '../assets/icon/radio_inactive.svg';
import TitleTag from '@/components/Title';
import Search from '../assets/icon/search.svg';
import LocationPicker from '@/components/LocationPicker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import Map from '../assets/icon/map.svg';
import Delay from '@/constants/Delay';
import * as Location from 'expo-location';
import MapView, { Marker, LatLng, MapPressEvent, PoiClickEvent} from 'react-native-maps';
import { postRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharField from '@/components/CharField';

export default function SetDeliveryAddress(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    
    const [loading, setLoading] = useState(false); // Loading state

    const [riderInstruction, setRiderInstruction] = useState('');
    const [serviceOption, setServiceOption] = useState(1);
    const [buildingType, setBuildingType] = useState('');
    const [floor, setFloor] = useState('');
    const [buildingName, setBuildingName] = useState('');
    
    // Get query params
    const { longitude, latitude, address } = useGlobalSearchParams();

    // Safely parse and set default values
    const initialLongitude = Array.isArray(longitude) ? parseFloat(longitude[0]) : parseFloat(longitude || '-122.4324');
    const initialLatitude = Array.isArray(latitude) ? parseFloat(latitude[0]) : parseFloat(latitude || '37.78825');
    const initialAddress = Array.isArray(address) ? address[0] : address || '';

    // State to hold the location data
    const [location, setLocation] = useState({
        latitude: initialLatitude,
        longitude: initialLongitude,
        address: initialAddress,
    });

    // Handle user interaction with the map
    const handleMapPress = async (event: MapPressEvent) => {
        const { latitude, longitude }: LatLng = event.nativeEvent.coordinate;
    
        try {
          const [addressObj] = await Location.reverseGeocodeAsync({ latitude, longitude });
          const newAddress = `${addressObj.name || ''}, ${addressObj.street || ''}, ${addressObj.city || ''}`;
    
          setLocation({
            latitude,
            longitude,
            address: newAddress,
          });
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          Alert.alert('Error', 'Unable to fetch address for the selected location.');
        }
    };

    const handlePoiClick = (event: PoiClickEvent) => {
        const { coordinate, name } = event.nativeEvent;
        setLocation({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          address: name, // POI name as address
        });
    };

    const validateInput = () =>{
        if((location.address != '') && (location.latitude != 0) && (location.longitude != 0) && (buildingType != '') && (buildingName != '')  && (floor != '') && (riderInstruction != '') && (serviceOption != 0)){
          return true;
        }
        return false;
    }
    
    const handleSubmit = async () => {
        try {
          if(!loading && validateInput()){
            setLoading(true)
            const res = await postRequest(ENDPOINTS['buyer']['create-address'], {
                building_type: buildingType,
                building_name: buildingName,
                floor: floor,
                rider_instruction: riderInstruction,
                service_option: serviceOption,
                ...location
            }, true);
            setLoading(false)
            Toast.show({
              type: 'success',
              text1: "Address Created",
              visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
  
            await Delay(1000)
            router.push({
              pathname: '/(tabs)/dashboard',
            }); 
          }
  
        } catch (error:any) {
            // alert(JSON.stringify(error))
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: "An error occured",
                text2: error.data?.message || "Unknown Error",
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }
    };


    return (
        <SafeAreaView>
            <View className=' bg-white w-full h-full flex items-center'>
                <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
                <TitleTag withprevious={true} title='Set delivery address' withbell={false}/>

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
                    onPress={handleMapPress}
                    onPoiClick={handlePoiClick}
                    >
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
                    </MapView>
                    <View className='w-[90%] mx-auto my-2'>
                        <Text
                        className='text-[10px] text-gray-500 text-center'
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                            Move the pin to your building entrance to help your courier find you faster
                        </Text> 

                        <View className='flex flex-row mt-2'>
                            <Text
                            className='text-[12px] text-gray-800'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Address:
                            </Text>
                            <Text
                            className='text-[12px] text-custom-green'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {' '}{location.address}
                            </Text>
                        </View> 
                        
                    </View>
                    
                    <View className='my-10 space-y-3 w-[90%] mx-auto'>
                        <View className='bg-gray-100 rounded-lg'>
                          <CharField  placeholder="eg Office" focus={true} border={false} name='Building type' getValue={(value: string)=>setBuildingType(value)}/>
                        </View>
                        <View className='bg-gray-100 rounded-lg'>
                          <CharField  placeholder="e.g 1208" focus={false} border={false} name='Apt / Suite / Floor' getValue={(value: string)=>setFloor(value)}/>
                        </View>
                        <View className='bg-gray-100 rounded-lg'>
                          <CharField  placeholder="e.g Central Tower" focus={false} border={false} name='Business /  Building name' getValue={(value: string)=>setBuildingName(value)}/>
                        </View>
                    </View>

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
                            className='text-[12px] self-start text-gray-500'
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
                            className='text-[12px] self-start text-gray-500'
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
                            className='text-[12px] self-start text-gray-500'
                            style={{fontFamily: 'Inter-SemiBold'}}
                            >
                                Leave it at my door
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text
                    className='text-[13px] pl-5 mt-10'
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Instruction for delivery person
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
                        placeholder='Example: Please knock instead of using the doorbell'
                        placeholderTextColor=""
                        />
                    </View>

                    <TouchableOpacity
                    onPress={handleSubmit}
                    className={`text-center ${(validateInput())? 'bg-custom-green' : 'bg-custom-inactive-green'} ${(loading) && 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[85%] self-center mt-8 mb-8 flex items-center justify-around`}
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
                        Set address
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