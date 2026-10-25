/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grameen: {
          50: '#f0f9f4',
          100: '#dcf0e5',
          200: '#bbe1ce',
          300: '#8dcbad',
          400: '#5aaE86',
          500: '#349366',
          600: '#237651',
          700: '#1c5e42',
          800: '#1b4d3e', // primary deep forest green
          900: '#13382c',
          950: '#0a2019',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // warm mustard golden
          700: '#b45309',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f7f3ec',
          200: '#eee5d8',
          300: '#e1d2bf',
        }
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
