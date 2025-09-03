import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  View, ActivityIndicator, Alert, Text, TouchableOpacity, Platform, BackHandler 
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/MapScreenStyles.js';

export default function MapScreen() {
  const API_URL = 'https://zealous-fulfillment-development.up.railway.app/users';
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransport, setSelectedTransport] = useState('carro');
  const [points, setPoints] = useState(0);
  const [subType, setSubType] = useState(null); 
  const [tripPoints, setTripPoints] = useState(0); 
  const [tripDistance, setTripDistance] = useState(0);

  const routeParams = useRoute();
  const { userName } = routeParams.params || {};
  const navigation = useNavigation();
                            
  // Animación del marcador de usuario
  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Obtener tipo de suscripción
  const cargarSubType = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      if (!email) return;

      const res = await fetch(`${API_URL}/user/${email}/Subtype`);
      if (!res.ok) {
        console.error("Error al obtener subType:", res.status);
        return;
      }

      const data = await res.json();
      console.log("SubType recibido:", data);
      setSubType(data.subType || "Sin plan"); // Fallback en caso de null
    } catch (err) {
      console.error("Error cargar subType:", err);
    }
  };

  useEffect(() => {
    cargarSubType();
  }, []);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
  }, []);

  // Cargar puntos del usuario desde API
  const cargarPuntos = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      if (!email) {
        console.warn('No se encontró email en AsyncStorage.');
        return;
      }
      console.log('Email obtenido:', email);

      const url = `${API_URL}/user/${email}/points`;
      console.log('Intentando fetch a:', url);

      const res = await fetch(url);
      console.log('Respuesta fetch:', res.status, res.ok);

      if (!res.ok) {
        console.error('Fetch falló con status:', res.status);
        const errorData = await res.text();
        console.error('Respuesta del servidor:', errorData);
        return;
      }

      const data = await res.json();
      console.log('Datos recibidos:', data);

      if (data.puntos !== undefined) {
        setPoints(data.puntos);
        console.log('Puntos actualizados:', data.puntos);
      } else {
        console.warn('No se encontró la propiedad "puntos" en la respuesta.');
      }
    } catch (error) {
      console.error('Error cargando puntos:', error);
    }
  };

  useEffect(() => { cargarPuntos(); }, []);

  // Obtener ubicación del usuario
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

  const calculateRoute = async () => {
    if (!origin || !destination) return;

    const url = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(c => ({
          latitude: c[1],
          longitude: c[0],
        }));
        setRoute(coords);
        setTripDistance(data.routes[0].distance);
      } else {
        Alert.alert('Error de ruta', 'No se pudo encontrar una ruta entre los puntos seleccionados.');
        setRoute([]);
      }
    } catch (err) {
      console.error('Error fetch ruta:', err);
      Alert.alert('Error', 'No se pudo calcular la ruta. Intenta de nuevo.');
    }
  };

  // Calcular puntos del viaje sin afectar los puntos del usuario
  const calcularTripPoints = (distance) => {
    if (!distance) return 0;

    let multiplierTransport = 1;
    if (selectedTransport === 'moto') multiplierTransport = 1.5;
    if (selectedTransport === 'carro') multiplierTransport = 1.25;
    if (selectedTransport === 'bici') multiplierTransport = 2.0;

    let multiplierMembership = 1;
    if (subType === 'Silver') multiplierMembership = 2;
    if (subType === 'Gold') multiplierMembership = 3;
    if (subType === 'Black') multiplierMembership = 4;

    const basePoints = (distance / 1000) * multiplierTransport;
    return Math.round(basePoints * multiplierMembership);
  };

  // Actualizar tripPoints automáticamente al cambiar distancia, transporte o subType
  useEffect(() => {
    if (tripDistance > 0) {
      const puntosEstimados = calcularTripPoints(tripDistance);
      setTripPoints(puntosEstimados);
    }
  }, [tripDistance, selectedTransport, subType]);

  const actualizarPuntosAPI = async (calculatedDistance) => {
    try {
      const email = await AsyncStorage.getItem('email');
      if (!email) return;

      // --- Multiplicador según transporte ---
      let multiplierTransport = 1;
      if (selectedTransport === 'moto') multiplierTransport = 1.5;
      if (selectedTransport === 'carro') multiplierTransport = 1.25;
      if (selectedTransport === 'bici') multiplierTransport = 2.0;

      // --- Multiplicador según membresía ---
      let multiplierMembership = 1;
      if (subType === 'Silver') multiplierMembership = 2;
      if (subType === 'Gold') multiplierMembership = 3;
      if (subType === 'Black') multiplierMembership = 4;

      // --- Calcular puntos ganados ---
      const basePoints = (calculatedDistance / 1000) * multiplierTransport;
      const earnedPoints = Math.round(basePoints * multiplierMembership);

      // --- Enviar a la API ---
      const res = await fetch(`${API_URL}/user/${email}/updatePoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalDistance: earnedPoints })
      });

      const data = await res.json();
      if (res.ok) {
        setPoints(data.nuevosPuntos);
        Alert.alert("¡Viaje iniciado 🚗!", `Ganaste ${earnedPoints} puntos`);
      } else {
        console.error('Error actualizar puntos:', data.error);
      }
    } catch (error) {
      console.error('Error actualizar puntos API:', error);
    }
  };

  useEffect(() => { calculateRoute(); }, [origin, destination, selectedTransport]);

  // Manejar botón atrás
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

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Puntos */}
            <View style={styles.pointsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Puntos')}>
                <Text style={styles.pointsText}>{points} Pts</Text>
              </TouchableOpacity>
            </View>

            {/* Cuadrado de Suscripción */}
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>
                {subType ? subType : "Cargando..."}
              </Text>
            </View>
          </View>
        </View>
      </View>

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
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          if (!origin) setOrigin({ lat: latitude, lng: longitude });
          else if (!destination) setDestination({ lat: latitude, lng: longitude });
          else {
            setOrigin({ lat: latitude, lng: longitude });
            setDestination(null);
            setRoute([]);
          }
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
              <MaterialIcons name="place" size={28}  color="#4CAF50" />
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

      {/* Cuadro de información del viaje */}
      {origin && destination && (
        <View style={styles.tripInfoBox}>
          <Text style={styles.tripInfoText}>Distancia: {(tripDistance / 1000).toFixed(2)} km</Text>
          <Text style={styles.tripInfoText}>Puntos del viaje: {tripPoints}</Text>

          <TouchableOpacity
            style={styles.startTripButton}
            onPress={() => actualizarPuntosAPI(tripDistance)}
          >
            <Text style={styles.startTripButtonText}>Iniciar viaje</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botones transporte */}
      <View style={styles.transportContainer}>
        {['bici', 'moto', 'carro'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.transportButton, selectedTransport === type && styles.selectedTransport]}
            onPress={() => setSelectedTransport(type)}
          >
            <MaterialIcons
              name={type === 'bici' ? 'pedal-bike' : type === 'moto' ? 'motorcycle' : 'directions-car'}
              size={28}
              color={selectedTransport === type ? '#ffffff' : '#4CAF50'}
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
