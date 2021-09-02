import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

function Signup(props) {
  const [first_name, setFrist_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(width, height);

  const signup = async (e) => {
    setLoading(true);
    Keyboard.dismiss();

    if (!email || !email) {
      return alert("Please enter a valid email address");
    }
    if (!password || (password && password.length < 6)) {
      return alert("Password must be at least 6 characters");
    }
    if (!first_name) {
      return alert("Please fill out First name .");
    }
    if (!last_name) {
      return alert("Please fill out Last name .");
    }

    try {
      const response = await axios
        .post("/auth/register", {
          first_name,
          last_name,
          email,
          password,
        })
        .then((response) => response.data);
      console.log("Registration", response);
      props.navigation.replace("home");
    } catch (error) {
      setLoading(false)
      console.log("error ", error.response);
      alert(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginView}>
        <View>
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: "100%", resizeMode: "contain", height: 100 }}
          />
        </View>
        <TextInput
          placeholder="First Name"
          value={first_name}
          keyboardType="name-phone-pad"
          style={{ width: "100%" }}
          style={styles.input}
          onChangeText={setFrist_name}
        />
        <TextInput
          placeholder="Last Name"
          value={last_name}
          keyboardType="name-phone-pad"
          style={{ width: "100%" }}
          style={styles.input}
          onChangeText={setLast_name}
        />
        <TextInput
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          style={{ width: "100%" }}
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          value={password}
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={signup}>
          <View style={styles.signInButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", textAlign: "center" }}>
                SIGN UP
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
  },
  loginView: {
    // maxWidth: 600,
    // borderWidth: 1,
    // borderColor: "#000",
    padding: 15,
    width: "100%",
    maxWidth: width > 400 ? 380 : null,
  },
  input: {
    marginBottom: 10,
    // width: 350,
    // maxWidth: 350,
    width: "100%",
    // maxWidth:
    backgroundColor: "#fff",
    padding: 8,
    fontSize: 18,
    borderRadius: 3,
    borderColor: "#ccc",
    borderWidth: 1,
    // width: '100%'
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  signInButton: {
    fontSize: 18,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 3,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  signUpButton: {
    fontSize: 18,
    backgroundColor: "#ec8e2a",
    padding: 12,
    borderRadius: 3,
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Signup;
