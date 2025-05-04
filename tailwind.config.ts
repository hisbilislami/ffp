import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary (Orange)
        "bill-orange": {
          50: "#FFF8F4",
          100: "#FFEEE4",
          200: "#FFE1D0",
          300: "#FFC7AA",
          400: "#FFA57C",
          500: "#F77E3D", // Main accent color
          600: "#E5621E",
          700: "#C24E16",
          800: "#A03D10",
          900: "#80300C",
        },
        // Blue
        "bill-blue": {
          50: "#F3F6FC",
          100: "#E6EDF9",
          200: "#D0DDF4",
          300: "#A9C0E9",
          400: "#7B9DDB",
          500: "#4D73C9", // Main blue color
          600: "#3759AE",
          700: "#284492",
          800: "#1C3276",
          900: "#12235C",
        },
        // Green
        "bill-green": {
          50: "#F1FBF4",
          100: "#E3F7E9",
          200: "#D0F1DC",
          300: "#ADDCBF",
          400: "#84CA9D",
          500: "#5AC17F", // Main green color
          600: "#44A968",
          700: "#329152",
          800: "#21783E",
          900: "#165F2F",
        },
        // Yellow
        "bill-yello": {
          50: "#FEFBF2",
          100: "#FEF6E0",
          200: "#FDF0C8",
          300: "#FADA8F",
          400: "#F9C74F", // Main yellow color
          500: "#F0B12A",
          600: "#DA9A1A",
          700: "#B67D13",
          800: "#94640E",
          900: "#76500A",
        },
        // Gray
        "bill-gray": {
          50: "#F9FAFB",
          100: "#F5F6F8",
          200: "#EBEDF0",
          300: "#DFE2E6",
          400: "#C5C8CE",
          500: "#9CA0A8",
          600: "#8A8A8A",
          700: "#61656D",
          800: "#4A4D53",
          900: "#333333",
        },
        "bill-dark": {
          50: "#C1C2C5",
          100: "#A6A7AB",
          200: "#909296",
          300: "#5C5F66",
          400: "#373A40",
          500: "#2C2E33",
          600: "#25262B",
          700: "#1A1B1E",
          800: "#141517",
          900: "#101113",
        },
      },
      fontFamily: {
        sans: [
          "Raleway",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
