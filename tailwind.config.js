/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maze: {
          neon: '#00f3ff',
          grid: '#1e1b4b',
          bg: '#020617',
          success: '#10b981',
          light: {
            bg: '#f8fafc',
            grid: '#e2e8f0',
            neon: '#0ea5e9',
          }
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
