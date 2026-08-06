import flowbiteReact from "flowbite-react/plugin/tailwindcss";
import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/lib/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    ".flowbite-react\\class-list.json",
  ],
  theme: {
    extend: {
      colors: {
        // ================= PRIMARY BRAND (Sophisticated Emerald Green) =================
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          // 500: "#059669", // Vibrant but rich corporate emerald green
          500: "#002650", // Vibrant but rich corporate emerald green
          600: "#047857", // Deep forest accent for hover states
          700: "#065f46",
          800: "#064e3b",
          900: "#022c22",
        },

        // ================= SECONDARY BRAND (Deep Forest Charcoal) =================
        secondary: {
          DEFAULT: "#111c17",
          hover: "#0a120f",
          light: "#1b2e26",
        },

        // ================= TEXT =================
        text: {
          DEFAULT: "#0f1714", // Very deep pine-charcoal for crisp reading contrast
          light: "#4b5563",
          muted: "#9ca3af",
          green: "#059669",
          "green-hover": "#047857",
          dark: "#f9fafb",
          "dark-light": "#cbd5e1",
          orange: "#F77E2D",
        },

        // ================= STATUS =================
        success: "#10b981",
        "success-hover": "#059669",
        "success-dark": "#34d399",

        warning: "#f59e0b",
        "warning-hover": "#d97706",
        "warning-dark": "#fcd34d",

        danger: "#ef4444",
        "danger-hover": "#dc2626",
        "danger-dark": "#f87171",

        info: "#06b6d4",
        "info-hover": "#0891b2",
        "info-dark": "#22d3ee",

        // ================= BUTTON =================
        button: {
          primary: "#059669", // Emerald green standard buttons
          "primary-hover": "#047857",
          "primary-dark": "#10b981",

          secondary: "#111c17", // Contrast corporate dark pine buttons
          "secondary-hover": "#0a120f",
          "secondary-dark": "#1b2e26",

          light: "#f9fafb",
          "light-dark": "#060c0a",

          success: "#10b981",
          "success-hover": "#059669",
          "success-dark": "#a7f3d0",

          danger: "#ef4444",
          "danger-hover": "#dc2626",
          "danger-dark": "#fecaca",
        },

        student: {
          DEFAULT: "#064e3b",
          hover: "#f59e0b", 
          active: "#059669",
          text: "#ffffff",
        },

        premium: {
          DEFAULT: "#111111", // black
          hover: "#f97316", // orange
          active: "#ea580c",
          text: "#ffffff",
        },

        // ================= SIDEBAR (Warm Safe Mint Cream / Slate Pine Dark) =================
        "sidebar-bg": "#002650", // Ultra soft, premium light-mint background tint
        "sidebar-text": "#d4af37",
        "sidebar-hover": "#d4af37", // Clean item hover highlights
        "sidebar-active": "#ccece0", // Distinct selected active item state
        "sidebar-border": "#e6f4ed",

        "sidebar-bg-dark": "#060c0a", // Ultra-premium rich dark mode forest base
        "sidebar-text-dark": "#f3f4f6",
        "sidebar-hover-dark": "#111c17",
        "sidebar-active-dark": "#0a120f",
        "sidebar-border-dark": "#1b2e26",

        // ================= NAVBAR =================
        "navbar-bg": "#ffffff",
        "navbar-text": "#0f1714",
        "navbar-border": "#f3f4f6",
        "navbar-hover": "#f4faf7",

        "navbar-bg-dark": "#060c0a",
        "navbar-text-dark": "#e5e7eb",
        "navbar-border-dark": "#111c17",
        "navbar-hover-dark": "#0a120f",
      },
    },
  },
  plugins: [flowbitePlugin, flowbiteReact],
};
