import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "./firebaseConfig";
import supabase from "./supabaseClient";
import { Alert } from "react-native";

export async function registrarUsuarios(email, password, nombre, apellido, telefono, fechaNacimiento) {
    const currentDate = new Date().toISOString();
    let firebaseUser = null;

    try {
        // 1. Registrar usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
        console.log("Usuario registrado en Firebase:", firebaseUser.email);

        // 2. Insertar usuario en ActiveUsers de Supabase
        const { data: userData, error: error1 } = await supabase
            .from("ActiveUsers")
            .insert([
                {
                    email: email,
                    name: nombre,
                    lastName: apellido,
                    phoneNumber: telefono,
                    birthDate: fechaNacimiento,
                    Puntos: 1500,
                    Rol: "Usuario"
                }
            ])
            .select()
            .single();

        if (error1) {
            throw new Error(`Error en ActiveUsers: ${error1.message}`);
        }

        // 3. Insertar registro en Subscribers de Supabase
        const { data: subscriberData, error: error2 } = await supabase
            .from("Subscribers")
            .insert([
                {
                    email: email,
                    subscribeDate: currentDate,
                    renewalDate: "2099-01-01",
                    Id: 1
                }
            ])
            .select()
            .single();

        if (error2) {
            await supabase.from("ActiveUsers").delete().eq("email", email);
            throw new Error(`Error en Subscribers: ${error2.message}`);
        }

        console.log("Usuario guardado en Supabase:", userData, subscriberData);
        Alert.alert("Usuario registrado exitosamente!");
        return firebaseUser;

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        // Eliminar usuario de Firebase si ya fue creado
        if (firebaseUser) {
            try {
                await deleteUser(firebaseUser);
            } catch (delError) {
                console.error("No se pudo eliminar el usuario en Firebase:", delError);
            }
        }

        Alert.alert("Error", "No se pudo registrar el usuario. Intente nuevamente.");
        return null;
    }
}
