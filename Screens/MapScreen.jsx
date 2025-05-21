import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const locations = [
  { name: 'C.C. Gran Estación', lat: 4.6815, lng: -74.1199 },
  { name: 'Universidad Libre', lat: 4.6351, lng: -74.0778 },
  { name: 'Plaza de Bolívar', lat: 4.5979, lng: -74.0760 },
  { name: 'El Dorado Airport', lat: 4.7016, lng: -74.1470 },
];

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [searchVisible, setSearchVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransport, setSelectedTransport] = useState('carro');
  const [points, setPoints] = useState(1500);

  // Animación de pulso
  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu ubicación');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      setLoading(false);
    })();
  }, []);

  const calculateRoute = () => {
    if (origin && destination) {
      const fakeRoute = [
        { latitude: origin.lat, longitude: origin.lng },
        { latitude: destination.lat, longitude: destination.lng },
      ];
      setRoute(fakeRoute);
    }
  };

  const handleLocationSelect = (location, type) => {
    if (type === 'origin') setOrigin(location);
    if (type === 'destination') setDestination(location);
    setSearchVisible(null);
    calculateRoute();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado completo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Buenos días</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{points} Pts</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchInput}
            onPress={() => setSearchVisible('origin')}
          >
            <MaterialIcons name="radio-button-checked" size={16} color="#4CAF50" />
            <Text style={styles.inputText}>
              {origin?.name || 'Seleccionar origen'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchInput}
            onPress={() => setSearchVisible('destination')}
          >
            <MaterialIcons name="location-on" size={16} color="#F44336" />
            <Text style={styles.inputText}>
              {destination?.name || 'Seleccionar destino'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Buscador de ubicaciones */}
      {searchVisible && (
        <View style={styles.searchModal}>
          <FlatList
            data={locations}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleLocationSelect(item, searchVisible)}
              >
                <Text style={styles.locationName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Mapa */}
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation?.latitude || 4.6097,
          longitude: userLocation?.longitude || -74.0817,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation}>
            <Animated.View style={[styles.pulseEffect, animatedStyles]}>
              <View style={styles.innerDot} />
            </Animated.View>
          </Marker>
        )}

        {origin && (
          <Marker coordinate={{ latitude: origin.lat, longitude: origin.lng }}>
            <View style={styles.markerPin}>
              <MaterialIcons name="place" size={28} color="#4CAF50" />
              <Text style={styles.markerText}>Origen</Text>
            </View>
          </Marker>
        )}

        {destination && (
          <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }}>
            <View style={styles.markerPin}>
              <MaterialIcons name="place" size={28} color="#F44336" />
              <Text style={styles.markerText}>Destino</Text>
            </View>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#4CAF50"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Selector de transporte */}
      <View style={styles.transportContainer}>
        {['bici', 'moto', 'carro'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.transportButton,
              selectedTransport === type && styles.selectedTransport
            ]}
            onPress={() => setSelectedTransport(type)}
          >
            <MaterialIcons
              name={
                type === 'bici' ? 'pedal-bike' :
                  type === 'moto' ? 'motorcycle' : 'directions-car'
              }
              size={28}
              color={selectedTransport === type ? '#FFF' : '#4CAF50'}
            />
            <Text style={[
              styles.transportText,
              selectedTransport === type && styles.selectedTransportText
            ]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A237E',
  },
  pointsContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 2,
  },
  pointsText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    gap: 8,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    gap: 8,
  },
  inputText: {
    color: '#333',
    fontSize: 16,
    flex: 1,
  },
  searchModal: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 2,
    elevation: 4,
    maxHeight: 200,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  locationName: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    flex: 1,
  },
  transportContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transportButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    width: width * 0.28,
    alignItems: 'center',
  },
  selectedTransport: {
    backgroundColor: '#4CAF50',
  },
  transportText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  selectedTransportText: {
    color: '#FFF',
  },
  pulseEffect: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF5020',
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  markerPin: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    elevation: 4,
  },
  markerText: {
    fontSize: 10,
    color: '#333',
    marginTop: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;