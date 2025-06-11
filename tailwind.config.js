/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      colors: {
        'cream': '#faf9f6',
        'stone': {
          25: '#fdfcfb',
          50: '#faf9f7',
          100: '#f5f4f1',
          200: '#e8e6e0',
          300: '#d6d2c8',
          400: '#b8b2a3',
          500: '#9c947f',
          600: '#857b63',
          700: '#6f6651',
          800: '#5c5444',
          900: '#4d4539',
        }
      },
      animation: {
        'marquee-right': 'marquee-right 15s linear infinite',
        'marquee-left': 'marquee-left 15s linear infinite',
      },
      keyframes: {
        'marquee-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'marquee-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
} 