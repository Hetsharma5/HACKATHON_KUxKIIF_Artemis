/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f3fbf2",
          100: "#dff5dd",
          200: "#bce9b8",
          300: "#8dd988",
          400: "#59bf57",
          500: "#2f9f31",
          600: "#238529",
          700: "#1f6b24",
          800: "#1d5522",
          900: "#19461e",
        },
        earth: {
          50: "#fffaf2",
          100: "#fcedd4",
          200: "#f9daa9",
          300: "#f3be70",
          400: "#ec9f40",
          500: "#df8221",
          600: "#c06818",
          700: "#9a4f17",
          800: "#7c4119",
          900: "#653719",
        },
      },
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(22, 84, 26, 0.35)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 380ms ease-out forwards",
      },
    },
  },
  plugins: [],
};
