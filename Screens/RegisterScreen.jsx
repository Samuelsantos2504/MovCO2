import React, {useState, useCallback} from 'react';
import {View, Text, TextInput, Button, BackHandler, TouchableOpacity, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/HomeScreen.js'
import {Alert} from 'react-native';



export default function RegisterScreen({navigation}) {
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');

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

  function Logout(){
    Alert.alert ('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
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
    ]);
  }

  return (
    <View style={{padding: 20}}>
      <Text>Registro</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Registrar"  />
      <View>
        <TouchableOpacity style={styles.button} onPress={Logout}>
          <Text style={{color: 'blue'}} ></Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
}
