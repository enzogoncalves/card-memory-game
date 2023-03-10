/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
 theme: {
  extend: {
   boxShadow: {
    "dif-button": "3px 3px 4px rgba(0 0 0 / .5)",
    "dif-button-hover": "1px 1px 4px rgba(0 0 0 / .5)",
   },
  },
 },
 plugins: [],
}
