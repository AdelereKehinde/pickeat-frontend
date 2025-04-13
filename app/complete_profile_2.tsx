import React, { useState, useEffect, useContext } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, FlatList, TextInput, Pressable, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
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
import LocationGray from '../assets/icon/location_gray.svg';
import Delay from '@/constants/Delay';
import * as Location from 'expo-location';
import MapView, { Marker, LatLng, MapPressEvent, PoiClickEvent} from 'react-native-maps';
import { postRequest, patchRequest, getRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from '@/components/FullScreenLoader';
import OutOfBound from '@/components/OutOfBound';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import useDebounce from '@/components/Debounce';
import ConnectionModal from '@/components/ConnectionModal';

export default function CompleteProfile2(){
    const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
      };
    const GOOGLE_KEY = 'AIzaSyAnDP2_hUGkwHutyCzT2G5zPne8YV9MPTA'
    const [showMap, setShowMap] = useState(false)
    const [loading, setLoading] = useState(false); // Loading state
    const [getloading, setGetLoading] = useState(true); // Loading state
    const [isFocused, setIsFocus] = useState(false);

    type Result = {latitude: 0; longitude: 0; place_id: ''; name: '';}[];
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Result>([]);
    const [selectedLocation, setSelectedLocation] = useState({latitude: 0, longitude: 0, address: ''});
    const [userLocation, setUserLocation] = useState({latitude:0, longitude:0, latitudeDelta: 0, longitudeDelta: 0});


    // Handle user interaction with the map
    const handleMapPress = async (event: MapPressEvent) => {
        const { latitude, longitude }: LatLng = event.nativeEvent.coordinate;
        
        try {
            const [addressObj] = await Location.reverseGeocodeAsync({ latitude, longitude });
            const newAddress = `${addressObj.name || ''}, ${addressObj.street || ''}, ${addressObj.city || ''}`;
        
            setSelectedLocation({
                latitude,
                longitude,
                address: newAddress,
            });
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            // Alert.alert('Error', 'Unable to fetch address for the selected location.');
        }
    };

    const handlePoiClick = (event: PoiClickEvent) => {
        const { coordinate, name } = event.nativeEvent;
        setSelectedLocation({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          address: name, // POI name as address
        });
    };

    useEffect(() => {
        (async () => {
            setGetLoading(true)

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission Denied \nLocation permission is required to use this feature.');
                return;
            }
        
            // Get user's current location
            const { coords } = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coords;
            
            const geocodedAddresses = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            const address = geocodedAddresses[0]?.name + ", " + geocodedAddresses[0]?.city + ", " +geocodedAddresses[0]?.country;

            setUserLocation({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            setSelectedLocation({
                latitude: latitude,
                longitude: longitude,
                address: address,
            });

            setGetLoading(false)
        })();
    }, []);

    // Fetch addresses from Google Places API
    const fetchAddresses = async (query: string) => {
        const response = await getRequest<Result>(`${ENDPOINTS['account']['geocode']}?address=${query}`, true);
        // alert(JSON.stringify(response))
        setResults(response);
    };

    // Create a debounced version of fetchMeals with 500ms delay
    const debouncedSearch = useDebounce(fetchAddresses, 800);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setResults([]); // Clear results if input is empty
        if (query.trim() === '') {
          setLoading(false);
            return;
        }
        debouncedSearch(query); // Call debounced function
    };

    // Get detailed location information and update map
    const handleSelectAddress = async (address: string, longitude: number, latitude: number) => {
        // if (placeId === ''){
        setSelectedLocation({ latitude: latitude, longitude: longitude, address: address });

        setSearchQuery(''); // Clear search query
        setResults([]); // Clear search results
    };

    const ValidateFormContent = ():boolean =>{
        if((selectedLocation.address !== '') && ((selectedLocation.latitude !== 0) && (selectedLocation.longitude !== 0))){
            return true
        }
        return false
    }

    const [isInLagos, setIsInLagos] = useState<boolean>(true);
    
        // Define the bounding box for Lagos
    const lagosBoundingBox = {
        north: 6.8, // Northernmost point of Lagos
        south: 6.4, // Southernmost point of Lagos
        east: 3.6,  // Easternmost point of Lagos
        west: 3.3,  // Westernmost point of Lagos
    };
    
        // Check if the device is within the Lagos bounding box
    const checkIfInLagos = (latitude: number, longitude: number) => {
        if (
            latitude >= lagosBoundingBox.south &&
            latitude <= lagosBoundingBox.north &&
            longitude >= lagosBoundingBox.west &&
            longitude <= lagosBoundingBox.east
        ) {
            setIsInLagos(true);
            return true;
        } else {
            setIsInLagos(false);
            return false;
        }
    }

    const handleSubmit = async () => {
        try {
          if(!loading && ValidateFormContent() && checkIfInLagos(selectedLocation.latitude, selectedLocation.longitude)){
            setLoading(true)
            const res = await patchRequest(ENDPOINTS['buyer']['buyer-address'], selectedLocation, true);
            setLoading(false)
            Toast.show({
              type: 'success',
              text1: "Address Created",
              visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
              autoHide: true,
            });
  
            await Delay(1000)
            router.replace(`/set_delivery_address?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}&address=${selectedLocation.address}`)
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
            <View className={`${theme == 'dark'? 'bg-gray-900' : 'bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-full mb-4`}>
                    <TitleTag withprevious={true} title='Complete profile' withbell={false}/>
                </View>

                <OutOfBound open={!isInLagos} user='buyer' getValue={(value: boolean)=>{setIsInLagos(!value)}} />
                {getloading && (
                    <FullScreenLoader />
                )}

                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}

                <ScrollView
                className='w-full'
                contentContainerStyle={{ flexGrow: 1 }}
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
                                className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-900'} w-full ${isFocused? 'border-custom-green border': 'border-gray-400 border'} rounded-lg px-3 pl-10 py-2 text-[14px]`}
                                autoFocus={false}
                                onFocus={()=>setIsFocus(true)}
                                onBlur={()=>setIsFocus(false)}
                                onChangeText={handleSearch}
                                value={searchQuery}
                                placeholder="Enter a new address"
                                placeholderTextColor={(theme == 'dark')? '#fff':'#1f2937'}
                            />
                        </View>
                        {/* Search Results */}
                        {results.length > 0 && (
                            <View
                            style={styles.shadow_box}
                            className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full absolute top-14 z-30  mb-2 border border-gray-400 rounded-lg`}
                            >
                                <FlatList 
                                    data={results}
                                    className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} pb-2 pt-2 px-4 mb-3`}
                                    renderItem={({item, index}) =>  (
                                        <TouchableOpacity
                                        className="px-4 py-2 border-b border-gray-200"
                                        onPress={() => handleSelectAddress(item.name, item.longitude, item.latitude)}
                                        >
                                            <Text 
                                            style={{fontFamily: 'Inter-Regular'}}
                                            className={`${theme == 'dark'? 'text-gray-100' : 'text-gray-700'} text-[12px]`}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        )}
                    </View>

                    <View className={`${theme == 'dark'? 'border-gray-700' : ' border-gray-300'} flex flex-row items-center w-[90%] mx-auto px-0 my-4 border-b py-2`}>
                        <View>
                            <Map />
                        </View>
                        <Pressable
                        onPress={()=>{setShowMap(!showMap)}}
                        className='ml-3'
                        >
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className='text-custom-green m-auto text-[11px]'
                            >
                                {showMap? 'Close map':' Choose from map'}
                            </Text>
                        </Pressable>
                    </View>

                    <View className='flex flex-row items-center w-[90%] mx-auto px-0 mb-2'>
                        <View>
                            <LocationGray />
                        </View>
                        <Pressable
                        onPress={()=>{setShowMap(!showMap)}}
                        className='ml-3'
                        >
                            <Text
                            style={{fontFamily: 'Inter-Regular'}}
                            className={`${theme == 'dark'? 'text-gray-300' : ' text-gray-500'} text-[10px]`}
                            >
                                Current location
                            </Text> 
                            <Text
                            style={{fontFamily: 'Inter-Medium'}}
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px]`}
                            >
                                {selectedLocation.address}
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
                        className="flex-1 border w-[90%] h-48 rounded-lg my-3 mx-auto"
                        initialRegion={{
                        latitude: 7.5226731,
                        longitude: 5.2222632,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                        }}
                        onPress={handleMapPress}
                        onPoiClick={handlePoiClick}
                        >
                            <Marker coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude}} />
                        </MapView>
                    )}

                    <TouchableOpacity
                    onPress={handleSubmit}
                    className={`text-center ${(ValidateFormContent())? 'bg-custom-green' : 'bg-custom-inactive-green'} ${(loading) && 'bg-custom-inactive-green'} relative rounded-xl p-4 w-[85%] self-center mt-auto mb-8 flex items-center justify-around`}
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