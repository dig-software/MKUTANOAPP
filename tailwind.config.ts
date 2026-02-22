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
        forest: {
          50: "#f0faf4",
          100: "#dcf5e7",
          200: "#baebd0",
          300: "#87d9b0",
          400: "#4dbf87",
          500: "#27a368",
          600: "#1a8353",
          700: "#166842",
          800: "#155336",
          900: "#12442e",
          950: "#092619",
        },
        earth: {
          50: "#fdf8f0",
          100: "#faeedd",
          200: "#f4d9b6",
          300: "#ecbf84",
          400: "#e39d50",
          500: "#dc822e",
          600: "#ce6a23",
          700: "#ab531f",
          800: "#894220",
          900: "#6f381d",
          950: "#3c1b0c",
        },
        terra: {
          50: "#fdf4f0",
          100: "#fce7dd",
          200: "#f8ccba",
          300: "#f3a88d",
          400: "#ec7a5b",
          500: "#e35535",
          600: "#d03c22",
          700: "#ad2f1a",
          800: "#8e291a",
          900: "#76261b",
          950: "#400f09",
        },
        sand: {
          50: "#faf8f2",
          100: "#f3ede0",
          200: "#e7d9bf",
          300: "#d7bd96",
          400: "#c69d6a",
          500: "#ba864e",
          600: "#ac7343",
          700: "#8f5c39",
          800: "#754b34",
          900: "#603f2d",
          950: "#332016",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Lexend", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
