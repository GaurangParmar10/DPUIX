import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // DigitalBridge Deep Navy + Warm Gold + Cream Palette
        navy: {
          950: "#09121F", // App Canvas Deepest
          900: "#0F1C2E", // App Canvas Primary Base (#0F1C2E)
          850: "#16263B", // Primary Surface (#16263B)
          800: "#1E3250", // Card Background (#1E3250)
          750: "#243B58", // Elevated Surface (#243B58)
          700: "#2F4A6F", // Border Muted Navy
          650: "#3B5A85", // Intermediate Border
          600: "#496E9E", // Lighter Border Highlight
        },
        goldAccent: {
          DEFAULT: "#D4AF6B", // Primary Warm Gold (#D4AF6B)
          hover: "#C09955",   // Hover State
          muted: "#A27F3E",   // Darker Muted Gold
          light: "#E6C98F",   // Soft Gold (#E6C98F)
          bg: "#262013",      // Warm Gold Background Tint
        },
        tealAccent: {
          // Backward compatibility alias pointing to Primary Warm Gold
          DEFAULT: "#D4AF6B",
          hover: "#C09955",
          muted: "#A27F3E",
          light: "#E6C98F",
          bg: "#262013",
        },
        cream: {
          DEFAULT: "#F4EBDD", // Cream (#F4EBDD)
          light: "#FDFBF7",   // Warm White
          muted: "#D9CDB8",   // Muted Cream
        },
        brandBlue: {
          DEFAULT: "#6F9CC4", // Soft Blue (#6F9CC4)
          light: "#9BB9D2",   // Light Blue (#9BB9D2)
          bg: "#16283D",      // Soft Blue Background Tint
        },
        risk: {
          low: {
            text: "#4CAF7D",  // Success Green (#4CAF7D)
            bg: "#112C1E",    // Deep Forest Green
            border: "#1E5437",
            icon: "#4CAF7D",
          },
          warning: {
            text: "#D4A34A",  // Warning Amber (#D4A34A)
            bg: "#2B2213",    // Deep Amber Warning
            border: "#543F1E",
            icon: "#D4A34A",
          },
          high: {
            text: "#D96868",  // Danger Red (#D96868)
            bg: "#2E1517",    // Deep Crimson Danger
            border: "#592125",
            icon: "#D96868",
          },
        },
        slateText: {
          primary: "#F6F4EF",   // Cream White Primary Text (#F6F4EF)
          secondary: "#AEB9C6", // Muted Slate Secondary Text (#AEB9C6)
          muted: "#7B8B9E",     // Darker Slate Text
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Manrope", "system-ui", "-apple-system", "sans-serif"],
      },
      minHeight: {
        touch: "48px",
        "touch-lg": "56px",
      },
      minWidth: {
        touch: "48px",
        "touch-lg": "56px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
        "card-elevated": "0 8px 30px -4px rgba(0, 0, 0, 0.5)",
        "glow-gold": "0 0 24px -4px rgba(212, 175, 107, 0.25)",
        "glow-emerald": "0 0 24px -4px rgba(76, 175, 125, 0.25)",
        "glow-amber": "0 0 24px -4px rgba(212, 163, 74, 0.25)",
        focus: "0 0 0 3px rgba(212, 175, 107, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
