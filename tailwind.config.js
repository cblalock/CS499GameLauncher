/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fire-flicker': 'fire-flicker 1.5s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.8)) drop-shadow(0 0 16px rgba(234, 88, 12, 0.6))',
          },
          '50%': { 
            filter: 'drop-shadow(0 0 20px rgba(251, 146, 60, 1)) drop-shadow(0 0 30px rgba(234, 88, 12, 0.8))',
          },
        },
        'fire-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}