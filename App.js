import { AppWrapper } from "./components/AppWrapper";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppWrapper />
      </AppProvider>
    </ThemeProvider>
  );
}
