/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./_includes/**/*.njk",
    "./pages/**/*.njk",
    "./content/**/*.md",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            50:  "#f5f0ff",
            100: "#ede0ff",
            200: "#d8c0ff",
            300: "#b899f7",
            400: "#a87fda",
            500: "#7c3aed",
            600: "#6d28d9",
            700: "#1e1040",
          },
          teal: {
            50:  "#f0fafa",
            100: "#cceeee",
            200: "#99dddd",
            300: "#2bb5b5",
            400: "#0d8080",
            500: "#0a6666",
          },
          cream: "#faf7f2",
          dark:  "#1e1040",
        },
      },
      fontFamily: {
        display: ["Nunito", "ui-rounded", "sans-serif"],
        body:    ["Inter", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};
