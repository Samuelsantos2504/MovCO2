import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import supabase from "./supabaseClient";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

export async function registrarUsuarios(email, password, nombre, apellido, telefono, fechaNacimiento) {
  try {
    // Registro en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuario registrado en Firebase:", user.email);

    // Registro en Supabase
    const { data, error } = await supabase
      .from("ActiveUsers")
      .insert([
        {
          email: email,
          name: nombre,
          lastName: apellido,
          phoneNumber: telefono,
          birthDate: fechaNacimiento
        }
      ])
      .select();

    if (error) {
    } else {
      console.log("Usuario guardado en Supabase:", data);
    }

    Alert.alert ('Usuario registrado exitosamente!');

  } catch (error) {
    Alert.alert ('Error al registrar el usuario:');
  }
}
