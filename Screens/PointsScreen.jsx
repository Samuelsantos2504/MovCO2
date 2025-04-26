import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  BackHandler,
  Modal,
} from 'react-native';
import {Alert} from 'react-native';
import {styles} from './styles/PointsScreen.js';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PointsScreen({navigation}) {
  const [filtro, setFiltro] = useState ('');

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

  function Logout () {
    Alert.alert (
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log ('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: () => {
            AsyncStorage.removeItem ('isLoggedIn');
            navigation.navigate ('Login');
          },
        },
      ]
    );
  }

  return (
    <View classname="Contenedor_General" style={styles.container}>
      <View classname="Contenedor_Titulo" style={styles.titleContainer}>

        <TouchableOpacity>
            
        </TouchableOpacity>
        <Text style={styles.titleA}>Redime tus puntos</Text>
      </View>

      <View classname="Contenedor_Puntos" style={styles.pointsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={Logout}>
          <Text style={styles.loginText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
