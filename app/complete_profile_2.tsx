import React, { useState, useEffect, useRef } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, Pressable, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
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
import MapView, { Marker } from 'react-native-maps';
import { postRequest } from '@/api/RequestHandler';

export default function CompleteProfile2(){
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    const GOOGLE_KEY = 'AIzaSyAnDP2_hUGkwHutyCzT2G5zPne8YV9MPTA'
    const [showMap, setShowMap] = useState(false)
    const [loading, setLoading] = useState(false); // Loading state
    const [isFocused, setIsFocus] = useState(false);

    type Result = { place_id: string; description: string;}[];
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Result>([]);
    const [selectedLocation, setSelectedLocation] = useState({latitude: 0, longitude: 0, address: ''});
    const [userLocation, setUserLocation] = useState({latitude:0, longitude:0, latitudeDelta: 0, longitudeDelta: 0});

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission Denied \nLocation permission is required to use this feature.');
            return;
        }
    
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        })();
    }, []);

    // Fetch addresses from Google Places API
    const fetchAddresses = async (query: string) => {
        const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
            params: {
            input: query,
            key: GOOGLE_KEY,
            language: 'en',
            components: 'country:ng'
            },
        }
        );
        // alert(JSON.stringify(response))
        setResults(response.data.predictions);
    };

    // Handle search query changes
    const handleSearch = (query: string) => {
        // alert(query)
        setSearchQuery(query);
        if (query.length > 2) {
        fetchAddresses(query);
        } else {
        setResults([]);
        }
    };

    // Get detailed location information and update map
    const handleSelectAddress = async (placeId: string, address: string) => {
        const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
            params: {
            place_id: placeId,
            key: GOOGLE_KEY,
            },
        }
        );

        const { lat, lng } = response.data.result.geometry.location;
        setSelectedLocation({ latitude: lat, longitude: lng, address: address });
        setSearchQuery(''); // Clear search query
        setResults([]); // Clear search results
    };

    const ValidateFormContent = ():boolean =>{
        if((selectedLocation.address !== '') && ((selectedLocation.latitude !== 0) && (selectedLocation.longitude !== 0))){
            return true
        }
        return false
    }
    const handleSubmit = async () => {
        try {
          if(!loading && ValidateFormContent()){
            setLoading(true)
            const res = await postRequest(ENDPOINTS['buyer']['create-address'], selectedLocation, true);
            setLoading(false)
            Toast.show({
              type: 'success',
              text1: "Address Created",
              visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
  
            await Delay(1000)
            router.push({
              pathname: '/dashboard',
            }); 
          }
  
        } catch (error:any) {
          setLoading(false)
            Toast.show({
                type: 'error',
                text1: "An error occured",
                text2: error.response?.data?.message || "Unknown Error",
                visibilityTime: 8000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
            });
        }
    };

    return (
        <View className=' bg-white w-full h-full flex items-center'>
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
            <TitleTag withprevious={true} title='Complete profile' withbell={false}/>

            <ScrollView
            className='w-full'
            >
                <View className='mt-5 w-full px-4 relative flex flex-row items-center justify-center'>
                    <View
                    className='w-full relative flex flex-row items-center justify-center'
                    >
                        <View className='absolute left-3 z-10'>
                            <Search />
                        </View>
                        <TextInput
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[14px]`}
                            autoFocus={false}
                            onFocus={()=>setIsFocus(true)}
                            onBlur={()=>setIsFocus(false)}
                            onChangeText={handleSearch}
                            value={searchQuery}
                            placeholder="Enter a new address"
                            placeholderTextColor=""
                        />
                    </View>
                    {/* Search Results */}
                    {results.length > 0 && (
                        <View
                        style={styles.shadow_box}
                        className='bg-white w-full absolute top-14 z-30  mb-2 border border-gray-400 rounded-lg'
                        >
                            <ScrollView
                            className=" bg-white shadow-lg max-h-60 rounded-lg"
                            >
                                {results.map((item) => (
                                    <TouchableOpacity
                                    key={item.place_id}
                                    className="px-4 py-2 border-b border-gray-200"
                                    onPress={() => handleSelectAddress(item.place_id, item.description)}
                                    >
                                        <Text className="text-gray-700">{item.description}</Text>
                                    </TouchableOpacity>                
                                ))}
                                
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View className='flex flex-row items-center w-[90%] mx-auto px-5 my-4 border-b border-gray-400 py-2'>
                    <View>
                        <Map />
                    </View>
                    <Pressable
                    onPress={()=>{setShowMap(!showMap)}}
                    className='ml-4'
                    >
                        <Text
                        style={{fontFamily: 'Inter-Medium'}}
                        className='text-custom-green m-auto text-[12px]'
                        >
                            {showMap? 'Hide map':'Show map'}
                        </Text>
                    </Pressable>
                </View>

                {/* {showMap && (
                    <View className='w-[90%] h-[400px]'>
                        <LocationPicker getAddress={(value: string)=>setAddress(value)} onLocationSelected={handleLocationSelected}/>
                    </View>
                )} */}

                {showMap && (
                    <MapView
                        className="flex-1 border w-[90%] h-96 mx-auto mb-3"
                        initialRegion={userLocation || {
                        latitude: 37.7749, // Default to San Francisco if location not available
                        longitude: -122.4194,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                        }}
                        region={
                        selectedLocation
                            ? {
                                ...selectedLocation,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }
                            : undefined
                        }
                    >
                        {/* User's Current Location Marker */}
                        {userLocation && (
                        <Marker coordinate={userLocation} title="Your Location" />
                        )}

                        {/* Selected Address Marker */}
                        {selectedLocation && (
                        <Marker coordinate={selectedLocation} title="Selected Location" />
                        )}
                    </MapView>
                )}

                <View className='w-[90%] mx-auto my-2'>
                    <Text
                    className='text-[12px]'
                    style={{fontFamily: 'Inter-Regular'}}
                    >
                        Address: {(selectedLocation.address == '')?
                            <Text
                            className='text-[12px] text-red-500'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {' '}Search and select your address
                            </Text>
                            :
                            <Text
                            className='text-[12px] text-custom-green'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {' '}{selectedLocation.address}
                            </Text> 
                        }
                    </Text>  
                </View>

                <TouchableOpacity
                onPress={handleSubmit}
                className={`text-center ${(ValidateFormContent() || loading)? 'bg-custom-green' : 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[85%] self-center mt-[50px] mb-8 flex items-center justify-around`}
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
                    Select
                    </Text>     
                </TouchableOpacity>
            </ScrollView>
            <Toast config={toastConfig} />
        </View>
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