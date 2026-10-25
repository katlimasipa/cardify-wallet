import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "light", setTheme: () => {},
});

function readThemePreference(): Theme | null {
  try {
    const stored = localStorage.getItem("cv-theme") as Theme | null;
    return stored === "light" || stored === "dark" || stored === "system" ? stored : null;
  } catch {
    return null;
  }
}

function saveThemePreference(theme: Theme) {
  try {
    localStorage.setItem("cv-theme", theme);
  } catch {
    return;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const stored = readThemePreference();
    if (stored) setThemeState(stored);
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;
    const root = document.documentElement;
    const resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
    saveThemePreference(theme);
  }, [theme, themeLoaded]);

  return <ThemeCtx.Provider value={{ theme, setTheme: setThemeState }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
