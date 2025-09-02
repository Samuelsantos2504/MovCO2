import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from './styles/SubScreensStyles.js';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://zealous-fulfillment-development.up.railway.app/admin';
const API_PAYMENT = 'https://zealous-fulfillment-development.up.railway.app/pagos';

export default function SubScreen({ route }) {
  const navigation = useNavigation();

  const [filtro, setFiltro] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [email, setEmail] = useState('usuario@ejemplo.com');

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState(null);

  // Cargar suscripciones desde la API
  async function cargarSuscripciones() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/suscripcion/all`);
      if (!response.ok) throw new Error('Error cargando suscripciones');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las suscripciones.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarSuscripciones();
  }, []);

  // Crear orden y abrir WebView
  async function handlePayment(sub) {
    setSelectedSub(sub);

    try {
      const response = await fetch(`${API_PAYMENT}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: sub.amount,
          currency: 'USD',
          description: sub.description,
        }),
      });

      const data = await response.json();
      if (!data.approvalUrl) throw new Error('No se obtuvo approval URL');

      setApprovalUrl(data.approvalUrl);
      setWebViewVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Ocurrió un problema al procesar el pago.');
    }
  }

  // Capturar navegación en WebView
  async function handleWebViewNavigation(navState) {
    const { url } = navState;

    if (!url) return;

    if (url.includes('success')) {
      setWebViewVisible(false);
      Alert.alert('Pago aprobado', 'Tu pago fue exitoso!');

      try {
        const response = await fetch(`${API_PAYMENT}/capture-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            SubId: selectedSub.id,
            SubType: selectedSub.name,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          Alert.alert('Error', 'No se pudo completar la suscripción.');
        } else {
          navigation.navigate('Mapa');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Ocurrió un problema al actualizar la suscripción.');
      }
    } else if (url.includes('cancel')) {
      setWebViewVisible(false);
      Alert.alert('Pago cancelado', 'El pago fue cancelado.');
    }
  }

  const filteredSubs = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(filtro.toLowerCase())
  );

  // Cerrar sesión
  function Logout() {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', onPress: () => navigation.navigate('Login') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#2cb67d', fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titleA}>Suscripciones</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.inputA}
          placeholder="Buscar suscripción..."
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2cb67d" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer}>
          {filteredSubs.map((sub) => (
            <View key={sub.id} style={styles.companyButton}>
              <Text style={styles.companyName}>{sub.name}</Text>
              <Text style={styles.companyPrice}>${sub.amount}</Text>
              <Text style={styles.companyDescription}>{sub.description}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#2cb67d',
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 8,
                }}
                onPress={() => handlePayment(sub)}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Pagar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.pointsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={Logout}>
          <Text style={styles.loginText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal con WebView */}
      <Modal visible={webViewVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            source={{ uri: approvalUrl }}
            onNavigationStateChange={handleWebViewNavigation}
            startInLoadingState
          />
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 15,
              alignItems: 'center',
            }}
            onPress={() => setWebViewVisible(false)}
          >
            <Text style={{ color: '#fff' }}>Cerrar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
