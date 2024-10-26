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
        'custom-tan': "#ecfed6",
        'custom-light-green': "#37f831",
        'custom-orange': "#FF9900CC",
        "custom-orange-2": "#FFAD62",
        'custom-orange-3': "#FD6E06"
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

