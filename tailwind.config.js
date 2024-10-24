/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/index.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-green': '#228B22',
        'custom-inactive-green': '#228b2282',
      },
      borderColor: {
        'custom-green': '#228B22',
      },
      colors: {
        'custom-green': '#228B22',
      },
      ringColor:{
        'custom-green': '#228B22',
      },
    },
  },
  plugins: [],
}

