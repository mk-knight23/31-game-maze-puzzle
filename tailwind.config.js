/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: { bg: '#0a0a1a', accent: '#00d4ff', gold: '#ffd700', success: '#00ff88' }
      },
      fontFamily: { game: ['Orbitron', 'monospace'] },
    },
  },
  plugins: [],
}
