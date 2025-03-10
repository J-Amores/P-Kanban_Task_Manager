/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#635FC7',
        'primary-light': '#A8A4FF',
        'destructive': '#EA5555',
        'destructive-light': '#FF9898',
        'dark-bg': '#20212C',
        'dark-gray': '#2B2C37',
        'medium-gray': '#3E3F4E',
        'light-gray': '#828FA3',
        'very-light-gray': '#F4F7FD',
        'white': '#FFFFFF',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 