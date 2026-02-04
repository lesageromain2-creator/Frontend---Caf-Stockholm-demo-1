/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Palette luxe - identité visuelle */
        primary: {
          DEFAULT: '#C9A96E',
          gold: '#C9A96E',
          'gold-light': '#D4BC8E',
          'gold-dark': '#A68A5C',
          dark: '#1A1A1A',
          light: '#FAFAF8',
        },
        luxury: {
          gold: '#C9A96E',
          dark: '#1A1A1A',
          cream: '#FAFAF8',
          taupe: '#8B8680',
          'taupe-dark': '#5D5A56',
          stone: '#E8E4DC',
          burgundy: '#6B2C3E',
        },
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        accent: ['Montserrat', 'Futura', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.2' }],
        'h1': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.2' }],
        'h2': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.3' }],
        'h3': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.3' }],
      },
      letterSpacing: {
        'luxury': '0.1em',
        'luxury-wide': '0.15em',
      },
      boxShadow: {
        'luxury': '0 4px 16px rgba(201, 169, 110, 0.2)',
        'luxury-lg': '0 8px 32px rgba(201, 169, 110, 0.25)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
