import { useContext, useEffect, useState, useMemo } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { AppContext } from "../context/AppContext";
import { Avater } from "./Avater";
import { getNameInitials } from "../utils/stringHelpers";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";

export function Header() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { state } = useContext(AppContext);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [image, setImage] = useState(null);
  const [nameInitials, setNameInitials] = useState("");

  useEffect(() => {
    if (state.user) {
      setImage(state.user.image);
      setNameInitials(getNameInitials(state.user.firstName, state.user.lastName));
    }
  }, [state]);

  // Check if you can go back
  const canGoBack = navigation.canGoBack();
  const currentRouteName = navigation.getState().routes[navigation.getState().index].name;

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      {/* Back Navigation Button */}
      {canGoBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={"chevron-back"}
            size={28}
            color="#495E57"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonPlaceholder} />
      )}

      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Profile Button */}
      {state.isOnboardingCompleted && currentRouteName !== "Profile" ? (
        <Pressable
          onPress={() => navigation.navigate("Profile")}
          style={styles.buttonPlaceholder}
        >
          <Avater
            image={image}
            nameInitials={nameInitials}
            avaterStyle={styles.avater}
            textAvaterStyle={styles.textAvater}
            textStyle={styles.avaterText}
          />
        </Pressable>
      ) : (
        <View style={styles.buttonPlaceholder} />
      )}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background,
    height: 100,
    paddingHorizontal: 10,
    shadowOpacity: 0,
  },
  backButton: {
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  buttonPlaceholder: {
    width: 50,
    height: 40,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  logo: {
    width: 150,
    height: 56,
  },
  avater: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  textAvater: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avaterText: {
    textTransform: "uppercase",
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "bold",
    color: colors.White,
  },
});
