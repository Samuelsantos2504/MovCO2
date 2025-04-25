import { Alert } from 'react-native';

export function handleRegisterError(error) {
  if (error.message.includes('Network request failed')) {
    Alert.alert('Sin conexión', 'Error de conexión. Verifica tu red.');
  } else if (error.message.includes('Todos los campos')) {
    Alert.alert('Campos incompletos', error.message);
  } else if (error.message.includes('correo') || error.message.includes('email')) {
    Alert.alert('Correo inválido', 'El correo ya está registrado o no es válido.');
  } else {
    Alert.alert('Error inesperado', `Ocurrió un error: ${error.message}`);
  }

  console.error('Error en registerUser:', error);
}
