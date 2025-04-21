import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Aquí puedes guardar el usuario
    alert('Usuario registrado');
    navigation.navigate('Login');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Registro</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}
