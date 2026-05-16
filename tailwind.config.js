/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdbff',
          300: '#8ec4ff',
          400: '#589fff',
          500: '#2f7afe',
          600: '#195ef0',
          700: '#1549c9',
          800: '#163f9f',
          900: '#18397e',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 4px -1px rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};
