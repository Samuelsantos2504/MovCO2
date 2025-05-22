// funcionesCarga.js
import supabase from './supabaseClient'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Alert } from 'react-native'; 

export async function getUserPoints(userEmail) {
  try {
    console.log('Buscando puntos para:', userEmail);

    const { data, error } = await supabase
      .from('ActiveUsers')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();

    if (error) {
      console.error('Error al obtener puntos:', error);
      return null;
    }

    return data?.Puntos ?? null;
  } catch (err) {
    console.error('Error inesperado:', err);
    return null;
  }
}

export async function actualizarPuntos(finalDistance, onSuccess) {
  try {
    const email = await AsyncStorage.getItem('email');
    if (!email) {
      console.warn('No se encontró el email en AsyncStorage.');
      return;
    }

    const { data: userData, error: fetchError } = await supabase
      .from('ActiveUsers')
      .select('Puntos')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('Error obteniendo puntos actuales:', fetchError);
      Alert.alert('Error', 'No se pudieron obtener los puntos actuales.');
      return;
    }

    const puntosActuales = userData?.Puntos || 0;
    const nuevosPuntos = Math.round(puntosActuales + finalDistance);

    const { error: updateError } = await supabase
      .from('ActiveUsers')
      .update({ Puntos: nuevosPuntos })
      .eq('email', email);

    if (updateError) {
      console.error('Error actualizando puntos:', updateError);
      Alert.alert('Error', 'No se pudieron actualizar los puntos.');
    } else {
      console.log('Puntos actualizados a:', nuevosPuntos);
      Alert.alert('¡Éxito!', `Tus nuevos puntos son ${nuevosPuntos}.`);
      if (typeof onSuccess === 'function') {
        onSuccess(); // ⬅️ se llama cargarPuntos() desde aquí
      }
    }
  } catch (error) {
    console.error('Error en actualizarPuntos:', error);
    Alert.alert('Error', 'Ocurrió un problema actualizando los puntos.');
  }
}
