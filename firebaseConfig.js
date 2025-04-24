// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBraSa0GXc6srbPP3DaE528nfKwSuAqPVI",
  authDomain: "movco2.firebaseapp.com",
  projectId: "movco2",
  storageBucket: "movco2.firebasestorage.app",
  messagingSenderId: "383592317842",
  appId: "1:383592317842:web:b79450d566bd2d418cb74b",
  measurementId: "G-QEEZPQ6HJ1"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
