import { useMemo } from "react";
import { View, Image, StyleSheet } from "react-native";

import { useTheme } from "../context/ThemeContext";

export default function Splash() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.splash}>
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.splashLogo}
        resizeMode="contain"
      />
    </View>
  )
}

const createStyles = (theme) => StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: "100%",
  },
});
