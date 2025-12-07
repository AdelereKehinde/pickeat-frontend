// components/PlatformMap.tsx
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

interface PlatformMapProps {
  markers?: Array<{
    latitude: number;
    longitude: number;
    title?: string;
  }>;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  onMapPress?: (event: any) => void;
  onPoiClick?: (event: any) => void;
  style?: any;
}

const PlatformMap: React.FC<PlatformMapProps> = ({
  markers = [],
  initialRegion = { 
    latitude: 7.5226731, 
    longitude: 5.2222632, 
    latitudeDelta: 0.0922, 
    longitudeDelta: 0.0421 
  },
  onMapPress,
  onPoiClick,
  style,
}) => {
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    setIsWeb(Platform.OS === 'web');
  }, []);

  // Web implementation - simple placeholder
  if (isWeb) {
    return (
      <View style={[styles.map, styles.webMap, style]}>
        <View style={styles.webMapContent}>
          <Text style={styles.mapIcon}>📍</Text>
          <Text style={styles.mapTitle}>Map View</Text>
          <Text style={styles.mapSubtitle}>
            Interactive map available on mobile devices
          </Text>
          <View style={styles.coordinatesBox}>
            <Text style={styles.coordinateText}>
              Lat: {initialRegion.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinateText}>
              Lng: {initialRegion.longitude.toFixed(6)}
            </Text>
          </View>
          {markers.length > 0 && (
            <Text style={styles.markerInfo}>
              {markers.length} location{markers.length !== 1 ? 's' : ''} marked
            </Text>
          )}
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => onMapPress?.({
              nativeEvent: {
                coordinate: {
                  latitude: initialRegion.latitude,
                  longitude: initialRegion.longitude,
                }
              }
            })}
          >
            <Text style={styles.buttonText}>Tap to select this location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Native implementation using react-native-maps
  try {
    const MapView = require('react-native-maps').default;
    const Marker = require('react-native-maps').Marker;

    return (
      <MapView
        style={[styles.map, style]}
        initialRegion={initialRegion}
        onPress={onMapPress}
        onPoiClick={onPoiClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ 
              latitude: marker.latitude, 
              longitude: marker.longitude 
            }}
            title={marker.title}
          />
        ))}
      </MapView>
    );
  } catch (error) {
    console.error('Error loading react-native-maps:', error);
    
    // Fallback if react-native-maps fails to load
    return (
      <View style={[styles.map, styles.errorMap, style]}>
        <Text style={styles.errorText}>Map not available</Text>
        <Text style={styles.errorSubtext}>Please check your device settings</Text>
      </View>
    );
  }
};

// Import TouchableOpacity at the top
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  webMap: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  webMapContent: {
    alignItems: 'center',
    padding: 20,
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  coordinatesBox: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  coordinateText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'monospace',
  },
  markerInfo: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 16,
  },
  mapButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  errorMap: {
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7f1d1d',
  },
});

export default PlatformMap;