"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(
  null,
);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    setTheme(
      saved ??
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    );
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export default function ThemeSwitcher() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("Use ThemeProvider");
  return (
    <button onClick={value.toggle} aria-label="Toggle color theme">
      {value.theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
