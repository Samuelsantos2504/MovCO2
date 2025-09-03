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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './styles/SubScreensAdminStyles.js';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://zealous-fulfillment-development.up.railway.app/admin';

export default function SubScreen({ route }) {
  const navigation = useNavigation();

  const [filtro, setFiltro] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // "crear" | "editar" | "eliminar"
  const [subId, setSubId] = useState('');
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subDuration, setSubDuration] = useState('');
  const [subBenefits, setSubBenefits] = useState('');

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

  // Crear suscripción
  async function crearSuscripcion() {
    try {
      const response = await fetch(`${API_URL}/suscripcion/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: subId,
          name: subName,
          description: subDesc,
          amount: subAmount,
          durationMonths: subDuration,
          benefits: subBenefits,
        }),
      });
      if (!response.ok) throw new Error('Error creando suscripción');
      Alert.alert('Éxito', 'Suscripción creada correctamente.');
      cargarSuscripciones();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear la suscripción.');
    } finally {
      setModalVisible(false);
    }
  }

  // Editar suscripción
  async function editarSuscripcion() {
    try {
      const response = await fetch(`${API_URL}/suscripcion/update/${subId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subName,
          amount: subAmount,
          description: subDesc,
        }),
      });
      if (!response.ok) throw new Error('Error editando suscripción');
      Alert.alert('Éxito', 'Suscripción editada correctamente.');
      cargarSuscripciones();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo editar la suscripción.');
    } finally {
      setModalVisible(false);
    }
  }

  // Eliminar suscripción
  async function eliminarSuscripcion() {
    try {
      const response = await fetch(`${API_URL}/suscripcion/delete/${subId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error eliminando suscripción');
      Alert.alert('Éxito', 'Suscripción eliminada correctamente.');
      cargarSuscripciones();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo eliminar la suscripción.');
    } finally {
      setModalVisible(false);
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Admin')}>
          <Text style={{ color: '#2cb67d', fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titleA}>Suscripciones</Text>

        {/* Botones superiores */}
        <View style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
          <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              setModalType('crear');
              setSubId('');
              setSubName('');
              setSubAmount('');
              setSubDesc('');
              setModalVisible(true);
            }}
          >
            <Text style={{ color: '#2cb67d' }}>Crear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              setModalType('editar');
              setModalVisible(true);
            }}
          >
            <Text style={{ color: '#2cb67d' }}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              setModalType('eliminar');
              setModalVisible(true);
            }}
          >
            <Text style={{ color: '#e63946' }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
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
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.pointsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={Logout}>
          <Text style={styles.loginText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 20,
            }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                {/* Crear */}
                {modalType === 'crear' && (
                  <>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Crear Suscripción</Text>

                    <TextInput
                      placeholder="Id"
                      value={subId}
                      onChangeText={setSubId}
                      style={[styles.inputA, styles.modalInput]}
                    />
                    <TextInput
                      placeholder="Nombre"
                      value={subName}
                      onChangeText={setSubName}
                      style={[styles.inputA, styles.modalInput]}
                    />
                    <TextInput
                      placeholder="Monto"
                      value={subAmount}
                      onChangeText={setSubAmount}
                      style={[styles.inputA, styles.modalInput]}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Descripción"
                      value={subDesc}
                      onChangeText={setSubDesc}
                      style={[styles.inputA, styles.modalInput]}
                    />
                    <TextInput
                      placeholder="Duración (meses)"
                      value={subDuration}
                      onChangeText={setSubDuration}
                      style={[styles.inputA, styles.modalInput]}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Beneficios"
                      value={subBenefits}
                      onChangeText={setSubBenefits}
                      style={[styles.inputA, styles.modalInput]}
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={crearSuscripcion}>
                      <Text style={styles.loginText}>Guardar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Editar */}
                {modalType === 'editar' && (
                  <>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Editar Suscripción</Text>
                    <TextInput
                      placeholder="ID de suscripción"
                      value={subId}
                      onChangeText={setSubId}
                      style={[styles.inputA, styles.modalInput]}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Nombre"
                      value={subName}
                      onChangeText={setSubName}
                      style={[styles.inputA, styles.modalInput]}
                    />
                    <TextInput
                      placeholder="Monto"
                      value={subAmount}
                      onChangeText={setSubAmount}
                      style={[styles.inputA, styles.modalInput]}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Descripción"
                      value={subDesc}
                      onChangeText={setSubDesc}
                      style={[styles.inputA, styles.modalInput]}
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={editarSuscripcion}>
                      <Text style={styles.loginText}>Actualizar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Eliminar */}
                {modalType === 'eliminar' && (
                  <>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Eliminar Suscripción</Text>
                    <TextInput
                      placeholder="ID de suscripción"
                      value={subId}
                      onChangeText={setSubId}
                      style={[styles.inputA, styles.modalInput]}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={[styles.loginButton, { backgroundColor: 'red' }]}
                      onPress={eliminarSuscripcion}
                    >
                      <Text style={styles.loginText}>Eliminar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Botón cancelar */}
                <TouchableOpacity
                  style={[styles.loginButton, { marginTop: 10 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.loginText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
