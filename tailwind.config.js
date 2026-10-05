/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0c3a2a",
          900: "#10503b",
          800: "#1d6b50",
          700: "#2b7f63",
          600: "#3a8f72",
        },
        sand: {
          100: "#f4ecd9",
          200: "#e8dcc0",
          300: "#d0c4a8",
          400: "#b3a583",
          500: "#7b705a",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // The offset "stacked card" look from the mockup
        card: "6px 7px 0 0 rgba(6, 36, 26, 0.55)",
        sandcard: "6px 7px 0 0 rgba(123, 112, 90, 0.9)",
      },
    },
  },
  plugins: [],
};
