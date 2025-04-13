import React, { useState, useEffect, useContext } from 'react';
import { router, useGlobalSearchParams } from 'expo-router';
import { Text, View, StatusBar, TextInput, Alert, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TitleTag from '@/components/Title';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ToastConfig';
import ENDPOINTS from '@/constants/Endpoint';
import Map from '../../assets/icon/map.svg';
import Delay from '@/constants/Delay';
import * as Location from 'expo-location';
import MapView, { Marker, LatLng, MapPressEvent, PoiClickEvent} from 'react-native-maps';
import { postRequest, getRequest, patchRequest } from '@/api/RequestHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharField from '@/components/CharField';
import OutOfBound from '@/components/OutOfBound';
import FullScreenLoader from '@/components/FullScreenLoader';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import ConnectionModal from '@/components/ConnectionModal';


export default function SetDeliveryAddress(){
  const {update} = useGlobalSearchParams()
  const [updateAddress, setUpdateAddress] = useState(Array.isArray(update) ? ( update[0]? update[0]: 0) : (update? update : 0) )
  const { theme, toggleTheme } = useContext(ThemeContext);
    const toastConfig = {
        success: CustomToast,
        error: CustomToast,
    };
    
    const [riderInstruction, setRiderInstruction] = useState('');
    const [buildingType, setBuildingType] = useState('');
    const [floor, setFloor] = useState('');
    const [buildingName, setBuildingName] = useState('');

    const [loading, setLoading] = useState(false);
    const [setUpLoading, setSetUpLoading] = useState(true);

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

    const [location, setLocation] = useState({
      latitude: 3.3792,
      longitude: 6.5244,
      address: ''
    });

    const getCurrentLocation = async () => {
      if (updateAddress == 1){
        setSetUpLoading(true)
        type ApiResponse = { user: string; latitude: number; longitude: number; address: string; building_type: string; building_name: string; floor: string; rider_instruction: string;};
        const response = await getRequest<ApiResponse>(ENDPOINTS['vendor']['update-address'], true); // Authenticated

        setBuildingName(response.building_name)
        setBuildingType(response.building_type)
        setFloor(response.floor)
        setRiderInstruction(response.rider_instruction)
        setLocation({latitude: response.latitude, longitude: response.longitude, address: response.address}) 

        setSetUpLoading(false)
      }else{
        try {
          // Ask for location permissions
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status !== "granted") {
            // Alert.alert("Permission denied", "We need location access to proceed.");
            setSetUpLoading(false);
            return;
          }
    
          // Get user's current location
          const { coords } = await Location.getCurrentPositionAsync({});
          // alert(status)
          const { latitude, longitude } = coords;
  
          // Reverse geocode to get the address
          const geocodedAddresses = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
  
          const address = geocodedAddresses[0]?.name + ", " + geocodedAddresses[0]?.city + ", " +geocodedAddresses[0]?.country;
    
          // Set location state
          setLocation({
            latitude,
            longitude,
            address: address || "Unknown address",
          });
        } catch (error) {
          console.error(error);
          // Alert.alert("Error", "Unable to fetch location.");
        } finally {
          setSetUpLoading(false);
        }
      };
    }

    useEffect(() => {
      getCurrentLocation();
    }, []);

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
          // Alert.alert('Error', 'Unable to fetch address for the selected location.');
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
        if((location?.address != '') && (location?.latitude != 0) && (location?.longitude != 0) && (buildingType != '') && (buildingName != '')  && (floor != '') && (riderInstruction != '')){
          return true;
        }
        return false;
    }
    
    const handleSubmit = async () => {
        try {
          if(!loading && validateInput() && checkIfInLagos(location.latitude, location.longitude)){
            if (updateAddress == 1){
              setLoading(true)
              const response = await patchRequest(ENDPOINTS['vendor']['update-address'], {
                building_type: buildingType,
                building_name: buildingName,
                floor: floor,
                rider_instruction: riderInstruction,
                ...location
              }, true);

              setLoading(false)

              Toast.show({
                type: 'success',
                text1: "Address Updated",
                visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
              });
              await Delay(3000)

              router.back()

            }else{
              setLoading(true)
              const res = await postRequest(ENDPOINTS['vendor']['create-address'], {
                  building_type: buildingType,
                  building_name: buildingName,
                  floor: floor,
                  rider_instruction: riderInstruction,
                  ...location
              }, true);
              
              Toast.show({
                type: 'success',
                text1: "Address Created",
                visibilityTime: 3000, // time in milliseconds (5000ms = 5 seconds)
                autoHide: true,
              });
    
              await Delay(1000)
              router.replace({
                pathname: '/vendor/account_setup_4',
              }); 
            }
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
            <View className={`${theme == 'dark'? 'bg-gray-900' : ' bg-white'} w-full h-full flex items-center`}>
                <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"}  backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
                <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-blue-100'} w-full mb-4`}>
                  <TitleTag withprevious={true} title='Set kitchen address' withbell={false}/>
                </View> 

                {/* Page requires intermet connection */}
                <ConnectionModal />
                {/* Page requires intermet connection */}
                
                <OutOfBound open={!isInLagos} user='vendor' getValue={(value: boolean)=>{setIsInLagos(!value)}} />
                {setUpLoading && 
                  <FullScreenLoader />
                }
                <ScrollView
                className='w-full'
                contentContainerStyle={{ flexGrow: 1 }}
                >

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
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude}} />
                    </MapView>
                    <View className='w-[90%] mx-auto my-2'>
                        <Text
                        className={`${theme == 'dark'? 'text-gray-400' : ' text-gray-500'} text-[10px] text-center`}
                        style={{fontFamily: 'Inter-Regular'}}
                        >
                            Move the pin to your building entrance to help your courier find you faster
                        </Text> 

                        <View className='flex flex-col mt-2'>
                            <Text
                            className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-800'} text-[12px]`}
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                Address:
                            </Text>
                            <Text
                            className='text-[12px] text-custom-green'
                            style={{fontFamily: 'Inter-Regular'}}
                            >
                                {location.address}
                            </Text>
                        </View> 
                        
                    </View>
                    
                    <View className='my-10 space-y-3 w-[90%] mx-auto'>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg`}>
                          <CharField  placeholder="eg Office" focus={false} border={false} name='Building type' setValue={buildingType} getValue={(value: string)=>setBuildingType(value)}/>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg`}>
                          <CharField  placeholder="e.g 1208" focus={false} border={false} name='Apt / Suite / Floor' setValue={floor} getValue={(value: string)=>setFloor(value)}/>
                        </View>
                        <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} rounded-lg`}>
                          <CharField  placeholder="e.g Central Tower" focus={false} border={false} name='Business /  Building name' setValue={buildingName} getValue={(value: string)=>setBuildingName(value)}/>
                        </View>
                    </View>


                    <Text
                    className={`${theme == 'dark'? 'text-gray-200' : ' text-gray-900'} text-[13px] pl-5 mt-5`}
                    style={{fontFamily: 'Inter-SemiBold'}}
                    >
                        Instruction for delivery person
                    </Text>
                    <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-gray-100'} w-[90%] mx-auto px-4 py-1 rounded-xl`}>
                        <TextInput
                        style={{fontFamily: 'Inter-Medium'}}
                        className={`${theme == 'dark'? 'text-gray-100' : ' text-gray-500'} w-full rounded-lg text-[11px]`}
                        autoFocus={false}
                        readOnly={loading}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setRiderInstruction}
                        value={riderInstruction}
                        placeholder='Example: Please knock instead of using the doorbell'
                        placeholderTextColor={(theme == 'dark')? '#9ca3af':'#1f2937'}
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