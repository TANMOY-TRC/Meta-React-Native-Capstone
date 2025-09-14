import { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "../context/ThemeContext";

export function Separator() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.separator} />
  )
}

const createStyles = (theme) => StyleSheet.create({
  separator: {
    marginVertical: 4,
    height: 1.5,
    width: "100%",
    backgroundColor: theme.colors.disabled,
    borderRadius: 2,
    alignSelf: "center",
  },
});
