import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          500: '#1a56db',
          600: '#1e40af',
          700: '#1a365d',
          800: '#153e75',
          900: '#0f2a52',
        },
        secondary: {
          400: '#fb923c',
          500: '#ed8936',
          600: '#dd6b20',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
