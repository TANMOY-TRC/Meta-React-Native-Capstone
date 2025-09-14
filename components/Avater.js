import { useMemo } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import { colors } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

export function Avater({ image, nameInitials, avaterStyle, textAvaterStyle, textStyle }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    image ?
      <Image source={{ uri: image }} style={avaterStyle ? avaterStyle : styles.avater} resizeMode="contain" /> :
      <View style={textAvaterStyle ? textAvaterStyle : styles.textAvater}>
        <Text style={textStyle ? textStyle : styles.text}>{nameInitials}</Text>
      </View>
  )
}

const createStyles = (theme) => StyleSheet.create({
  avater: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  textAvater: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textTransform: "uppercase",
    fontSize: 30,
    fontWeight: "bold",
    color: colors.White,
    lineHeight: 35,
  },
});
