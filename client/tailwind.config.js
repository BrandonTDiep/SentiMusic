/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Poppins', 'sans-serif'], 
        secondary: ['Roboto', 'sans-serif'], 
      },
    },
  },
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        mytheme: {
          "primary": "#1DB954",
          "primary-content": "#ffffff",
          "secondary": "#121212",
          "secondary-content": "#b3b3b3",
          "accent": "#1ED760",
          "accent-content": "#ffffff",
          "neutral": "#121212",
          "neutral-content": "#e1e1e1",
          "base-100": "#121212",
          "base-content": "#ffffff",
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}