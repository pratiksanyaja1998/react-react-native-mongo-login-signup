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
const { width, height } = Dimensions.get("window");
import axios from "axios";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (e) => {
    setLoading(true);
    Keyboard.dismiss();

    if (!email || !email) {
      return alert("Please enter a valid email address");
    }
    if (!password || (password && password.length < 6)) {
      return alert("Password must be at least 6 characters");
    }
    console.log("eeee", email);
    console.log("pppp", password);
    // return this.props.emailPassWOrdLogin(email, password,navigation);
    try {
      const response = await axios
        .post("/auth/login", {
          email,
          password,
        })
        .then((response) => response.data);
      console.log("EmailPasswordLogin", response);
      axios.defaults.headers.common["x-auth-token"] = response.data.token
      props.navigation.replace("home");
    } catch (error) {
      setLoading(false);
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
          placeholder="email"
          value={email}
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
        {/* <Button
          title="Sign in"
          style={styles.signInButton}
          color="#000"
          onPress={() => signIn({ username, password })}
        /> */}
        <TouchableOpacity onPress={signIn}>
          <View style={styles.signInButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", textAlign: "center" }}>
                SIGN IN
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.push("signup")}>
          <View style={styles.signUpButton}>
            <Text style={{ color: "#fff", textAlign: "center" }}>SIGN UP</Text>
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
export default Login;
