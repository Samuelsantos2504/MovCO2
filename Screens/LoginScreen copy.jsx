import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [secureText, setSecureText] = useState(true);

  return (
    <LinearGradient
          colors={['#000000', 'rgb(66, 252, 131)','rgb(66, 252, 131)', 'rgb(36, 124, 67)']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.background}
      >
      <View style={styles.overlay} />

      <View style={styles.card}>
        
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeText}>Ingresar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.inactiveText}>Registrarse</Text>
          </TouchableOpacity>
        </View>

  
        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />


        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Contraseña"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <FontAwesome
              name={secureText ? 'eye-slash' : 'eye'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Recordar</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>¿Olvidaste la contraseña?</Text>
          </TouchableOpacity>
        </View>

     
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Ingresar</Text>
        </TouchableOpacity>


        <View style={styles.separator} />

     
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} color="black" />
          <Text style={styles.socialText}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#4267B2" />
          <Text style={styles.socialText}>Continuar con Facebook</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // opcional: oscurece fondo
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2cb67d',
    paddingBottom: 4,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#000',
  },
  inactiveText: {
    color: '#aaa',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  forgot: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#2cb67d',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  socialText: {
    marginLeft: 10,
    fontSize: 14,
  },
});
