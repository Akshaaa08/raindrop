/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        rain: {
          900: '#050c1a',
          800: '#091222',
          700: '#0e1d35',
          600: '#1a2f50',
          500: '#1e3a5f',
          400: '#2a4f7a',
          300: '#3b82f6',
          200: '#60a5fa',
          100: '#bfdbfe',
        },
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      },
    },
  },
  plugins: [],
};
