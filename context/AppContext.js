import { createContext, useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import { View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Splash from "../screens/Splash";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const [isFontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-SemiBold": require("../assets/fonts/Karla-SemiBold.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
    "MarkaziText-SemiBold": require("../assets/fonts/MarkaziText-SemiBold.ttf"),
    "MarkaziText-Bold": require("../assets/fonts/MarkaziText-Bold.ttf"),
  });

  const loadData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setState({
          isOnboardingCompleted: true
        });
      } else {
        setState({
          isOnboardingCompleted: false
        });
      }
      setIsDataLoaded(true);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load app data",
        [
          { text: "OK" }
        ],
        { cancelable: true }
      );
    }
  }

  useEffect(() => {
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));

    Promise.all([loadData(), minimumLoadingTime]).then(() => {
      setIsAppLoaded(isFontsLoaded && isDataLoaded);
    });
  }, [isFontsLoaded, isDataLoaded]);

  if (!isAppLoaded) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppContext.Provider value={{ state, setState }}>
        {children}
      </AppContext.Provider>
    </View>
  );
}
