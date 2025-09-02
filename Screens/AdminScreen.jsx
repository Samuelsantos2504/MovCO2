import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles/AdminScreenStyles.js";

const API_URL = "https://zealous-fulfillment-development.up.railway.app/admin";

export default function SuscriptoresScreen() {
  const [suscriptores, setSuscriptores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");

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
    SubType: "",
  });

  // Obtener usuarios y suscripciones desde API
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

  useEffect(() => {
    fetchSuscriptores();
  }, []);

  // Filtrado por búsqueda
  const filtrados = suscriptores.filter((s) => {
    return (
      s.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.email?.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  // Abrir modal para agregar o editar
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
        SubType: "",
      }
    );
    setModalVisible(true);
  };

  // Guardar datos en API
  const guardar = async () => {
    try {
      if (editarSuscriptor) {
        await fetch(`${API_URL}/suscriptores/${form.email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${API_URL}/suscriptores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchSuscriptores(); // refresca lista
      setModalVisible(false);
    } catch (error) {
      console.log("Error guardar:", error.message);
    }
  };

  // Eliminar usuario
  const eliminar = async (email) => {
    try {
      await fetch(`${API_URL}/suscriptores/${email}`, { method: "DELETE" });
      await fetchSuscriptores(); // refresca lista
    } catch (error) {
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
      {/* Barra de búsqueda con botón refrescar */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Buscar suscriptor..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity
          style={[styles.btnAgregar, { marginLeft: 10, paddingHorizontal: 25 , marginTop: 5}]}
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
        <TouchableOpacity style={[styles.btnAgregar, { flex: 1, marginRight: 8 }]} onPress={() => abrirModal()}>
          <Text style={styles.btnAgregarText}>➕ Nuevo Suscriptor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAgregar, { flex: 1, marginLeft: 8 }]} onPress={() => alert("Abrir modal de Categoría")}>
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
            {[
              { key: "email", placeholder: "Correo" },
              { key: "name", placeholder: "Nombre" },
              { key: "lastName", placeholder: "Apellido" },
              { key: "phoneNumber", placeholder: "Teléfono" },
              { key: "birthDate", placeholder: "Fecha de nacimiento" },
              { key: "subscribeDate", placeholder: "Fecha de suscripción (DD/MM/AAAA)" },
              { key: "renewalDate", placeholder: "Fecha de renovación (DD/MM/AAAA)" },
              { key: "SubType", placeholder: "Tipo de suscripción" },
            ].map((field) => (
              <TextInput
                key={field.key}
                style={styles.input}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChangeText={(t) => setForm({ ...form, [field.key]: t })}
                editable={field.key !== "email" || !editarSuscriptor} // email no editable al editar
              />
            ))}
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
