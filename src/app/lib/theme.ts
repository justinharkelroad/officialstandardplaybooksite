// Member-app theme (light = paper editorial, dark = inverted ink editorial).
// Stored per-browser; applied as the Tailwind `dark` class on the .member-app
// wrapper so both the scoped shadcn tokens and every transplanted component's
// `dark:` variants flip together. The marketing site is untouched.
import { useCallback, useEffect, useState } from "react";

export type SpTheme = "light" | "dark";

const STORAGE_KEY = "sp-theme";

export function getStoredSpTheme(): SpTheme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function useSpTheme(): [SpTheme, () => void] {
  const [theme, setTheme] = useState<SpTheme>(getStoredSpTheme);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode — theme just won't persist */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}
