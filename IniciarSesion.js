import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Alert } from "react-native";
import supabase from "./supabaseClient";

export async function iniciarSesion(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const { data, error } = await supabase
            .from("ActiveUsers")
            .select("name") 
            .eq("email", user.email.toLowerCase())
            .single();

        if (error) {
            console.error("Error al consultar Supabase:", error.message);
            Alert.alert("Error", "No se pudo obtener el nombre del usuario.");
            return;
        }

        Alert.alert("Inicio de sesión exitoso", `Bienvenido ${data?.name || "Usuario"}`);
        return data;
    } 
    catch (error) {
        console.error("Error al iniciar sesión:", error.code, error.message);
        Alert.alert("Error", "Correo o contraseña incorrectos.");
    }
}
