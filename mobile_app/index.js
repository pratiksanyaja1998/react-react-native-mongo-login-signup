import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import axios from "axios";
import App from "./src";

if (__DEV__) {
  axios.defaults.baseURL = "http://192.168.1.9:5000/api";
} else {
  axios.defaults.baseURL = "http://192.168.1.9:5000/api";
}

// axios.defaults.headers.common["Authorization"] = "";
// axios.defaults.headers.post["Content-Type"] = "application/json";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
