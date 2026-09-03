import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Segoe UI'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f8f9",
          100: "#eef1f3",
          200: "#d7dde2",
          300: "#b9c5cf",
          400: "#7890a3",
          500: "#4c6273",
          600: "#364957",
          700: "#253541",
          800: "#18232c",
          900: "#11191f",
          950: "#0b1014",
        },
        rail: {
          50: "#fdf8f2",
          100: "#faedd9",
          200: "#f3d39f",
          300: "#eab56a",
          400: "#dd973e",
          500: "#c87b1f",
          600: "#a55f16",
          700: "#834712",
          800: "#693813",
          900: "#562f14",
        },
        success: "#177245",
        danger: "#b7392d",
        warning: "#9a6400",
      },
      boxShadow: {
        panel: "0 20px 45px -25px rgba(17, 25, 31, 0.25), 0 1px 3px 0 rgba(17, 25, 31, 0.05)",
        card: "0 4px 20px -2px rgba(17, 25, 31, 0.06), 0 2px 6px -1px rgba(17, 25, 31, 0.03)",
        elevated: "0 12px 32px -4px rgba(17, 25, 31, 0.12), 0 4px 12px -2px rgba(17, 25, 31, 0.05)",
        focus: "0 0 0 3px rgba(221, 151, 62, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInFast: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-fast": "fadeInFast 160ms ease-out forwards",
        "slide-left": "slideLeft 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-right": "slideRight 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
