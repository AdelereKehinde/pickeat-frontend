import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

type Location = {
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  getAddress: (value: string) => void
  onLocationSelected: (location: Location) => void;
};



const LocationPicker: React.FC<LocationPickerProps> = ({ getAddress, onLocationSelected }) => {
  // const [selectedLocation, setSelectedLocation] = useState<Location>({
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  // });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const getLocationPermissionAndFetchLocation = async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("Permission Denied Location permission is needed to select your location.");
        setLoading(false);
        return;
      }

      // Get device's current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setSelectedLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoading(false); 
    };

    getLocationPermissionAndFetchLocation();
  }, []);

  const handleMapPress = async (event: MapPressEvent) => {
    setSelectedLocation(event.nativeEvent.coordinate);
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const [add] = await Location.reverseGeocodeAsync({ latitude, longitude });
    setAddress(`${add.name}, ${add.street}, ${add.city}, ${add.region}, ${add.postalCode}, ${add.country}`)
    getAddress(address)
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  return (
    <View className='w-[100%] h-[100%] border border-gray-300 rounded-md overflow-hidden'>
      <MapView
        style={{ flex: 1 }}
        className='h-60'
        initialRegion={{
          latitude: selectedLocation?.latitude || 6.5244,
          longitude: selectedLocation?.longitude || 3.3792,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      
      <View style={{ padding: 16 }} className=''>
        <Text>Address: {address} </Text>
      </View>
    </View>
  );
};

export default LocationPicker;
