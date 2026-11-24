/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emeraldBrand: {
          DEFAULT: '#059669',
          dark: '#047857',
          light: '#ECFDF5',
        },
      },
    },
  },
  plugins: [],
};
