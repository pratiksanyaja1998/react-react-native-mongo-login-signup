import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Keyboard,
  Platform,
  StyleSheet,
  List,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item_view: {
    padding: 10,
    width: "100%",
    borderColor: "black",
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.5,
    fontStyle: "italic",
  },
  FlatList: {
    marginTop: 15,
    padding: 15,
    width: "100%",
    maxWidth: width > 400 ? 380 : null,
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

const UserItem = (props) => {
  return (
    <View style={styles.item_view}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}> {props.subtitle} </Text>
    </View>
  );
};

function Home(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("use effect call ====");
    console.log(axios);
    axios
      .get("/auth/users/list")
      .then((response) => {
        console.log("response ====");
        console.log("response ", response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log("error ", error);
        alert(error.response.data.message);
      });
  }, []);

  console.log("data ===== ", data);
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View>
          <FlatList
            style={styles.FlatList}
            data={data}
            renderItem={({ item, index }) => {
              console.log("items ===", item);
              return (
                <UserItem
                  key={index}
                  title={`${item.first_name} ${item.last_name}`}
                  subtitle={item.email}
                />
              );
            }}
          />
          <TouchableOpacity onPress={() => props.navigation.push("login")}>
          <View style={styles.signUpButton}>
            <Text style={{ color: "#fff", textAlign: "center" }}>LOG OUT</Text>
          </View>
        </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default Home;
