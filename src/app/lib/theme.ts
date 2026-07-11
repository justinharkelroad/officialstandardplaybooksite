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
    // Stamp the root so surfaces that portal OUTSIDE the .member-app wrapper
    // (sonner toasts, radix dialogs/popovers) can follow the member-app theme.
    // Deliberately an attribute, not the `dark` class: the marketing site's
    // global tokens key off `.dark`, and it must stay light.
    document.documentElement.setAttribute("data-sp-theme", theme);
    return () => document.documentElement.removeAttribute("data-sp-theme");
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}
