import { useMemo } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";

export function Hero({ searchText, handleSearchChange }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.main}>
        <Text style={styles.titleText}>Little Lemon</Text>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.subTitleText}>Chicago</Text>
            <View style={styles.spacer} />
            <Text style={styles.descriptionText}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes
              served with a modern twist.
            </Text>
          </View>
          <View style={styles.horizontalSpacer} />
          <Image source={require("../assets/images/hero.jpg")} style={styles.heroImage} resizeMode="cover" />
        </View>
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.searchContainer}>
          <Ionicons name="ios-search" size={20} color={theme.colors.primary} style={styles.icon} />
          <TextInput
            value={searchText}
            onChangeText={handleSearchChange}
            placeholder="Search..."
            placeholderTextColor={theme.colors.placeholder}
            style={styles.textInput}
            selectionColor={theme.colors.primary}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const createStyles = (theme) => StyleSheet.create({
  main: {
    padding: 20,
    paddingBottom: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-end",
  },
  textContainer: {
    flexShrink: 1,
  },
  titleText: {
    fontFamily: "MarkaziText-SemiBold",
    fontSize: 44,
    lineHeight: 50,
    color: theme.colors.secondary,
  },
  subTitleText: {
    fontFamily: "MarkaziText-SemiBold",
    fontSize: 28,
    lineHeight: 28,
    color: colors.White,
  },
  descriptionText: {
    fontFamily: "Karla-SemiBold",
    fontSize: 15,
    color: colors.White,
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },
  spacer: {
    height: 10,
  },
  horizontalSpacer: {
    width: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: "100%",
    padding: 5,
    fontWeight: "500",
    includeFontPadding: false,
  },
});
