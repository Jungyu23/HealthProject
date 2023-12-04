import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

function LiveHealthNavigator() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1
      }, (loc) => {
        setLocation(loc);
        setSpeed(loc.coords.speed);
        if (destination) {
          const d = calculateDistance(loc.coords, destination);
          setDistance(d);
        }
      });
    })();
  }, [destination]);

  const calculateDistance = (startCoords, endCoords) => {
    // Haversine formula to calculate distance
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(endCoords.latitude - startCoords.latitude);
    const dLon = toRad(endCoords.longitude - startCoords.longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(startCoords.latitude)) * Math.cos(toRad(endCoords.latitude)) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setDestination(coords);
    if (location) {
      const d = calculateDistance(location.coords, coords);
      setDistance(d);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 3 }}
        initialRegion={{
          latitude: location?.coords.latitude ?? 37.78825,
          longitude: location?.coords.longitude ?? -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {location && (
          <Marker coordinate={location.coords} title="Your Location" />
        )}
        {destination && (
          <Marker coordinate={destination} title="Destination" />
        )}
      </MapView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Latitude: {location?.coords.latitude}</Text>
        <Text>Longitude: {location?.coords.longitude}</Text>
        <Text>Speed: {speed ? `${speed.toFixed(2)} m/s` : 'N/A'}</Text>
        <Text>Distance to destination: {distance ? `${distance.toFixed(2)} km` : 'N/A'}</Text>
      </View>
    </View>
  );
}

export default LiveHealthNavigator;