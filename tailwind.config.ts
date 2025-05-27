
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2080FF',
					light: '#4DA3FF',
					accent: '#30A4FF',
					foreground: 'hsl(var(--primary-foreground))'
				},
				dark: {
					DEFAULT: '#0A0F25',
					secondary: '#141B34',
					card: '#1A2039'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				'rajdhani': ['Rajdhani', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
			},
			letterSpacing: {
				'wide': '0.05em',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'square': '12px',
				'pill': '30px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(40px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px)',
						opacity: '0.3'
					},
					'50%': {
						transform: 'translateY(-20px) translateX(10px)',
						opacity: '0.6'
					}
				},
				'pulse-neon': {
					'0%, 100%': {
						boxShadow: '0 0 20px #2080FF'
					},
					'50%': {
						boxShadow: '0 0 40px #30A4FF, 0 0 60px #2080FF'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.9)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'particle-float': {
					'0%': {
						transform: 'translate(0, 100vh) rotate(0deg)',
						opacity: '0'
					},
					'10%': {
						opacity: '0.3'
					},
					'90%': {
						opacity: '0.3'
					},
					'100%': {
						transform: 'translate(100px, -100px) rotate(360deg)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
				'scale-in': 'scale-in 0.15s ease-out',
				'particle-float': 'particle-float 30s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
