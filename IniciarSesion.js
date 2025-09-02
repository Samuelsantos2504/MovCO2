import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from "./supabaseClient";

export async function iniciarSesion(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const { data, error } = await supabase
            .from("ActiveUsers")
            .select("name, Rol")
            .eq("email", user.email)
            .single();

        if (error) {
            console.error("Error al consultar Supabase:", error.message);
            Alert.alert("Error", "No se pudo obtener la información del usuario.");
            return;
        }

        return { user, name: data.name, Rol: data.Rol };
    } catch (error) {
        console.error("Error en Firebase:", error);
        Alert.alert("Error", "Correo o contraseña incorrectos.");
        return null;
    }
}