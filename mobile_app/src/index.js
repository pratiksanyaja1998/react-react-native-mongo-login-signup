import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import SignupScreen from "./screen/Signup";
import LoginScreen from "./screen/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screen/Home";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App(props) {
  const [isSignedIn, setSignedIn] = useState(false);

  if (isSignedIn == null) {
    // We haven't finished checking for the token yet
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isSignedIn && <Stack.Screen name="login" component={LoginScreen} />}
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
