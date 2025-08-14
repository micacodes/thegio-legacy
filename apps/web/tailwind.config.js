/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-peach': '#FFD9C0',
        'brand-lime': '#D1E231',
        'brand-orange': '#F97316', // From the design's buttons
        'brand-dark': '#2C2A2A',   // A soft dark color for text
        'brand-bg': '#F8F7F4',     // The off-white page background
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};