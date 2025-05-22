import React, { useEffect, useState, useMemo, useCallback
} from 'react';
import { styles } from './styles/MapScreen.js';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity, Dimensions, TextInput, FlatList, Platform, BackHandler,} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserPoints } from '../funcionesCarga.js';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { actualizarPuntos } from '../funcionesCarga.js';


export default function MapScreen() {

  
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [searchVisible, setSearchVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransport, setSelectedTransport] = useState('carro');
  const [points, setPoints] = useState(1500);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const rutaname = useRoute();
  const { userName } = rutaname.params || {};
  const navigation = useNavigation ();

  async function cargarPuntos() {
    try {
      const userId = await AsyncStorage.getItem('email'); 
      if (!userId) {
        console.warn('No se encontró el email del usuario.');
        return;
      }
      const puntos = await getUserPoints(userId);
      console.log('Puntos:', puntos);
      if (puntos !== null) {
        setPoints(puntos);
      } else {
        console.warn('No se pudieron cargar los puntos.');
      }
    } catch (error) {
      console.error('Error cargando puntos:', error);
    }
  }

  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Lista de ubicaciones en Bogotá
  const locations = [
    { name: 'Plaza Bolívar', lat: 4.5981, lng: -74.0760 },
    { name: 'Parque Simón Bolívar', lat: 4.6584, lng: -74.0935 },
    { name: 'Monserrate', lat: 4.6055, lng: -74.0560 },
    { name: 'Museo del Oro', lat: 4.6010, lng: -74.0727 },
    { name: 'Usaquén', lat: 4.6982, lng: -74.0300 },
    { name: 'Centro Comercial Andino', lat: 4.6687, lng: -74.0532 },
    { name: 'Jardín Botánico', lat: 4.6592, lng: -74.0970 },
    { name: 'Zona T', lat: 4.6695, lng: -74.0526 },
    { name: 'Movistar Arena', lat: 4.6462, lng: -74.0788 },
    { name: 'Parque de la 93', lat: 4.6761, lng: -74.0498 },
    { name: 'Museo Nacional', lat: 4.6151, lng: -74.0682 },
    { name: 'Planetario de Bogotá', lat: 4.6135, lng: -74.0687 },
    { name: 'Maloka', lat: 4.6586, lng: -74.1115 },
  ];

  
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
  }, []);

  useEffect(() => {
    cargarPuntos();
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

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  }

  useEffect(() => {
    if (origin && destination) {
      const dist = haversine(origin.lat, origin.lng, destination.lat, destination.lng);
      setCalculatedDistance(dist);
    } else {
      setCalculatedDistance(null);
    }
  }, [origin, destination]);


  useFocusEffect (
      useCallback (() => {
        const onBackPress = () => {
          BackHandler.exitApp ();
          return true;
        };
  
        BackHandler.addEventListener ('hardwareBackPress', onBackPress);
  
        return () =>
          BackHandler.removeEventListener ('hardwareBackPress', onBackPress);
      }, [])
    );

  const finalDistance = useMemo(() => {
    if (!calculatedDistance) return 0;
    if (selectedTransport === 'bici') return calculatedDistance * 1.0;
    if (selectedTransport === 'moto') return calculatedDistance * 0.75;
    if (selectedTransport === 'carro') return calculatedDistance * 0.5;
    return calculatedDistance;
  }, [calculatedDistance, selectedTransport]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

 

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 40 : 0 }]}>
      {/* Encabezado completo */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Buenos días{userName ? `, ${userName}` : ''}</Text>
          <View style={styles.pointsContainer}>
          <TouchableOpacity onPress={() =>  navigation.navigate('Puntos')}>
            <FontAwesome5 name="gift" size={20} color="#FFD700" style={{ marginRight: 5 }} />
            <Text style={styles.pointsText}>{points} Pts</Text>
            </TouchableOpacity>
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

      <View style={styles.transportContainer}>
        {/* Subview solo para los botones en fila */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                color={selectedTransport === type ? '#FFF' : '#2cb67d'}
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

        {/* Mostrar solo si hay origen y destino */}
        {origin && destination && (
          <View style={{
            marginTop: 16,
            backgroundColor: '#FFF',
            borderRadius: 20,
            padding: 16,
            alignItems: 'center',
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            width: '100%',
          }}>
            {finalDistance > 0 && (
              <Text style={styles.distanceText}>
                Puntos Aproximados: {finalDistance.toFixed(2)} m
              </Text>
            )}
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                Alert.alert(
                  'Confirmar',
                  `¿Deseas finalizar el viaje y guardar ${finalDistance.toFixed(2)} puntos?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Aceptar', onPress: () => {
                      actualizarPuntos(finalDistance, cargarPuntos); // ⬅️ pasa cargarPuntos como callback
                    }
                     },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text style={styles.startButtonText}>Iniciar viaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>


    </View> 
  );
}
