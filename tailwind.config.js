/** @type {import('tailwindcss').Config} — Kafé Stockholm */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Kafé Stockholm — palette (cursorrules 2.1) */
        kafe: {
          primary: '#1A4A8A',
          'primary-dark': '#0D2A5C',
          'primary-header': '#233C9D', // Header background from Figma
          'primary-light': '#2E6DB4',
          'primary-xlight': '#EBF2FF',
          accent: '#F5C842', // Updated from Figma (was #F5C518)
          'accent-dark': '#D4A000',
          accent2: '#C8302C',
          'accent2-dark': '#A02020',
          bg: '#FAF9F6', // Updated from Figma
          'bg-secondary': '#F5EDE0', // Updated from Figma
          'bg-tertiary': '#F2EDE4', // From Figma
          'bg-surface': '#EDE8DF', // From Figma
          wood: '#D4A96A',
          'wood-light': '#EDD9B0',
          text: '#1A1A1A', // Updated from Figma
          'text-secondary': '#4A4A4A', // Updated from Figma
          muted: '#888880', // Updated from Figma
          border: '#E0D5C5',
          divider: '#EDE3D0',
          surface: '#F2EDE0',
          charcoal: '#2C2C2C',
          offwhite: '#FDF6EC',
          pearl: '#EDE3D0',
          sage: '#558B2F',
          success: '#2E7D32',
          'success-light': '#E8F5E9', // Vegan badge
        },
        /* Aliases pour compatibilité */
        offwhite: '#FDF6EC',
        charcoal: '#2C2C2C',
        pearl: '#EDE3D0',
        gold: '#F5C518',
        sage: '#558B2F',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'], // Headings from Figma
        heading: ['DM Sans', 'Arial', 'sans-serif'], // Updated from Figma
        body: ['DM Sans', 'Arial', 'sans-serif'], // Updated from Figma
        inter: ['Inter', 'Arial', 'sans-serif'], // For buttons
      },
      fontSize: {
        hero: ['clamp(2.8rem, 5vw, 4.5rem)', { lineHeight: '1.15' }],
        h1: ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.2' }],
        h2: ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.3' }],
        h3: ['clamp(1.1rem, 1.8vw, 1.4rem)', { lineHeight: '1.35' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
        price: ['1.1rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        grid: '1400px',
      },
      borderRadius: {
        refined: '6px',
        capsule: '9999px',
        menu: '20px',
      },
      boxShadow: {
        refined: '0 2px 12px rgba(26, 74, 138, 0.07)',
        'refined-hover': '0 8px 32px rgba(26, 74, 138, 0.15)',
        card: '0 2px 12px rgba(26, 74, 138, 0.07)',
      },
      transitionDuration: {
        refined: '250ms',
      },
    },
  },
  plugins: [],
};
