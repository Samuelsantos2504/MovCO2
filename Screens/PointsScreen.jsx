import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  BackHandler,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Alert } from 'react-native';
import { styles } from './styles/PointsScreen.js';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { StatusBar } from 'react-native';
import { getUserPoints } from '../funcionesCarga.js'; 


export default function PointsScreen({ navigation }) {

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

      useEffect(() => {
        cargarPuntos();
      }, []);


    


  const [filtro, setFiltro] = useState('');
  const [points, setPoints] = useState(1500);
  

  function Logout() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: () => {
            AsyncStorage.removeItem('isLoggedIn');
            navigation.navigate('Login');
          },
        },
      ]
    );
  }

  const empresas = [
    'Rappi',
    'D1',
    'Éxito',
    'Carulla',
    'Jumbo',
    'Ara',
    'Tostao',
    'Justo & Bueno',
    'Colanta',
    'Alpina',
    'Postobón',
    'Nutresa',
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Mapa')}
        >
          <Icon name="arrow-back" size={24} color="#2cb67d" />
        </TouchableOpacity>
        <Text style={styles.titleA}>Redime tus puntos</Text>
        <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{points} Pts</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.inputA}
          placeholder="Buscar empresa..."
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {empresas.map((empresa, index) => (
          <TouchableOpacity key={index} style={styles.companyButton}>
            {/* Aquí podrías poner un icono relacionado */}
            <Icon name="storefront-outline" size={40} color="#2cb67d" style={styles.companyIcon} />
            <Text style={styles.companyText}>{empresa}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pointsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={Logout}>
          <Text style={styles.loginText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
