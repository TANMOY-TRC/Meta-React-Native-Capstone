import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useColorScheme } from "react-native";

import { lightTheme, darkTheme } from "../constants/themes";

export const ThemeMode = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children, initialMode = ThemeMode.SYSTEM }) => {
  const [themeMode, setThemeMode] = useState(initialMode);

  // Get system color scheme: "light" | "dark" | null
  const systemColorScheme = useColorScheme();

  // Resolve the active color scheme (light or dark)
  const activeColorScheme = useMemo(() => {
    if (themeMode === ThemeMode.DARK) return "dark";
    if (themeMode === ThemeMode.LIGHT) return "light";
    return systemColorScheme;
  }, [themeMode, systemColorScheme]);

  const theme = activeColorScheme === "dark" ? darkTheme : lightTheme;

  const contextValue = useMemo(() => ({
    theme,
    colorScheme: activeColorScheme,
    themeMode,
    setThemeMode,
  }), [theme, activeColorScheme, themeMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
