import AsyncStorage from "@react-native-async-storage/async-storage";

export const onboard = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    if (user === null) {
      return null;
    }
    return JSON.parse(user);
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    await AsyncStorage.mergeItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export const updateImage = async (imageUri) => {
  try {
    const user = {
      image: imageUri
    };
    await AsyncStorage.mergeItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};
