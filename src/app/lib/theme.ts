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

/**
 * Scope class for anything Radix renders in a portal (DialogContent,
 * SelectContent, DropdownMenuContent, TooltipContent...).
 *
 * Portalled content mounts on <body>, outside the `.member-app` wrapper, so the
 * scoped tokens never reach it and `bg-background` resolves to the MARKETING
 * value -- white -- even in dark mode. Verified in prod: the same `bg-background`
 * element computes rgb(255,255,255) outside the scope and rgb(12,12,13) inside.
 * Re-applying the scope on the portalled node fixes it.
 */
export function spScopeClass(): string {
  return getStoredSpTheme() === "dark" ? "member-app dark" : "member-app";
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
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const statusBarStyle = document.querySelector<HTMLMetaElement>(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    );
    const previousThemeColor = themeColor?.content;
    const previousStatusBarStyle = statusBarStyle?.content;

    if (themeColor) themeColor.content = theme === "dark" ? "#0a0a0b" : "#f4f2ee";
    if (statusBarStyle) statusBarStyle.content = theme === "dark" ? "black-translucent" : "default";

    return () => {
      document.documentElement.removeAttribute("data-sp-theme");
      if (themeColor && previousThemeColor) themeColor.content = previousThemeColor;
      if (statusBarStyle && previousStatusBarStyle) statusBarStyle.content = previousStatusBarStyle;
    };
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}
