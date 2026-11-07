/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grameen: {
          50: '#f0f9f4',
          100: '#dcf0e5',
          200: '#bbe1ce',
          300: '#8dcbad',
          400: '#5aae86',
          500: '#349366',
          600: '#237651',
          700: '#1c5e42',
          800: '#1b4d3e', // Deep village forest green
          900: '#153f34',
          950: '#0a231d',
        },
        cream: {
          50: '#fdfcf9',
          100: '#faf7f2',
          200: '#f4ede2',
          300: '#ecdecb',
          400: '#dec4a7',
          500: '#d0aa85',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
