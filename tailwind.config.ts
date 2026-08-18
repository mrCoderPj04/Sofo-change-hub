import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090D",
        surface: {
          DEFAULT: "#0D1219",
          secondary: "#111821",
          hover: "#161F2B",
          active: "#1C2736",
        },
        border: {
          DEFAULT: "#222B36",
          subtle: "#1B232E",
          hover: "#313D4D",
        },
        text: {
          primary: "#F5F7FA",
          secondary: "#8D98A8",
          muted: "#5B6675",
        },
        accent: {
          DEFAULT: "#00A3FF",
          hover: "#0284C7",
          muted: "rgba(0, 163, 255, 0.12)",
          border: "rgba(0, 163, 255, 0.25)",
        },
        purpleAccent: {
          DEFAULT: "#7C3AED",
          muted: "rgba(124, 58, 237, 0.12)",
          border: "rgba(124, 58, 237, 0.25)",
        },
        status: {
          success: "#10B981",
          successBg: "rgba(16, 185, 129, 0.12)",
          successBorder: "rgba(16, 185, 129, 0.25)",
          warning: "#F59E0B",
          warningBg: "rgba(245, 158, 11, 0.12)",
          warningBorder: "rgba(245, 158, 11, 0.25)",
          danger: "#EF4444",
          dangerBg: "rgba(239, 68, 68, 0.12)",
          dangerBorder: "rgba(239, 68, 68, 0.25)",
          info: "#00A3FF",
          infoBg: "rgba(0, 163, 255, 0.12)",
          infoBorder: "rgba(0, 163, 255, 0.25)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jet-brains)", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        card: "0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
        glass: "inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
