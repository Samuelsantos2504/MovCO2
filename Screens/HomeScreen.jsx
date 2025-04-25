import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Dimensions, BackHandler} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useNavigation,  } from '@react-navigation/native';
import { styles } from './styles/HomeScreen.js'



export const { altura } = Dimensions.get('window');

export default function HomeScreen () {
  
  const navigation = useNavigation();

  const handlePressLogin = () => {
    navigation.navigate('Login'); 
  };

  const onBackPress = () => {
          BackHandler.exitApp ();
          return true;
        };
  
  BackHandler.addEventListener ('hardwareBackPress', onBackPress);
  

  return (
    <LinearGradient
    colors={['#58DD7C', '#58DD7C', '#1C1919', '#1C1919']}
    locations={[0, 0.1, 0.95, 1]} // Valores ajustados
    start={{x: 0.5, y: 1}}
    end={{x: 0.5, y: 0}}
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

