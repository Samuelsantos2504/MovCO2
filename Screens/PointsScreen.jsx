import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { styles } from './styles/PointsScreenStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { getUserPoints } from '../funcionesCarga.js'; 

export default function PointsScreen({ navigation }) {
    const API_URL = 'https://zealous-fulfillment-development.up.railway.app/users';
    const [filtro, setFiltro] = useState('');
    const [points, setPoints] = useState(1500);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const bonos = [
        { puntos: 1000, valor: 10000 },
        { puntos: 2000, valor: 20000 },
        { puntos: 3000, valor: 30000 },
        { puntos: 4000, valor: 40000 },
        { puntos: 5000, valor: 50000 },
    ];

    async function cargarPuntos() {
        try {
            const userId = await AsyncStorage.getItem('email'); 
            if (!userId) {
                console.warn('No se encontró el email del usuario.');
                return;
            }
            const puntos = await getUserPoints(userId);
            if (puntos !== null) {
                setPoints(puntos);
            } else {
                console.warn('No se pudieron cargar los puntos.');
            }
        } catch (error) {
            console.error('Error cargando puntos:', error);
        }
    }

    useEffect(() => {
        cargarPuntos();
    }, []);

    function Logout() {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', onPress: () => {
                    AsyncStorage.removeItem('isLoggedIn');
                    navigation.navigate('Login');
                }},
            ]
        );
    }

    const empresaIcons = {
        Rappi: require('../assets/rappi.png'),
        D1: require('../assets/d1.png'),
        Éxito: require('../assets/exito.png'),
        Carulla: require('../assets/carulla.png'),
        Jumbo: require('../assets/jumbo.png'),
        Ara: require('../assets/ara.png'),
        Tostao: require('../assets/tostao.png'),
        Colanta: require('../assets/colanta.png'),
        Alpina: require('../assets/alpina.jpg'),
        Postobón: require('../assets/postobon.png'),
        Nutresa: require('../assets/nutresa.png'),
    };

    const empresas = Object.keys(empresaIcons);

    const openModal = (empresa) => {
        setSelectedCompany(empresa);
        setModalVisible(true);
    };

    const canjearBono = async (bono) => {
    try {
            const email = await AsyncStorage.getItem('email');
            if (!email) {
                Alert.alert('Error', 'No se encontró el email del usuario.');
                return;
            }

            // Verificar si el usuario tiene suficientes puntos antes de enviar
            if (points < bono.puntos) {
                Alert.alert('Error', 'No tienes suficientes puntos para este bono.');
                return;
            }

            // Llamada POST a la API
            const response = await fetch(`${API_URL}/user/${email}/redeem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bonoPts: bono.puntos }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Error', data.error || 'No se pudo canjear el bono.');
                return;
            }

            // Actualizar puntos en el estado
            setPoints(data.nuevosPuntos);
            Alert.alert('Éxito', data.message);
            setModalVisible(false);

        } catch (error) {
            console.error('Error canjeando bono:', error);
            Alert.alert('Error', 'Ocurrió un error al canjear el bono.');
        }
    };


    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Mapa')}>
                    <Icon name="arrow-back" size={24} color="#2cb67d" />
                </TouchableOpacity>
                <Text style={styles.titleA}>Redime tus puntos</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Subs')}>
                    <Text style={styles.Suscribir}>⭐</Text>
                </TouchableOpacity>
                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsText}>{points} Pts</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.inputA}
                    placeholder="Buscar empresa..."
                    value={filtro}
                    onChangeText={setFiltro}
                />
            </View>

            <ScrollView contentContainerStyle={styles.gridContainer}>
                {empresas
                    .filter((empresa) => empresa.toLowerCase().includes(filtro.toLowerCase()))
                    .map((empresa, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.companyButton}
                            onPress={() => openModal(empresa)}
                        >
                            <Image source={empresaIcons[empresa]} style={styles.companyIcon} />
                            <Text style={styles.companyText}>{empresa}</Text>
                        </TouchableOpacity>
                    ))}
            </ScrollView>

            <View style={styles.pointsContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={Logout}>
                    <Text style={styles.loginText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de Canje */}
            <Modal
    visible={modalVisible}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setModalVisible(false)}
>
    {/* Fondo opacado */}
    <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        {/* Modal blanco */}
        <View style={{
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
        }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 15
            }}>{selectedCompany}</Text>

            {bonos.map((bono, index) => (
                <TouchableOpacity
                    key={index}
                    style={{
                        width: '100%',
                        paddingVertical: 10,
                        marginVertical: 5,
                        borderRadius: 8,
                        backgroundColor: points >= bono.puntos ? '#2cb67d' : '#ccc',
                        alignItems: 'center',
                    }}
                    onPress={() => canjearBono(bono)}
                    disabled={points < bono.puntos}
                >
                    <Text style={{
                        color: points >= bono.puntos ? '#fff' : '#fff',
                        fontWeight: 'bold'
                    }}>
                        {bono.puntos} pts → ${bono.valor}
                    </Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                style={{
                    marginTop: 10,
                    paddingVertical: 10,
                    width: '100%',
                    borderRadius: 8,
                    backgroundColor: '#f44336',
                    alignItems: 'center'
                }}
                onPress={() => setModalVisible(false)}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    </View>
          </Modal>

        </SafeAreaView>
    );
}
