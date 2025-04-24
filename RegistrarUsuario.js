import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import supabase from "./supabaseClient";

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
      console.error("Error al insertar en Supabase:", error);
    } else {
      console.log("Usuario guardado en Supabase:", data);
    }

  } catch (error) {
    console.error("Error al registrar el usuario:", error.message);
  }
}
