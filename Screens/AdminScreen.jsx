import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from "./styles/AdminScreenStyles.js";

const API_URL = "https://zealous-fulfillment-development.up.railway.app/admin";

export default function AdminScreen() {
  const [suscriptores, setSuscriptores] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editarSuscriptor, setEditarSuscriptor] = useState(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    subscribeDate: "",
    renewalDate: "",
    Id: "",
  });

  // Convertir fechas DD/MM/AAAA → YYYY-MM-DD
  const parseFecha = (fecha) => {
    if (!fecha) return null;
    const d = new Date(fecha);
    if (isNaN(d)) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // +1 porque getMonth() arranca en 0
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Obtener suscriptores
  const fetchSuscriptores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/suscriptores`);
      const data = await res.json();
      setSuscriptores(data);
    } catch (error) {
      console.log("Error fetchSuscriptores:", error.message);
    }
    setLoading(false);
  };

  // Obtener suscripciones
  const fetchSuscripciones = async () => {
    try {
      const res = await fetch(`${API_URL}/suscripcion/types`);
      const data = await res.json();
      setSuscripciones(data);
    } catch (error) {
      console.log("Error fetchSuscripciones:", error.message);
    }
  };

  useEffect(() => {
    fetchSuscriptores();
    fetchSuscripciones();
  }, []);

  const filtrados = suscriptores.filter((s) => {
    return (
      s.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.email?.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const abrirModal = (suscriptor = null) => {
    setEditarSuscriptor(suscriptor);
    setForm(
      suscriptor || {
        email: "",
        name: "",
        lastName: "",
        phoneNumber: "",
        birthDate: "",
        subscribeDate: "",
        renewalDate: "",
        Id: "",
      }
    );
    setModalVisible(true);
  };

  const guardar = async () => {
  try {
    // Construimos el payload
    const payload = {
      name: form.name,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      birthDate: parseFecha(form.birthDate),
      subscribeDate: parseFecha(form.subscribeDate),
      renewalDate: parseFecha(form.renewalDate),
      Id: form.Id,
    };

    if (!editarSuscriptor) {
      // Si es nuevo, añadimos el email
      payload.email = form.email;
    }

    const url = editarSuscriptor
      ? `${API_URL}/suscriptores/${form.email}` // email solo en la URL
      : `${API_URL}/suscriptores`;

    const method = editarSuscriptor ? "PUT" : "POST";

    // 👀 Mostrar en consola lo que se envía
    console.log("📡 Método:", method);
    console.log("🌐 URL:", url);
    console.log("📦 Body enviado:", JSON.stringify(payload, null, 2));

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al guardar");
    }

    await fetchSuscriptores();
    setModalVisible(false);
  } catch (error) {
    Alert.alert("Error", error.message);
    console.log("Error guardar:", error.message);
  }
  };


  const eliminar = async (email) => {
    try {
      const res = await fetch(`${API_URL}/suscriptores/${email}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar");
      }

      await fetchSuscriptores();
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log("Error eliminar:", error.message);
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#007BFF"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Barra de búsqueda + Refrescar */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Buscar suscriptor..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity
          style={[
            styles.btnAgregar,
            { marginLeft: 10, paddingHorizontal: 25, marginTop: 5 },
          ]}
          onPress={fetchSuscriptores}
        >
          <Text style={styles.btnAgregarText}>Refrescar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>
              {item.name} {item.lastName}
            </Text>
            <Text>{item.email}</Text>
            <Text>{item.phoneNumber}</Text>
            <Text>Nacimiento: {item.birthDate}</Text>
            <Text>Suscripción: {item.subscribeDate}</Text>
            <Text>Renovación: {item.renewalDate}</Text>
            <Text>Tipo: {item.SubType}</Text>
            <Text
              style={{
                color: item.estado === "Activo" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {item.estado}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => abrirModal(item)}>
                <Text style={styles.btnEdit}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminar(item.email)}>
                <Text style={styles.btnDelete}>🗑️ Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botones de acción */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={[styles.btnAgregar, { flex: 1, marginRight: 8 }]}
          onPress={() => abrirModal()}
        >
          <Text style={styles.btnAgregarText}>➕ Nuevo Suscriptor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAgregar, { flex: 1, marginLeft: 8 }]}
          onPress={() => navigation.navigate('SubsAdmin')}
        >
          <Text style={styles.btnAgregarText}>📂 Nueva Categoría</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editarSuscriptor ? "Editar Suscriptor" : "Nuevo Suscriptor"}
            </Text>

            {/* Campo email solo si es nuevo */}
            {!editarSuscriptor && (
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={form.email}
                onChangeText={(t) => setForm({ ...form, email: t })}
              />
            )}

            {[
              { key: "name", placeholder: "Nombre" },
              { key: "lastName", placeholder: "Apellido" },
              { key: "phoneNumber", placeholder: "Teléfono" },
              { key: "birthDate", placeholder: "Fecha de nacimiento" },
              {
                key: "subscribeDate",
                placeholder: "Fecha suscripción (DD/MM/AAAA)",
              },
              {
                key: "renewalDate",
                placeholder: "Fecha renovación (DD/MM/AAAA)",
              },
            ].map((field) => (
              <TextInput
                key={field.key}
                style={styles.input}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChangeText={(t) => setForm({ ...form, [field.key]: t })}
              />
            ))}

            {/* 🔽 Picker de suscripciones */}
            <Text style={{ marginTop: 10, marginBottom: 5 }}>
              Tipo de Suscripción:
            </Text>
            <View style={[styles.input, { padding: 0 }]}>
              <Picker
                selectedValue={form.Id}
                onValueChange={(itemValue) =>
                  setForm({ ...form, Id: itemValue })
                }
              >
                <Picker.Item label="Seleccionar suscripción" value="" />
                {suscripciones.map((sub) => (
                  <Picker.Item
                    key={sub.id}
                    label={`${sub.id} - ${sub.name}`}
                    value={sub.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={guardar}>
                <Text style={styles.btnSave}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancel}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
