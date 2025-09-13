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
			fontFamily: {
				unbounded: ["Unbounded", "cursive"],
			},

			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					50: "#e8f1fb",
					100: "#c6dcf6",
					200: "#a1c5f0",
					300: "#76ace9",
					400: "#4c91e1",
					500: "#0962d6",
					600: "#0857c1",
					700: "#0749a8",
					800: "#182641",
					900: "#193252",
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
				},
				background: {
					50: "#f1f3f8",
					100: "#dce0eb",
					200: "#b9c1d7",
					300: "#95a2c2",
					400: "#6f7fa7",
					500: "#4a5c89",
					600: "#32436b",
					700: "#243355",
					800: "#1c2948",
					900: "#182641",
					DEFAULT: "#182641",
					foreground: "#ffffff",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background) / <alpha-value>)",
					foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
					primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
					accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
					border: "hsl(var(--sidebar-border) / <alpha-value>)",
					ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
				},
				tuitionwave: {
					blue: "hsl(202 100% 50%)",
					lightblue: "#e8f0fe",
					red: "#ea4335",
					yellow: "#fbbc04",
					green: "#34a853",
					gray: "hsl(215 28% 17%)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
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
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
