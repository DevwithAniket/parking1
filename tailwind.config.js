/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        available: '#10b981',
        booked: '#f59e0b',
        occupied: '#ef4444',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
