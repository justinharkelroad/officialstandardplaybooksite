
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2080FF",
          light: "#30A4FF",
          accent: "#4DA3FF",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-accent": "#30A4FF",
        "primary-light": "#4DA3FF",
        "dark-card": "hsl(var(--dark-card))",
        "dark-bg": "#0B0B0C",
        "dark-surface": "#121212",
        "dark-text": "#F5F5F5",
        "dark-muted": "#B3B3B3",
        "dark-stroke": "#262626",
        "accent-blue": "#2563EB",
        "accent-blue-600": "#1E40AF",
        success: "#22C55E",
        error: "#DC2626",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        base: ['18px', '1.75'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        square: "12px",
        pill: "30px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-slide": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "accent-glow": {
          "0%, 100%": {
            boxShadow: "0 0 64px rgba(37, 99, 235, 0.25)",
          },
          "50%": {
            boxShadow: "0 0 96px rgba(37, 99, 235, 0.4)",
          },
        },
        "spine-grow": {
          "0%": {
            height: "0%",
            opacity: "0",
          },
          "100%": {
            height: "100%",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-slide": "fade-slide 280ms ease-out",
        "accent-glow": "accent-glow 3s ease-in-out infinite",
        "spine-grow": "spine-grow 1s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
