/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#99c1de",
        secondary: "#d6e2e9",
        border: "#94ccf1",
        button: "#4ea8de",
      }
    },
  },
  plugins: [],
}

