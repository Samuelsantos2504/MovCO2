import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
  Pressable,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {FontAwesome, AntDesign} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LoginScreen () {
  //Manejo de la fecha de nacimiento
  const [date, setDate] = useState (new Date ());
  const [show, setShow] = useState (false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow (false); // cerrar al seleccionar
    setDate (currentDate);
  };

  const formattedDate = date.toLocaleDateString ();

  //Manejo de los datos del usuario
  const [email, setEmail] = useState ('');
  const [nombre, setNombre] = useState ('');
  const [apellido, setApellido] = useState ('');
  const [telefono, setTelefono] = useState ('');

  //Manejo de seguridad y vista de contraseña
  const [password, setPassword] = useState ('');
  const [rememberMe, setRememberMe] = useState (false);
  const [secureText, setSecureText] = useState (true);

  //Manejo de la vista de registro y login
  const [isRegisterView, setIsRegisterView] = useState (false);
  const [isLoginView, setIsLoginView] = useState (true);

  const LoginIngreso = () => {
    setIsLoginView (false);
  };

  return (
    <LinearGradient
      colors={[
        '#000000',
        'rgb(66, 252, 131)',
        'rgb(66, 252, 131)',
        'rgb(36, 124, 67)',
      ]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.card}>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={styles.activeTab}
            onPress={() => {
              setIsLoginView (true);
              setIsRegisterView (false);
            }}
          >
            <Text style={styles.activeText}>Ingresar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsLoginView (false);
              setIsRegisterView (true);
            }}
          >
            <Text style={styles.inactiveText}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        {isRegisterView &&
          <View className="LoginScreen__container">
            <View>
              <View style={styles.tabRowLabInp}>
                <Text style={styles.TextLabelP}>Nombre</Text>
                <Text style={styles.TextLabelP}>Apellido</Text>
              </View>

              <View style={styles.tabRowLabInp}>
                <TextInput
                  style={styles.inputA}
                  placeholder="Samuel"
                  keyboardType="default"
                  value={nombre}
                  onChangeText={setNombre}
                />
                <TextInput
                  style={styles.inputA}
                  placeholder="Rodriguez"
                  keyboardType="default"
                  value={apellido}
                  onChangeText={setApellido}
                />
              </View>

            </View>

            <Text style={styles.TextLabel}>Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="samuelrod@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.TextLabel}>Telefono</Text>
            <TextInput
              style={styles.input}
              placeholder="(312)123-4567"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <Text style={styles.TextLabel}>Fecha de Nacimiento</Text>
            <Pressable onPress={() => setShow (true)}>
              <TextInput
                value={date.toLocaleDateString ()}
                editable={false}
                pointerEvents="none"
                style={styles.input}
              />
            </Pressable>
            {show &&
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChange}
              />}

            <Text style={styles.TextLabel}>Contraseña</Text>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Contraseña"
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginText}>Ingresar</Text>
            </TouchableOpacity>

          </View>}

        {isLoginView &&
          <View className="LoginScreen__container">
            <TextInput
              style={styles.input}
              placeholder="Correo"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="Contraseña"
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText (!secureText)}>
                <FontAwesome
                  name={secureText ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          </View>}

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create ({
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
    elevation: 20,
  },

  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  tabRowLabInp: {
    flexDirection: 'row',
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

  inputA: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '48%',
    marginRight: '2%',
  },

  TextLabelP: {
    marginRight: 97,
    marginLeft: 5,
    color: 'gray',
    paddingBottom: 10,
  },

  TextLabel: {
    marginRight: 97,
    marginLeft: 5,
    color: 'gray',
    paddingBottom: 10,
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
