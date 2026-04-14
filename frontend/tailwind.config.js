/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // JUST ADD THIS ONE LINE RIGHT HERE:
  plugins: [
    require('@tailwindcss/typography'),
  ],
}