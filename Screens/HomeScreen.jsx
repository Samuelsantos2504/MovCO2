import React from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: height * 0.68, 
    opacity: 0.7, 
    marginTop: 50,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    width: '70%',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  butto: {
    backgroundColor: '#FFFFFF',
    width: '70%',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonTex: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#337C8D',
    fontSize: 16,
  },
});
