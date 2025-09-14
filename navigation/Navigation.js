import { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppContext } from "../context/AppContext";
import { Header } from "../components/Header";
import { getUser } from "../storage/async/userStorage";

import Onboarding from "../screens/Onboarding";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

const Stack = createNativeStackNavigator();

export function Navigation() {
  const { state, setState } = useContext(AppContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if (user) {
          setState(prevState => ({
            ...prevState,
            user,
          }));
        }
      } catch (error) {
        console.error("Error: Failed to fetch user data.");
      }
    };

    if (state.isOnboardingCompleted) {
      fetchUser();
    }
  }, [state.isOnboardingCompleted]);

  const screenOptions = {
    header: () => <Header />,
    headerShadowVisible: false,
    animation: "slide_from_right"
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {state.isOnboardingCompleted ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
        </>
      ) : (
        <Stack.Screen name="Welcome" component={Onboarding} />
      )}
    </Stack.Navigator>
  );
}
