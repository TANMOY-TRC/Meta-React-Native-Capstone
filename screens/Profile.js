import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from 'expo-image-picker';

import { AppContext } from "../context/AppContext";
import { validateEmail, validateName, validatePhoneNumberUS } from "../utils/formValidation";
import { signOut, updateImage, updateUser } from "../storage/async/userStorage";
import { Checkbox } from "../components/Checkbox";
import { CustomAlert } from "../components/CustomAlert";
import { Avater } from "../components/Avater";
import { getNameInitials } from "../utils/stringHelpers";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../constants/colors";

export default function Profile({ navigation }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { state, setState } = useContext(AppContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotification, setEmailNotification] = useState({});
  const [image, setImage] = useState(null);
  const [nameInitials, setNameInitials] = useState("");

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const validateInput = () => {
    if (!validateName(firstName) || !validateName(lastName)) {
      CustomAlert("Invalid Input", "Names must not be empty and should contain only letters.");
      return false;
    }
    if (!validateEmail(email)) {
      CustomAlert("Invalid Input", "A valid email address is required.");
      return false;
    }
    if (!validatePhoneNumberUS(phone)) {
      CustomAlert("Invalid Input", "A valid US phone number is required.");
      return false;
    }
    return true;
  }

  const updateUserImage = (image) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        image: image,
      },
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        try {
          await updateImage(result.uri);
          updateUserImage(result.uri);
          setImage(result.uri);
          CustomAlert("Success", "Profile image has been changed.");
        } catch (error) {
          CustomAlert("Error: Failed change profile image.");
        }

      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const removeImage = async () => {
    try {
      await updateImage("");
      updateUserImage("");
      setImage("");
      CustomAlert("Success", "Profile image has been removed.");
    } catch (error) {
      CustomAlert("Error", "Failed remove profile image.");
    }
  }

  const handleCheckbox = (key) => {
    setEmailNotification(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const fetchUser = async () => {
    if (state.user) {
      setFirstName(state.user.firstName);
      setLastName(state.user.lastName);
      setEmail(state.user.email);
      setPhone(state.user.phone || "");
      setEmailNotification(state.user.emailNotification || {
        orderStatus: false,
        passwordChange: false,
        specialOffer: false,
        newsletter: false,
      });
      setImage(state.user.image || "");
      setNameInitials(getNameInitials(state.user.firstName, state.user.lastName));
    }
  };

  const handleUserUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        emailNotification: emailNotification,
      };

      setState(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...user,
        },
      }));

      await updateUser(user);
      CustomAlert("Success", "Personal Information has been updated.");
    } catch (error) {
      CustomAlert("Error", "Personal Information could not be updated.");
    }
  };

  const handleDiscardChange = () => {
    fetchUser();
    CustomAlert("Success", "Changes has been discarded.");
  };

  const handleSignOut = async () => {
    try {
      await signOut();

      setState({
        isOnboardingCompleted: false
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      CustomAlert("Error", "Sign out attempt was unsuccessful.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [state]);

  return (
    <SafeAreaView style={styles.main} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Personal Information */}
          <View style={styles.box}>
            <Text style={styles.sectionLabel}>Personal Information</Text>
            <View style={styles.spacer} />

            {/* Avatar */}
            <Text style={styles.label}>Avatar</Text>
            <View style={styles.avaterContainer}>
              <Avater image={image} nameInitials={nameInitials} />

              <View style={styles.horizontalSpacer} />

              <View style={styles.avatarButtonContainer}>
                <Pressable
                  onPress={pickImage}
                  style={styles.buttonPrimary}
                >
                  <Text style={styles.buttonPrimaryText}>Change</Text>
                </Pressable>

                <View style={styles.horizontalSpacer} />

                <Pressable
                  onPress={removeImage}
                  style={styles.buttonSecondary}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.spacer} />

            {/* Input Section */}
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
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />

            <View style={styles.spacer} />

            <Text style={styles.label}>Phone Number</Text>

            <MaskedTextInput
              ref={phoneRef}
              value={phone}
              onChangeText={(text) => setPhone(text)}
              placeholder="(555) 555-5555"
              style={styles.textInput}
              selectionColor={theme.colors.primary}
              placeholderTextColor={theme.colors.placeholder}
              type="cel-phone"
              mask="(999) 999-9999"  // US Phone Number
              keyboardType="phone-pad"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={styles.spacer} />
          <View style={styles.spacer} />

          {/* Email Notification */}
          <View style={styles.box}>
            <Text style={styles.sectionLabel}>Email Notification</Text>
            <View style={styles.spacer} />

            <View style={styles.checkboxContainer}>
              <Checkbox
                label="Order Status"
                isChecked={emailNotification.orderStatus}
                onPress={() => handleCheckbox("orderStatus")}
              />
              <Checkbox
                label="Password Change"
                isChecked={emailNotification.passwordChange}
                onPress={() => handleCheckbox("passwordChange")}
              />
              <Checkbox
                label="Special Offer"
                isChecked={emailNotification.specialOffer}
                onPress={() => handleCheckbox("specialOffer")}
              />
              <Checkbox
                label="Newsletter"
                isChecked={emailNotification.newsletter}
                onPress={() => handleCheckbox("newsletter")}
              />
            </View>
          </View>

          <View style={styles.spacer} />

          {/* Form Control Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleDiscardChange}
              style={styles.buttonSecondary}
            >
              <Text style={styles.buttonText}>Discard Changes</Text>
            </Pressable>

            <View style={styles.horizontalSpacer} />

            <Pressable
              onPress={handleUserUpdate}
              style={styles.buttonPrimary}
            >
              <Text style={styles.buttonPrimaryText}>Save Changes</Text>
            </Pressable>
          </View>

          <View style={styles.spacer} />

          {/* Sign Out Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleSignOut}
              style={styles.signOutButton}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView >
    </SafeAreaView >
  );
}

const createStyles = (theme) => StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    width: "100%",
    paddingBottom: 10,
  },
  container: {
    padding: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  box: {
    width: "100%",
  },
  checkboxContainer: {
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
    color: theme.colors.text,
    fontFamily: "Karla-SemiBold",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: theme.colors.text,
    borderColor: "gray",
    fontWeight: "500",
    borderWidth: 1.5,
    borderRadius: 8,
    includeFontPadding: false,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  avaterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarButtonContainer: {
    flexDirection: "row",
    width: "60%"
  },
  horizontalSpacer: {
    width: 15,
  },
  buttonPrimary: {
    flexGrow: 1,
    padding: 10,
    fontSize: 20,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 8,
  },
  buttonSecondary: {
    flexGrow: 1,
    padding: 10,
    fontSize: 20,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 8,
  },
  buttonPrimaryText: {
    color: colors.White,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
  },
  signOutButton: {
    width: "100%",
    padding: 10,
    fontSize: 20,
    backgroundColor: theme.colors.destructive,
    borderColor: theme.colors.destructive,
    borderWidth: 2,
    borderRadius: 8,
  },
  signOutButtonText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    color: colors.Black,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    color: theme.colors.text,
  },
});
