// components/PlatformMap.tsx
import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';

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
  initialRegion = { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
  onMapPress,
  onPoiClick,
  style,
}) => {
  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    setIsWeb(Platform.OS === 'web');
  }, []);

  // Web implementation
  if (isWeb) {
    return <WebMap markers={markers} initialRegion={initialRegion} onMapPress={onMapPress} style={style} />;
  }

  // Native implementation
  return <NativeMap markers={markers} initialRegion={initialRegion} onMapPress={onMapPress} onPoiClick={onPoiClick} style={style} />;
};

// Native Map Component
const NativeMap: React.FC<PlatformMapProps> = ({ markers, initialRegion, onMapPress, onPoiClick, style }) => {
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
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
        />
      ))}
    </MapView>
  );
};

// Web Map Component (using a placeholder or Google Maps)
const WebMap: React.FC<PlatformMapProps> = ({ markers, initialRegion, onMapPress, style }) => {
  // For now, use a simple placeholder. You can replace with Google Maps or Leaflet later.
  return (
    <View style={[styles.map, styles.webMap, style]}>
      <View style={styles.webMapContent}>
        <View style={styles.mapMarker}>
          <View style={styles.markerPin} />
          <View style={styles.markerBase} />
        </View>
        <View style={styles.coordinates}>
          <Text style={styles.coordinateText}>
            📍 {initialRegion.latitude.toFixed(6)}, {initialRegion.longitude.toFixed(6)}
          </Text>
          {markers.length > 0 && (
            <Text style={styles.markerCount}>
              {markers.length} marker{markers.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Add these imports at the top if not already
import { Text } from 'react-native';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  webMap: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapContent: {
    alignItems: 'center',
  },
  mapMarker: {
    position: 'relative',
    marginBottom: 20,
  },
  markerPin: {
    width: 20,
    height: 20,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    position: 'absolute',
    top: -10,
    left: 0,
  },
  markerBase: {
    width: 2,
    height: 30,
    backgroundColor: '#ff3b30',
  },
  coordinates: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  coordinateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  markerCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default PlatformMap;