import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./Screens/LoginScreen";
import HomeScreen from "./Screens/HomeScreen";
import PointsScreen from "./Screens/PointsScreen";
import AdminScreen from "./Screens/AdminScreen";
import SubScreen from "./Screens/SubScreens";
import SubScreenAdmin from "./Screens/SubScreensAdmin";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import MapScreen from "./Screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const isLogged = await AsyncStorage.getItem('isLoggedIn');
      if (isLogged === 'true') {
        setUserLoggedIn(true);
      }
      setIsLoading(false);
    }

    checkLoginStatus();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Mapa" component={MapScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Puntos" component={PointsScreen} />
        <Stack.Screen name="Subs" component={SubScreen} />
        <Stack.Screen name="SubsAdmin" component={SubScreenAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
