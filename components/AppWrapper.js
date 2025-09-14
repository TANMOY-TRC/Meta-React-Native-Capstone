import { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Navigation } from "../navigation/Navigation";
import { useTheme } from "../context/ThemeContext";

export function AppWrapper() {
  const { theme, colorScheme } = useTheme();
  const systemUIMode = colorScheme == "light" ? "dark" : "light";
  const systemUIBackground = theme.colors.background;

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(systemUIBackground);
      NavigationBar.setButtonStyleAsync(systemUIMode);
    }
  }, [colorScheme]);

  return (
    <>
      <StatusBar translucent backgroundColor={systemUIBackground} style={systemUIMode} />
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </>
  )
}
