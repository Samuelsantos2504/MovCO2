import React from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/HomeScreen.js'


const { height } = Dimensions.get('window');

export default function HomeScreen () {
  
  const navigation = useNavigation();

  const handlePressLogin = () => {
    navigation.navigate('Login'); 
  };

  return (
    <LinearGradient
      colors={['#000000', 'rgb(66, 252, 131)','rgb(66, 252, 131)', 'rgb(36, 124, 67)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={styles.container}
    >
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <Image
            style={styles.image}
            source={require('../PantallaInit.png')} // Asegúrate de tener el nombre correcto
            resizeMode="contain"
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePressLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.butto}>
              <Text style={styles.buttonTex}>Registro</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </LinearGradient>
  );
}

