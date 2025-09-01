import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { styles } from './styles/MapScreenStyles.js';
import { 
  View, 
  ActivityIndicator, 
  Alert, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Platform, 
  BackHandler
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
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserPoints, actualizarPuntos } from '../funcionesCarga.js';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

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
  const navigation = useNavigation();

  // Animación del marcador de usuario
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

  // Animación del pulso
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
  }, []);

  // Cargar puntos del usuario
  async function cargarPuntos() {
    try {
      const userId = await AsyncStorage.getItem('email'); 
      if (!userId) return;
      const puntos = await getUserPoints(userId);
      if (puntos !== null) setPoints(puntos);
    } catch (error) {
      console.error('Error cargando puntos:', error);
    }
  }

  useEffect(() => {
    cargarPuntos();
  }, []);

  // Pedir permisos y obtener ubicación del usuario
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

  // Calcular ruta con OSRM
  const calculateRoute = async () => {
    if (origin && destination) {
      const url = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          setRoute(routeCoordinates);
          setCalculatedDistance(data.routes[0].distance); // en metros
        } else {
          Alert.alert('Error de ruta', 'No se pudo encontrar una ruta entre los puntos seleccionados.');
          setRoute([]);
          setCalculatedDistance(null);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        Alert.alert('Error de conexión', 'No se pudo calcular la ruta. Intenta de nuevo.');
        setRoute([]);
        setCalculatedDistance(null);
      }
    }
  };

  // Recalcular ruta al cambiar origen/destino
  useEffect(() => {
    calculateRoute();
  }, [origin, destination]);

  // Seleccionar ubicación (origen o destino)
  const handleLocationSelect = (location, type) => {
    if (type === 'origin') setOrigin(location);
    if (type === 'destination') setDestination(location);
    setSearchVisible(null);
  };

  // Cerrar la app con botón atrás
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  // Ajustar distancia según transporte
  const finalDistance = useMemo(() => {
    if (!calculatedDistance) return 0;
    if (selectedTransport === 'bici') return calculatedDistance * 1.0;
    if (selectedTransport === 'moto') return calculatedDistance * 0.75;
    if (selectedTransport === 'carro') return calculatedDistance * 0.5;
    return calculatedDistance;
  }, [calculatedDistance, selectedTransport]);

  // Loader
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 40 : 0 }]}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Buenos días{userName ? `, ${userName}` : ''}</Text>
          <View style={styles.pointsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Puntos')}>
              <Text style={styles.pointsText}>{points} Pts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inputs de búsqueda */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchInput} onPress={() => setSearchVisible('origin')}>
            <MaterialIcons name="radio-button-checked" size={16} color="#4CAF50" />
            <Text style={styles.inputText}>{origin?.name || 'Seleccionar origen'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchInput} onPress={() => setSearchVisible('destination')}>
            <MaterialIcons name="location-on" size={16} color="#F44336" />
            <Text style={styles.inputText}>{destination?.name || 'Seleccionar destino'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de búsqueda */}
      {searchVisible && (
        <View style={styles.searchModal}>
          <FlatList
            data={locations}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.locationItem} onPress={() => handleLocationSelect(item, searchVisible)}>
                <Text style={styles.locationName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Mapa */}
      <MapView
        provider={Platform.OS === "android" ? MapView.PROVIDER_GOOGLE : null}
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
          <Polyline coordinates={route} strokeColor="#4CAF50" strokeWidth={4} />
        )}
      </MapView>

      {/* Botones de transporte */}
      <View style={styles.transportContainer}>
        {['bici', 'moto', 'carro'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.transportButton, selectedTransport === type && styles.selectedTransport]}
            onPress={() => setSelectedTransport(type)}
          >
            <MaterialIcons
              name={type === 'bici' ? 'pedal-bike' : type === 'moto' ? 'motorcycle' : 'directions-car'}
              size={28}
              color={selectedTransport === type ? '#FFF' : '#4CAF50'}
            />
            <Text style={[styles.transportText, selectedTransport === type && styles.selectedTransportText]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
