import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";

export function Checkbox({ label, isChecked, onPress }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable onPress={onPress} style={styles.checkboxContainer}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Ionicons name="checkmark-sharp" size={14} color="white" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme) => StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.foreground,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    marginLeft: 10,
    fontFamily: "Karla-SemiBold",
    fontSize: 15,
    color: theme.colors.text,
  },
});
