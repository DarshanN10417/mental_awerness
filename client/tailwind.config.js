/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e9eef7',
          200: '#cbd9ee',
          300: '#9db9e0',
          400: '#6793cf',
          500: '#4373b8',
          600: '#325b99',
          700: '#2a497c',
          800: '#263f68',
          900: '#233758',
          950: '#17233a',
        },
        wellness: {
          bg: '#0b0f19', // Dark premium space theme
          card: '#161e2f',
          border: '#232f48',
          accent: '#818cf8', // Indigo/violet
          calm: '#34d399', // Emerald green
          alert: '#f87171', // Red
          warning: '#fbbf24', // Amber
          study: '#60a5fa', // Blue
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
