import { useMemo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import { useTheme } from "../context/ThemeContext";

export function MenuItems({ item }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.horizontalSpacer} />
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
    </View>
  )
}

const createStyles = (theme) => StyleSheet.create({
  main: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  container: {
    flexShrink: 1,
    flexGrow: 1,
  },
  itemName: {
    fontFamily: "Karla-Bold",
    fontSize: 15,
    paddingBottom: 5,
    color: theme.colors.text,
    includeFontPadding: false,
  },
  itemDescription: {
    fontFamily: "Karla-Regular",
    fontSize: 14,
    color: theme.colors.placeholder,
    paddingBottom: 5,
    includeFontPadding: false,
  },
  itemPrice: {
    fontFamily: "Karla-Bold",
    fontSize: 14,
    color: theme.colors.primary,
    includeFontPadding: false,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 8,
  },
  horizontalSpacer: {
    width: 10,
  },
});
