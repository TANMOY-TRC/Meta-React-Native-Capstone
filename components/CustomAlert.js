import { Alert } from "react-native";

export function CustomAlert(title, message) {
  Alert.alert(
    title,
    message,
    [
      { text: "OK" }
    ],
    { cancelable: true }
  );
}
