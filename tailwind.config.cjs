/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
 content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
 darkMode: "class",
 theme: {
  screens: {
   "2xsm": "320px",
   xsm: "440px",
   ...defaultTheme.screens,
  },
  extend: {
   boxShadow: {
    "dif-button": "3px 3px 6px rgba(0 0 0 / .5)",
    "dif-button-hover": "1px 1px 6px rgba(0 0 0 / .5)",
   },
   colors: {
    "text-color": "#F4F4F5",
   },
   gridTemplateColumns: {
    "header-default": "1fr auto",
    header: "70px 1fr 70px",
    "header-md": "140px 1fr 130px",
   },
  },
 },
 plugins: [],
}
