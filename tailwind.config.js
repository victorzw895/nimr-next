/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineClamp: {
        8: '8',
      }
    },
    colors: {
      'darkest': '#2C3333',
      'dark': '#395B64',
      'light': '#A5C9CA',
      'lightest': '#b8f0ff',
      'lightest-2': '#E7F6F2'
    }
  },
  variants: {
    lineClamp: ['responsive', 'hover']
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
  ],
}
