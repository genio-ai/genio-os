// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.js",
    "./components/**/*.js",
    "./pages/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          50: "#E6FBFF",
          100: "#BAF0FF",
          500: "#00C9FF",
          700: "#0097C1",
          900: "#005E80",
        },
      },
    },
  },
  plugins: [],
};
