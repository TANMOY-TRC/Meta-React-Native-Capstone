import { useState, useRef, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";

import { AppContext } from "../context/AppContext";
import { validateEmail, validateName } from "../utils/formValidation";
import { onboard } from "../storage/async/userStorage";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";

export default function Onboarding({ navigation }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { setState } = useContext(AppContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);

  const validateInput = () => {
    return (
      validateName(firstName) &&
      validateName(lastName) &&
      validateEmail(email)
    );
  }

  const handleOnboard = async () => {
    try {
      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      await onboard(user);

      setState({
        isOnboardingCompleted: true
      })

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error: Failed to save user data.");
    }
  };

  return (
    <SafeAreaView style={styles.main} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Let's get to know you</Text>
        </View>

        <View style={styles.container}>
          {/* Input Section */}
          <View style={styles.box}>
            <Text style={styles.sectionLabel}>Personal Information</Text>
            <View style={styles.spacer} />

            <Text style={styles.label}>First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              style={styles.textInput}
              selectionColor={theme.colors.primary}
              placeholderTextColor={theme.colors.placeholder}
              textContentType="givenName"
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={styles.spacer} />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              ref={lastNameRef}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
              style={styles.textInput}
              selectionColor={theme.colors.primary}
              placeholderTextColor={theme.colors.placeholder}
              textContentType="familyName"
              keyboardType="default"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />

            <View style={styles.spacer} />

            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
              style={styles.textInput}
              selectionColor={theme.colors.primary}
              placeholderTextColor={theme.colors.placeholder}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={styles.spacer} />
          <View style={styles.spacer} />

          {/* Registration Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={() => [
                styles.buttonRegister,
                !validateInput() && styles.buttonDisabled,
              ]}
              disabled={!validateInput()}
              onPress={handleOnboard}
            >
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>


    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  banner: {
    height: 120,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    fontFamily: "Karla-SemiBold",
    fontSize: 26,
    includeFontPadding: false,
    color: colors.White,
  },
  scrollContainer: {
    width: "100%",
    flexGrow: 1,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  box: {
    width: "100%",
  },
  spacer: {
    height: 20,
  },
  sectionLabel: {
    width: "100%",
    fontFamily: "Karla-Bold",
    fontSize: 20,
    color: theme.colors.text,
  },
  label: {
    width: "100%",
    fontFamily: "Karla-SemiBold",
    fontSize: 15,
    color: theme.colors.text,
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    width: "100%",
    fontFamily: "Karla-SemiBold",
    color: theme.colors.text,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "gray",
    fontWeight: "500",
    borderWidth: 1.5,
    borderRadius: 8,
    includeFontPadding: false,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonRegister: {
    width: "100%",
    padding: 10,
    fontSize: 20,
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
    borderWidth: 2,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  buttonText: {
    fontFamily: "Karla-SemiBold",
    fontWeight: "bold",
    color: colors.Black,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
  },
});
