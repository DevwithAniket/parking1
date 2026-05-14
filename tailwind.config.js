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
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      backdropBlur: {
        'glass': 'blur(12px)',
      },
      boxShadow: {
        'glass': 'rgba(255, 255, 255, 0.1) 0px 8px 32px 0px, rgba(255, 255, 255, 0.05) 0px 2px 8px 0px inset',
        'glass-dark': 'rgba(0, 0, 0, 0.2) 0px 8px 32px 0px, rgba(255, 255, 255, 0.05) 0px 2px 8px 0px inset',
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}
