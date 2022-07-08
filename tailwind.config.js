/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{html,php,js}", "./public/**/*.{html,php,js}"],
  theme: {
    screens: {
      'xxxs': '100px',
      'xxs': '250px',
      'xs': '320px',
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [],
}
