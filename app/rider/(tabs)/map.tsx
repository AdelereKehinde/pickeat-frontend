import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { ThemeContext, ThemeProvider } from '@/context/ThemeProvider';
import TitleTag from '@/components/Title';
import ConnectionModal from '@/components/ConnectionModal';

// Define the type for the region state
type RegionState = Region | null;

const RiderMap = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // const [region, setRegion] = useState<RegionState>(null); // State type set to Region or null
  // const [destination, setDestination] = useState({
  //   latitude: 7.516281533183993, 
  //   longitude: 5.227314983243173, // example destination
  // });
  // const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const getLocation = async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status === 'granted') {
  //       let location = await Location.getCurrentPositionAsync({});
  //       setRegion({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       });
  //     }
  //   };
  //   getLocation();
  // }, []);

  // useEffect(() => {
  //   if (region) {
  //     // Fetch the route when the region (user location) is available
  //     fetchRoute(region.latitude, region.longitude, destination.latitude, destination.longitude);
  //   }
  // }, [region, destination]);

  // const fetchRoute = async (originLat: number, originLng: number, destLat: number, destLng: number) => {
  //   setLoading(true);

  //   // Replace with your Google Maps Directions API Key
  //   const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  //   const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${apiKey}`;

  //   try {
  //     const response = await axios.get(directionsUrl);
  //     const points = decodePolyline(response.data.routes[0].overview_polyline.points);
  //     setRouteCoordinates(points);
  //   } catch (error) {
  //     console.error('Error fetching directions:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Decode the polyline points into a list of latitude/longitude objects
  // const decodePolyline = (encoded: string) => {
  //   const path = [];
  //   let index = 0;
  //   let lat = 0;
  //   let lng = 0;

  //   while (index < encoded.length) {
  //     let b, shift = 0, result = 0;
  //     do {
  //       b = encoded.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);

  //     const dLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
  //     lat += dLat;

  //     shift = 0;
  //     result = 0;
  //     do {
  //       b = encoded.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);

  //     const dLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
  //     lng += dLng;

  //     path.push({
  //       latitude: (lat / 1E5),
  //       longitude: (lng / 1E5),
  //     });
  //   }
  //   return path;
  // };

  // if (!region) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={(theme == 'dark')? "light-content" : "dark-content"} backgroundColor={(theme == 'dark')? "#1f2937" :"#f3f4f6"} />
      <View className={`${theme == 'dark'? 'bg-gray-800' : ' bg-white'} w-full`}>
        <TitleTag withprevious={false} title='Map' withbell={true} />
      </View>

      {/* Page requires intermet connection */}
      <ConnectionModal />
      {/* Page requires intermet connection */}
      
      {/* <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
      > */}
        {/* Draw the polyline (route) */}
        {/* {!loading && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="blue"
          />
        )} */}

        {/* Show destination marker */}
        {/* <Marker coordinate={destination} title="Destination" /> */}

        {/* Optional: Show loading spinner while fetching route */}
        {/* {loading && <ActivityIndicator size="large" color="blue" />} */}
      {/* </MapView> */}
    </View>
  );
};

export default RiderMap;
