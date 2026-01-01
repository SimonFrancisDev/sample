/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      royalgreen: '#0C3B2E',
      gold: '#D4AF37',
      platinum: '#B0B0B0',
      deepblack: '#0A0A0A',
      offwhite: '#F5F5F5',
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      playfair: ['Playfair Display', 'serif'],
    },
  },
},
  plugins: [],
};


